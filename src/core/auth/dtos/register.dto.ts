import { Type } from 'class-transformer'
import { Allow, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, {
    message: 'fullname must be maximum $constraint1 characters',
  })
  fullname: string

  @Type(() => String)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(60, {
    message: 'email must be maximum $constraint1 characters',
  })
  email: string

  @Type(() => String)
  @Allow()
  @MinLength(6, {
    message: 'password must be minimum $constraint1 characters',
  })
  password: string
}
