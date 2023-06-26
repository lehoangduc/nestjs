import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { I18nModule, I18nService } from 'nestjs-i18n'
import { LoggerModule } from 'nestjs-pino'
import { join } from 'path'

import { TransformInterceptor, AllExceptionsFilter, formatDateTime } from '@core/common'
import { configuration } from '@core/config'
import { CacheModule } from '@core/cache'
import { CaslModule } from '@core/casl'
import { MailModule } from '@core/mail/mail.module'
import { S3Module } from '@core/s3'
import { FileStorageModule } from '@core/file-storage'
import { AuthModule, PoliciesGuard } from '@core/auth'
import { Setting, SettingsModule } from '@core/settings'
import { User, UserForgotPassword, UsersModule } from '@core/users'

import SettingsController from './settings/settings.controller'
import AuthController from './auth/auth.controller'
import UsersController from './users/users.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'warn',
        timestamp: () => {
          return `,"time":"${formatDateTime(new Date(), 'ISO', 'UTC')}"`
        },
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
      },
    }),
    EventEmitterModule.forRoot(),
    CacheModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        username: configService.get('redis.username'),
        password: configService.get('redis.password'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mongodb',
          url: configService.get('mongodb.connectionString'),
          database: configService.get('mongodb.database'),
          useUnifiedTopology: true,
          useNewUrlParser: true,
          synchronize: true,
          logging: false,
          entities: [Setting, User, UserForgotPassword],
        }
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: {
        path: join(__dirname, '/core/i18n'),
        watch: true,
      },
    }),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        accessKeyId: configService.get('s3.accessKeyId'),
        secretAccessKey: configService.get('s3.secretAccessKey'),
        region: configService.get('s3.region'),
      }),
    }),
    MailModule.forRootAsync({
      useFactory: async (config: ConfigService, i18n: I18nService) => ({
        transport: {
          host: config.get('mail.host'),
          port: config.get('mail.port'),
          secure: config.get('mail.secure'),
          auth: {
            user: config.get('mail.user'),
            pass: config.get('mail.password'),
          },
        },
        defaults: {
          from: `"${config.get('mail.fromPrefix')}" <${config.get('mail.from')}>`,
        },
        template: {
          dir: join(__dirname, '/core/mail/templates'),
          adapter: new HandlebarsAdapter({ t: i18n.hbsHelper }),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService, I18nService],
    }),
    FileStorageModule,
    SettingsModule,
    AuthModule,
    CaslModule,
    UsersModule,
  ],
  controllers: [
    SettingsController,
    AuthController,
    UsersController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
