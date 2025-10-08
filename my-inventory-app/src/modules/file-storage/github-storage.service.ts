import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from 'octokit';
import { decryptToken } from '@scripts/decrypt-token';

@Injectable()
export class GithubStorageService {
  private octokit: Octokit | null = null;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(private configService: ConfigService) {
    this.owner = this.configService.get('GITHUB_MEDIA_OWNER') || 'poetrydeveloper';
    this.repo = this.configService.get('GITHUB_MEDIA_REPO') || 'my-inventory-app_media';
    this.branch = this.configService.get('GITHUB_MEDIA_BRANCH') || 'main';
  }

  private async getOctokit(): Promise<Octokit> {
    if (!this.octokit) {
      const encryptedToken = this.configService.get('ENCRYPTED_GITHUB_TOKEN');
      const encryptionKey = this.configService.get('ENCRYPTION_KEY');
      
      if (!encryptedToken || !encryptionKey) {
        throw new Error('GitHub token not configured');
      }

      const token = decryptToken(encryptedToken, encryptionKey);
      this.octokit = new Octokit({ auth: token });
    }
    return this.octokit;
  }

  async uploadToGitHub(file: Express.Multer.File, path: string): Promise<string> {
    try {
      const octokit = await this.getOctokit();
      const content = file.buffer.toString('base64');
      
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

  async getGitHubUrl(path: string): Promise<string> {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;
  }

  async fileExistsInGitHub(path: string): Promise<boolean> {
    try {
      const octokit = await this.getOctokit();
      await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: this.owner,
        repo: this.repo,
        path: path,
        branch: this.branch,
      });
      return true;
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }
}