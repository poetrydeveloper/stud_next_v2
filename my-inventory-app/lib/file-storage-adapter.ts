// lib/file-storage-adapter.ts
import { decryptToken } from './decryption/decrypt-token'; // ← ИСПРАВЛЕН ПУТЬ
import { Octokit } from 'octokit';
import { ensureDir, writeFile } from 'fs-extra';
import { join } from 'path';
import sharp from 'sharp';

export class FileStorageAdapter {
  private octokit: Octokit | null = null;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor() {
    this.owner = process.env.GITHUB_MEDIA_OWNER || 'poetrydeveloper';
    this.repo = process.env.GITHUB_MEDIA_REPO || 'my-inventory-app_media';
    this.branch = process.env.GITHUB_MEDIA_BRANCH || 'main';
  }

  private async getOctokit(): Promise<Octokit> {
    if (!this.octokit) {
      const encryptedToken = process.env.ENCRYPTED_GITHUB_TOKEN;
      const encryptionKey = process.env.ENCRYPTION_KEY;
      
      if (!encryptedToken || !encryptionKey) {
        throw new Error('GitHub token not configured');
      }

      const token = decryptToken(encryptedToken, encryptionKey);
      this.octokit = new Octokit({ auth: token });
    }
    return this.octokit;
  }

  async saveFileLocally(file: Buffer, folder: string, filename: string): Promise<string> {
    const mediaPath = join(process.cwd(), 'public', 'media');
    const folderPath = join(mediaPath, folder);
    const filePath = join(folderPath, filename);
    
    await ensureDir(folderPath);
    await writeFile(filePath, file);
    
    return `/media/${folder}/${filename}`;
  }

  async uploadToGitHub(file: Buffer, path: string): Promise<string> {
    try {
      const octokit = await this.getOctokit();
      const content = file.toString('base64');
      
      const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: this.owner,
        repo: this.repo,
        path: path,
        message: `Upload ${path}`,
        content: content,
        branch: this.branch,
      });

      return response.data.content.download_url;
    } catch (error) {
      console.error('GitHub upload error:', error);
      throw new Error(`Failed to upload to GitHub: ${error.message}`);
    }
  }

  async processImage(originalBuffer: Buffer, productCode: string): Promise<{ buffer: Buffer; filename: string; format: string }> {
    try {
      let quality = 80;
      let processedBuffer: Buffer;
      
      // Постепенно уменьшаем качество пока размер не станет <= 100KB
      do {
        processedBuffer = await sharp(originalBuffer)
          .resize(600, 600, { // Уменьшаем размер для лучшего сжатия
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ 
            quality: quality,
            effort: 6
          })
          .toBuffer();

        // Уменьшаем качество на 5% каждую итерацию
        quality -= 5;
        
        // Защита от бесконечного цикла
        if (quality < 30) break;
        
      } while (processedBuffer.length > 100 * 1024); // 100KB

      const filename = `${productCode}.webp`;

      console.log(`✅ Image processed: ${processedBuffer.length / 1024}KB, quality: ${quality + 5}%`);

      return {
        buffer: processedBuffer,
        filename,
        format: 'webp'
      };

    } catch (error) {
      console.error('❌ Image processing failed:', error);
      throw new Error(`Ошибка обработки изображения: ${error.message}`);
    }
  }

  async uploadProductImage(file: File, productId: number, productCode: string) {
    try {
      // Конвертируем File в Buffer
      const originalBuffer = Buffer.from(await file.arrayBuffer());
      
      // Обрабатываем изображение
      const { buffer: processedBuffer, filename } = await this.processImage(originalBuffer, productCode);
      const folder = `products/${productId}`;

      // Проверяем конечный размер
      if (processedBuffer.length > 100 * 1024) {
        throw new Error(`Не удалось сжать изображение до 100KB. Текущий размер: ${Math.round(processedBuffer.length / 1024)}KB`);
      }

      // 1. Сохраняем локально обработанное изображение
      const localPath = await this.saveFileLocally(processedBuffer, folder, filename);

      // 2. Асинхронно загружаем в GitHub
      let githubUrl: string | undefined;
      try {
        githubUrl = await this.uploadToGitHub(processedBuffer, `${folder}/${filename}`);
        console.log('✅ Uploaded to GitHub:', githubUrl);
      } catch (error) {
        console.error('❌ GitHub upload failed:', error);
      }

      return { 
        localPath, 
        githubUrl,
        filename,
        format: 'webp',
        size: processedBuffer.length
      };

    } catch (error) {
      console.error('❌ Image upload failed:', error);
      throw new Error(`Ошибка загрузки изображения: ${error.message}`);
    }
  }

  // Метод для проверки поддержки формата
  isImageFormatSupported(file: File): boolean {
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return supportedFormats.includes(file.type);
  }

  // Метод для валидации размера файла (макс 10MB)
  validateFileSize(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  }
}