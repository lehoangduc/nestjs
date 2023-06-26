import { HttpStatus } from '@nestjs/common'

import { DomainError } from './domain-error'

export namespace AppErrors {
  export class EntityNotFoundError extends DomainError {
    public static create(entity: string): EntityNotFoundError {
      return new EntityNotFoundError(`${entity} was not found`, null, HttpStatus.NOT_FOUND)
    }
  }

  export class UnexpectedError extends DomainError {
    public static create(error: Error, meta?: any): UnexpectedError {
      const err = new UnexpectedError(
        'An unexpected error occurred',
        meta,
        HttpStatus.INTERNAL_SERVER_ERROR
      )

      err.stack = error.stack

      return err
    }
  }

  export class UnauthorizedError extends DomainError {
    public static create(): UnauthorizedError {
      return new UnauthorizedError('Unauthorized', null, HttpStatus.UNAUTHORIZED)
    }
  }

  export class ForbiddenError extends DomainError {
    public static create(): UnexpectedError {
      return new ForbiddenError('Action forbidden', null, HttpStatus.FORBIDDEN)
    }
  }

  export class ValidationFailedError extends DomainError {
    public static create(error: Error, meta?: any): UnexpectedError {
      const err = new ValidationFailedError(
        'Validation failed',
        meta ? { ...meta, message: error.message } : { message: error.message },
        HttpStatus.BAD_REQUEST
      )

      err.stack = error.stack

      return err
    }
  }

  export class UnprocessableError extends DomainError {
    public static create(): UnprocessableError {
      return new UnprocessableError('Action forbidden', null, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }
}
