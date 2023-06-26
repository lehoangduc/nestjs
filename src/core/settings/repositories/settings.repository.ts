import { plainToInstance } from 'class-transformer'

import { CustomRepository, TypeOrmMongoRepository } from '@core/database'
import { Setting } from '../entities'

@CustomRepository(Setting)
export class SettingsRepository extends TypeOrmMongoRepository<Setting> {
  async findAll(params: any): Promise<Setting[]> {
    const filters: any = []
    const options: any = {}

    if (params?.filter?.is_public) {
      filters.push({
        is_public: true,
      })
    }

    if (filters.length) options.where = { $and: filters }

    const settings = await this.find(options)

    return settings.map((setting) => {
      return plainToInstance(Setting, { ...setting, value: setting.toValue() })
    })
  }
}
