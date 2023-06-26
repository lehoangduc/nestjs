import { ConfigService } from '@nestjs/config'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl as getSignedUrlCloudfront } from '@aws-sdk/cloudfront-signer'
import * as crypto from 'crypto'
import dayjs from 'dayjs'

import { FILE_STORAGE_ENGINE_S3 } from '../file-storage.constants'
import {
  FileStorageEngine,
  FileStorageGetUrlOptions,
  FileStorageMeta,
  FileStorageStoreOptions,
  FileStorageUpload,
} from '../file-storage.interfaces'

export class FileStorageEngineS3 implements FileStorageEngine {
  private configService: ConfigService
  private client: S3Client

  setConfigService(configService: ConfigService): FileStorageEngine {
    this.configService = configService

    return this
  }

  setClient(client: S3Client): FileStorageEngine {
    this.client = client

    return this
  }

  async store(buffer: Buffer, options?: FileStorageStoreOptions): Promise<any> {
    const bucket = this.configService.get('s3.bucket') || 'assets'
    const keyPrefix = this.configService.get('s3.keyPrefix')
    const key = (keyPrefix ? `${keyPrefix}/` : '') + (options?.key || crypto.randomUUID())
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: options?.mime_type,
      Body: buffer,
    })

    await this.client.send(command)

    return {
      engine: FILE_STORAGE_ENGINE_S3,
      bucket,
      ...options,
      key,
    }
  }

  async remove(meta: FileStorageMeta): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: meta.bucket, Key: meta.key }))
  }

  async prepareUpload(
    storeOptions?: FileStorageStoreOptions & FileStorageGetUrlOptions,
    payload?: any
  ): Promise<FileStorageUpload | null> {
    const bucket = this.configService.get('s3.bucket') || 'assets'
    const keyPrefix = this.configService.get('s3.keyPrefix')
    const key = (keyPrefix ? `${keyPrefix}/` : '') + (storeOptions.key || crypto.randomUUID())
    const conditions: any = [['starts-with', '$key', keyPrefix ? `${keyPrefix}/` : '']]

    if (
      Array.isArray(storeOptions?.content_length_ranges) &&
      storeOptions?.content_length_ranges.length === 2
    ) {
      conditions.push([
        'content-length-range',
        storeOptions.content_length_ranges[0],
        storeOptions.content_length_ranges[1],
      ])
    }

    const { url, fields } = await createPresignedPost(this.client, {
      Bucket: bucket,
      Key: key,
      Conditions: conditions,
      Fields: {
        'Content-Type': storeOptions?.mime_type,
      },
      Expires: storeOptions?.expires || 5 * 60,
    })

    return {
      url,
      meta: {
        engine: FILE_STORAGE_ENGINE_S3,
        bucket,
        ...storeOptions,
        key,
      },
      payload,
      fields,
    }
  }

  async getUrl(meta: FileStorageMeta, options?: FileStorageGetUrlOptions): Promise<string> {
    if (!meta?.bucket || !meta?.key) return null

    const cloudFrontUrl = this.configService.get('s3.cloudFrontUrl')

    if (!cloudFrontUrl) {
      const command = new GetObjectCommand({
        Bucket: meta.bucket,
        Key: meta.key,
      })

      return await getSignedUrl(this.client, command, {
        expiresIn: options?.no_expires ? null : options?.expires || 90000, // 1d 1h,
      })
    }

    return getSignedUrlCloudfront({
      url: `${cloudFrontUrl}/${meta.key}`,
      keyPairId: this.configService.get('s3.cloudFrontKeyPairId'),
      privateKey: this.configService.get('s3.cloudFrontPrivateKey'),
      dateLessThan: dayjs().add(25, 'h').toISOString(), // 1d 1h
    })
  }
}
