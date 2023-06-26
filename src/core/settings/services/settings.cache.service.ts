import { Inject, Injectable } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'
import { plainToInstance } from 'class-transformer'

import { CACHE_SERVICE } from '@core/cache/cache.constants'
import { Setting } from '../entities'
import { SettingsRepository } from '../repositories'

@Injectable()
export class SettingsCacheService {
  public static readonly KEY_SETTINGS = 'settings'

  constructor(
    private readonly logger: PinoLogger,
    private readonly repository: SettingsRepository,
    @Inject(CACHE_SERVICE) private readonly cacheService
  ) {}

  updateSetting(setting: Setting) {
    return this.cacheService.hSet(SettingsCacheService.KEY_SETTINGS, {
      [setting.code]: JSON.stringify(setting),
    })
  }

  async getSetting(code: string): Promise<Setting> {
    let setting = null

    try {
      const data = await this.cacheService.hGet(SettingsCacheService.KEY_SETTINGS, code)
      if (data) setting = plainToInstance(Setting, JSON.parse(data))
    } catch (err) {
      this.logger.error(err)
    }

    if (!setting) {
      setting = await this.repository.findOneBy({ code })
    }

    if (setting) setting.value = setting.toValue()

    return setting
  }
}
