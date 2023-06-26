import { HttpStatus } from '@nestjs/common'

import { DomainError } from '@core/common/errors/domain-error'

export namespace UsersErrors {
  export class EmailExistsError extends DomainError {
    public static create(email: string): EmailExistsError {
      return new EmailExistsError(`Email "${email}" already exists`, null, HttpStatus.CONFLICT)
    }
  }

  export class EmailForgotPasswordSentError extends DomainError {
    public static create(): EmailExistsError {
      return new EmailForgotPasswordSentError(
        'Forgot password email sent recently',
        null,
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }
  }
}
