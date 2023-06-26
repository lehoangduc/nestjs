import { Type } from 'class-transformer'
import { Allow, IsNotEmpty, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @Type(() => String)
  @Allow()
  @MinLength(6, {
    message: 'password must be minimum $constraint1 characters',
  })
  password: string

  @Type(() => String)
  @IsNotEmpty()
  token: string
}
