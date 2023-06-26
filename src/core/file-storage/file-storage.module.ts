import { Global, Module } from '@nestjs/common'

import { FileStorageService } from './services'

@Global()
@Module({
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
