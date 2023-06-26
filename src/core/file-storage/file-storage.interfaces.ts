import { ConfigService } from '@nestjs/config'
import { S3Client } from '@aws-sdk/client-s3'

export interface FileStorageEngine {
  setConfigService(configService: ConfigService): FileStorageEngine
  setClient(client: S3Client): FileStorageEngine
  store(buffer: Buffer, options?: FileStorageStoreOptions): Promise<FileStorageMeta>
  remove(meta: FileStorageMeta): Promise<void>
  prepareUpload(
    storeOptions?: FileStorageStoreOptions & FileStorageGetUrlOptions,
    payload?: any
  ): Promise<FileStorageUpload | null>
  getUrl(meta: FileStorageMeta, options?: FileStorageGetUrlOptions): Promise<string | null>
}

export interface FileStorageStoreOptions {
  id?: string
  uuid?: string
  key?: string
  file_name?: string
  mime_type?: string
  ext?: string
  [key: string]: any
}

export interface FileStorageGetUrlOptions {
  no_expires?: boolean
  expires?: number
  content_length_ranges?: number[]
}

export interface FileStorageMeta {
  engine: string
  bucket?: string
  id?: string
  uuid?: string
  key: string
  file_name?: string
  mime_type?: string
  ext?: string
  [key: string]: any
}

export interface FileStorageUpload {
  url: string
  meta: FileStorageMeta
  payload?: any
  fields?: any
  is_removed?: boolean
}
