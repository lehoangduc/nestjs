import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client } from '@aws-sdk/client-s3'

import { S3_SERVICE } from '@core/s3'

import { FILE_STORAGE_ENGINE_S3 } from '../file-storage.constants'
import {
  FileStorageEngine,
  FileStorageGetUrlOptions,
  FileStorageMeta,
} from '../file-storage.interfaces'
import { FileStorageEngineS3 } from '../engines'

@Injectable()
export class FileStorageService {
  private engines: { [key: string]: FileStorageEngine }

  constructor(
    private readonly configService: ConfigService,
    @Inject(S3_SERVICE) private readonly s3: S3Client
  ) {
    this.engines = {
      [FILE_STORAGE_ENGINE_S3]: new FileStorageEngineS3()
        .setConfigService(this.configService)
        .setClient(this.s3),
    }
  }

  getEngine(engine?: string): FileStorageEngine {
    if (!engine) engine = this.configService.get('fileStorage.engine')
    if (!this.engines[engine]) throw new Error(`The engine ${engine} is not supported`)

    return this.engines[engine]
  }

  getUrl(meta: FileStorageMeta, options?: FileStorageGetUrlOptions): Promise<string | null> {
    if (!meta?.engine) return null

    return this.engines[meta.engine].getUrl(meta, options)
  }
}
