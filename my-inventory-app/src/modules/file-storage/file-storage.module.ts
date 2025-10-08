import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { GithubStorageService } from './github-storage.service';
import { LocalStorageService } from './local-storage.service';
import { LegacyAdapterService } from './legacy-adapter.service';
import { ApiIntegrationService } from './api-integration.service';

@Module({
  providers: [
    FileStorageService, 
    GithubStorageService, 
    LocalStorageService,
    LegacyAdapterService,
    ApiIntegrationService,
  ],
  exports: [FileStorageService, LegacyAdapterService, ApiIntegrationService],
})
export class FileStorageModule {}