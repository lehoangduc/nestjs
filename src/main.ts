import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

async function bootstrap() {
  const app: any = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
      cors: true,
    }
  )
  const config = app.get(ConfigService)
  const logger = app.get(Logger)
  const listenInterface = config.get('api.interface')
  const listenPort = config.get('api.port')

  app.useLogger(logger)

  await app.listen(listenPort, listenInterface)

  logger.log(`Server is listening at ${listenInterface}:${listenPort}`)
}

bootstrap()
