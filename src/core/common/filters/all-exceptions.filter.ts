import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { ForbiddenError } from '@casl/ability'
import { PinoLogger } from 'nestjs-pino'
import * as _ from 'lodash'

import { AppErrors } from '../errors/app-errors'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const error = exception instanceof HttpException ? exception.getResponse() : exception
    const status = this.getStatus(exception, error)

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception)
      return response.status(status).send({
        errors: [{ message: 'An unexpected error has occurred' }],
      })
    }

    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      return response.status(status).send({
        errors: [{ message: 'Too many requests' }],
      })
    }

    response.status(status).send({
      errors: this.getErrorMessages(error),
    })
  }

  getStatus(exception: any, error: any) {
    if (exception instanceof HttpException) return exception.getStatus()

    if (error instanceof ForbiddenError || error instanceof AppErrors.ForbiddenError) {
      return HttpStatus.FORBIDDEN
    }

    if (error.http_status) return error.http_status

    if (error.code === 'LIMIT_FILE_SIZE') return HttpStatus.BAD_REQUEST

    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  getErrorMessages(error: any) {
    if (_.isString(error)) return [error]

    if (error instanceof ForbiddenError || error instanceof AppErrors.ForbiddenError) {
      return [{ message: 'Cannot perform this action' }]
    }

    if (error instanceof AppErrors.ValidationFailedError) {
      return [{ message: error.meta?.message }]
    }

    if (Array.isArray(error.message)) {
      return error.message.map((m: string) => ({
        message: m,
      }))
    }

    return [{ message: error.message }]
  }
}
