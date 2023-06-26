import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator'

export class UpdateUserDto {
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'fullname must be maximum $constraint1 characters',
  })
  fullname: string

  @Type(() => String)
  @IsOptional()
  @IsEmail()
  @MaxLength(60, {
    message: 'email must be maximum $constraint1 characters',
  })
  email: string

  @Type(() => String)
  @IsOptional()
  @ValidateIf((e) => e === '')
  @MinLength(6, {
    message: 'password must be minimum $constraint1 characters',
  })
  password: string

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  is_active: boolean

  @IsOptional()
  options: any
}
