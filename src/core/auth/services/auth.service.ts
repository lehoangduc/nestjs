import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { I18nService } from 'nestjs-i18n'
import { plainToInstance } from 'class-transformer'
import * as _ from 'lodash'

import { AppErrors } from '@core/common/errors/app-errors'
import { MailService } from '@core/mail/services'
import { User, UsersHelper, UsersRole, UsersService } from '@core/users'
import { AuthErrors } from '../auth.errors'
import { RegisterDto, ResetPasswordDto } from '../dtos'

@Injectable()
export class AuthService {
  static RESET_PASSWORD_TOKEN_EXPIRED_MINUTES = 30

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService
  ) {}

  async getUserByToken(token: string, full?: boolean): Promise<User> {
    if (!token) return null

    try {
      const payload = this.jwtService.verify(token)

      if (!full) return plainToInstance(User, payload)

      return this.validateUser(payload.email)
    } catch (err) {}

    return null
  }

  async validateUser(email: string, pass?: string): Promise<User> {
    const user = await this.usersService.findOne({ email })
    if (!user || !user.isActive()) return null

    if (pass) {
      const isValid = await UsersHelper.isValidPassword(pass, user.password)
      if (!isValid) return null
    }

    return user
  }

  async register(data: RegisterDto) {
    if (!this.configService.get('auth.signupEnabled')) {
      throw AppErrors.ForbiddenError.create()
    }

    const user = await this.usersService.create({
      ...data,
      role: UsersRole.Customer,
      is_active: true,
    })

    const result = {
      _id: user._id.toString(),
      email: user.email,
    }

    return {
      ...result,
      role: user.role,
      fullname: user.fullname,
      access_token: this.jwtService.sign({ ...result }),
    }
  }

  async login(user: User) {
    const data = {
      _id: user._id.toString(),
      email: user.email,
    }

    return {
      ...data,
      role: user.role,
      fullname: user.fullname,
      access_token: this.jwtService.sign({ ...data }),
    }
  }

  async sendEmailForgotPassword(email: string): Promise<void> {
    if (!email) throw AuthErrors.InvalidEmailError.create()

    const user = await this.usersService.findOne({ email: email })
    if (!user) throw AuthErrors.InvalidEmailError.create()

    const forgotPassword = await this.usersService.createForgotPasswordToken(email)

    await this.mailService.sendMail({
      to: email,
      subject: this.i18n.t('mail.FORGOT_PASSWORD_SUBJECT'),
      template: './forgot-password',
      context: {
        name: user.fullname,
        url: this.configService.get('auth.resetPasswordUrl') + `/${forgotPassword.token}`,
      },
    })

    await this.usersService.setForgotPasswordSent(forgotPassword)
  }

  async resetPassword(data: ResetPasswordDto) {
    const forgotPassword = await this.usersService.findForgotPassword({ token: data.token })
    const isValid =
      forgotPassword &&
      (new Date().getTime() - forgotPassword.sent_at.getTime()) / 60000 <
        AuthService.RESET_PASSWORD_TOKEN_EXPIRED_MINUTES

    if (!isValid) throw AuthErrors.InvalidResetPasswordTokenError.create()

    const user = await this.usersService.findOne({ email: forgotPassword.email })
    if (!user?.isActive()) throw AuthErrors.InvalidResetPasswordTokenError.create()

    return this.usersService.setNewPassword(user, data.password)
  }
}
