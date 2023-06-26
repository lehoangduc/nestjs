import { MailerModule } from '@nestjs-modules/mailer'
import { DynamicModule, Global, Module } from '@nestjs/common'

import { MailService } from './services/mail.service'

@Global()
@Module({})
export class MailModule {
  static forRootAsync(options: any): DynamicModule {
    return {
      module: MailModule,
      imports: [MailerModule.forRootAsync(options)],
      providers: [MailService],
      exports: [MailService],
    }
  }
}
