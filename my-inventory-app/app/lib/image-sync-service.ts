import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Octokit } from 'octokit';

export class ImageSyncService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({ 
      auth: process.env.GITHUB_MEDIA_TOKEN
    });
  }

  /**
   * Получить URL изображения с автоматической синхронизацией
   */
  async getImageUrl(imagePath: string): Promise<string> {
    console.log('🔄 ImageSyncService: получение URL для', imagePath);
    
    const localPath = join(process.cwd(), 'public', imagePath);
    
    // 1. Если файл есть локально - используем его
    if (existsSync(localPath)) {
      console.log('✅ Локальный файл найден:', imagePath);
      return imagePath;
    }

    console.log('❌ Локальный файл не найден, пробуем GitHub...');

    // 2. Если нет локально - пробуем скачать из GitHub
    try {
      await this.syncImageFromGitHub(imagePath);
      console.log('✅ Успешно синхронизировано из GitHub:', imagePath);
      return imagePath;
    } catch (error: any) {
      console.error('❌ Ошибка синхронизации из GitHub:', {
        imagePath,
        error: error.message
      });
      
      // 3. Если в БД есть githubUrl - используем прямую ссылку
      const imageRecord = await this.findImageInDatabase(imagePath);
      if (imageRecord?.githubUrl) {
        console.log('✅ Используем GitHub URL из БД:', imageRecord.githubUrl);
        return imageRecord.githubUrl;
      }

      console.log('⚠️  Все методы не сработали, используем плейсхолдер');
      
      // 4. Если ничего не сработало - возвращаем заглушку
      return '/images/placeholder.svg';
    }
  }

  /**
   * Синхронизировать изображение из GitHub
   */
  private async syncImageFromGitHub(imagePath: string): Promise<void> {
    const owner = process.env.GITHUB_MEDIA_OWNER || 'poetrydeveloper';
    const repo = process.env.GITHUB_MEDIA_REPO || 'my-inventory-app_media';
    const branch = process.env.GITHUB_MEDIA_BRANCH || 'main';

    // Убираем первый слэш И папку media/ для GitHub пути
    let githubPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    // Убираем префикс 'media/' если он есть
    if (githubPath.startsWith('media/')) {
      githubPath = githubPath.slice(6); // убираем 'media/'
    }

    console.log('📡 Запрос к GitHub API:', {
      owner,
      repo,
      branch,
      githubPath,
      originalPath: imagePath
    });

    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: githubPath,
        branch,
      });

      console.log('📊 Ответ GitHub API:', {
        status: response.status,
        type: response.data.type,
        size: response.data.size,
        name: response.data.name
      });

      if (response.data.type === 'file') {
        // Декодируем base64 контент
        const content = Buffer.from(response.data.content, 'base64');
        
        // Создаем локальную директорию (сохраняем с оригинальным путем включая media/)
        const localDir = join(process.cwd(), 'public', ...imagePath.split('/').slice(0, -1));
        console.log('📁 Создаем директорию:', localDir);
        mkdirSync(localDir, { recursive: true });
        
        // Сохраняем файл локально с оригинальным путем
        const localPath = join(process.cwd(), 'public', imagePath);
        console.log('💾 Сохраняем файл:', localPath);
        writeFileSync(localPath, content);
        
        console.log('✅ Изображение синхронизировано из GitHub:', imagePath);
      } else {
        throw new Error(`GitHub path is not a file: ${response.data.type}`);
      }
    } catch (error: any) {
      console.error('💥 Ошибка GitHub API:', {
        githubPath,
        originalPath: imagePath,
        status: error.status,
        message: error.message,
        response: error.response?.data
      });
      throw new Error(`Image not found in GitHub: ${githubPath} - ${error.message}`);
    }
  }

  /**
   * Найти изображение в БД по пути
   */
  private async findImageInDatabase(imagePath: string) {
    console.log('🔍 Поиск изображения в БД по пути:', imagePath);
    // Нужно добавить Prisma запрос
    // Пока заглушка
    return null;
  }
}