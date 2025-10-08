import { Injectable } from '@nestjs/common';
import { GithubStorageService } from './github-storage.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class FileStorageService {
  constructor(
    private githubStorage: GithubStorageService,
    private localStorage: LocalStorageService,
  ) {}

  async uploadProductImage(
    file: Express.Multer.File, 
    productId: number
  ): Promise<{ localPath: string; githubUrl?: string }> {
    
    const filename = `main-${Date.now()}.${file.originalname.split('.').pop()}`;
    const folder = `products/${productId}`;

    // 1. Сохраняем локально
    const localPath = await this.localStorage.saveFile(file, folder, filename);

    // 2. Асинхронная загрузка в GitHub
    this.githubStorage.uploadToGitHub(file, `${folder}/${filename}`)
      .then(githubUrl => {
        console.log('Uploaded to GitHub:', githubUrl);
      })
      .catch(error => {
        console.error('GitHub upload failed:', error);
      });

    return { localPath };
  }

  async getImageUrl(path: string): Promise<string> {
    // Сначала проверяем локально
    const exists = await this.localStorage.fileExists(path);
    if (exists) {
      return path;
    }

    // Если нет локально - пытаемся получить из GitHub
    try {
      const githubUrl = await this.githubStorage.getGitHubUrl(path);
      return githubUrl;
    } catch {
      throw new Error(`Image not found: ${path}`);
    }
  }
}