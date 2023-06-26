import { Global, Module } from '@nestjs/common'

import { TypeOrmExModule } from '@core/database/typeorm-ex.module'
import { SettingsRepository } from './repositories'
import { SettingsSubscriber } from './subscribers'
import { SettingsCacheService, SettingsService } from './services'

@Global()
@Module({
  imports: [TypeOrmExModule.forCustomRepository([SettingsRepository])],
  providers: [SettingsSubscriber, SettingsService, SettingsCacheService],
  exports: [SettingsService, SettingsCacheService],
})
export class SettingsModule {}
