import { CacheModuleAsyncOptions, DynamicModule, Global, Module } from '@nestjs/common'

import { CACHE_MODULE_OPTIONS, CACHE_SERVICE } from './cache.constants'
import { CacheService } from './services'

@Global()
@Module({})
export class CacheModule {
  static forRootAsync(options: CacheModuleAsyncOptions): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: CACHE_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: CACHE_SERVICE,
          useFactory: async (options: any) => {
            const service = new CacheService(options)
            await service.connect()
            return service.getClient()
          },
          inject: [CACHE_MODULE_OPTIONS],
        },
      ],
      exports: [CACHE_SERVICE],
    }
  }
}
