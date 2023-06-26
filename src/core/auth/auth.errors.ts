import { HttpStatus } from '@nestjs/common'

import { DomainError } from '@core/common/errors/domain-error'

export namespace AuthErrors {
  export class InvalidEmailError extends DomainError {
    public static create(): InvalidEmailError {
      return new InvalidEmailError('Invalid email', null, HttpStatus.BAD_REQUEST)
    }
  }

  export class InvalidEmailOrPasswordError extends DomainError {
    public static create(): InvalidEmailOrPasswordError {
      return new InvalidEmailOrPasswordError(
        'Invalid email or password',
        null,
        HttpStatus.UNAUTHORIZED
      )
    }
  }

  export class InvalidResetPasswordTokenError extends DomainError {
    public static create(): InvalidResetPasswordTokenError {
      return new InvalidResetPasswordTokenError(
        'Invalid reset password token',
        null,
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
