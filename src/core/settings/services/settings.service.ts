import { Injectable } from '@nestjs/common'
import { ForbiddenError, subject } from '@casl/ability'
import { plainToInstance } from 'class-transformer'

import { AppErrors } from '@core/common/errors/app-errors'
import { UserAbility } from '@core/casl/casl-ability.factory'
import { UserAction } from '@core/casl/enums/user-action.enum'
import { SettingsKey } from '../settings.enums'
import { Setting } from '../entities'
import { SettingsRepository } from '../repositories'

@Injectable()
export class SettingsService {
  constructor(private readonly repository: SettingsRepository) {}

  findAll(params: any, ability?: UserAbility): Promise<Setting[]> {
    if (!params.filter) params.filter = {}

    if (ability && ability.pure.cannot(UserAction.Read, 'all')) {
      params.filter.is_public = true
    }

    return this.repository.findAll(params)
  }

  async findByCode(code: string, ability?: UserAbility): Promise<Setting> {
    const setting = await this.repository.findOneBy({ code })
    if (!setting) throw AppErrors.EntityNotFoundError.create('Setting')

    if (ability && !ability.pure.can(UserAction.Read, 'all')) {
      if (!setting.is_public) throw AppErrors.EntityNotFoundError.create('Setting')
    }

    return plainToInstance(Setting, { ...setting, value: setting.toValue() })
  }

  async update(data: object, ability?: UserAbility) {
    if (ability) {
      ForbiddenError.from(ability.pure).throwUnlessCan(UserAction.Manage, subject('Setting', {}))
    }

    if (!data) return

    for (const key in SettingsKey) {
      const code = SettingsKey[key]
      if (data[code] !== undefined) {
        let setting = await this.repository.findOneBy({ code })
        if (!setting) {
          setting = new Setting()
          setting.code = code
          setting.value = data[code]
        } else {
          setting.value = data[code]
        }

        setting.value = setting.fromValue()

        await this.repository.saveEntity(setting)
      }
    }
  }
}
