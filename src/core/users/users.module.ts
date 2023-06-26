import { Module } from '@nestjs/common'

import { TypeOrmExModule } from '@core/database/typeorm-ex.module'
import { SettingsRepository } from '@core/settings/repositories/settings.repository'
import { UsersForgotPasswordRepository, UsersRepository } from './repositories'
import { UsersSubscriber } from './subscribers'
import { UsersService } from './services'

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      SettingsRepository,
      UsersRepository,
      UsersForgotPasswordRepository,
    ]),
  ],
  providers: [UsersSubscriber, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
