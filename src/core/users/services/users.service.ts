import { Injectable } from '@nestjs/common'
import { ForbiddenError, subject } from '@casl/ability'
import { ObjectId } from 'mongodb'
import * as randomstring from 'randomstring'

import { AppErrors } from '@core/common/errors/app-errors'
import { Pagination } from '@core/common/utils/pagination'
import { UserAbility, UserAction } from '@core/casl'
import { UsersErrors } from '../users.errors'
import { UsersHelper } from '../helpers'
import { CreateUserDto } from '../dtos'
import { User, UserForgotPassword } from '../entities'
import { UsersForgotPasswordRepository, UsersRepository } from '../repositories'

@Injectable()
export class UsersService {
  static EMAIL_FORGOT_PASSWORD_TIMEOUT_MINUTES = 5

  constructor(
    private readonly repository: UsersRepository,
    private readonly forgotPasswordRepository: UsersForgotPasswordRepository
  ) {}

  async findOne(params: any, ability?: UserAbility) {
    const user = await this.repository.findOneBy(params)

    if (ability) {
      ForbiddenError.from(ability.pure).throwUnlessCan(UserAction.Read, subject('User', user))
    }

    return user
  }

  async findById(id: string, ability?: UserAbility): Promise<User> {
    if (!ObjectId.isValid(id)) throw AppErrors.EntityNotFoundError.create('User')

    const user = await this.repository.findOneBy({ _id: new ObjectId(id) })

    if (ability) {
      ForbiddenError.from(ability.pure).throwUnlessCan(UserAction.Read, subject('User', user))
    }

    return user
  }

  findAll(params: any, ability?: UserAbility): Promise<Pagination> {
    if (!params.filter) params.filter = {}

    if (ability) {
      if (!ability.pure.can(UserAction.Manage, 'all')) {
        params.filter.user_ids = ability.user._id.toString()
      }
    }

    return this.repository.findAll(params)
  }

  async create(data: CreateUserDto, ability?: UserAbility): Promise<User> {
    const user = new User()

    await UsersHelper.applyProfileData(user, data, ability)

    if (ability) {
      ForbiddenError.from(ability.pure).throwUnlessCan(UserAction.Create, subject('User', user))
    }

    try {
      return await this.repository.saveEntity(user)
    } catch (err) {
      if (err?.code === 11000) {
        if (err.message.indexOf('IDX_email') !== -1) {
          throw UsersErrors.EmailExistsError.create(data.email)
        }
      }

      throw AppErrors.UnexpectedError.create(err)
    }
  }

  async delete(id: string, ability?: UserAbility): Promise<User> {
    const user = await this.findById(id, ability)
    if (!user) throw AppErrors.EntityNotFoundError.create('User')

    if (ability) {
      ForbiddenError.from(ability.pure).throwUnlessCan(UserAction.Delete, subject('User', user))
    }

    return this.repository.remove(user)
  }

  async setNewPassword(user: User, password: string): Promise<void> {
    await UsersHelper.applyProfileData(user, { password })
    await this.repository.saveEntity(user)

    const forgotPassword = await this.forgotPasswordRepository.findOneBy({ email: user.email })
    if (forgotPassword) await this.forgotPasswordRepository.remove(forgotPassword)
  }

  async createForgotPasswordToken(email: string): Promise<UserForgotPassword> {
    let forgotPassword = await this.forgotPasswordRepository.findOneBy({ email })

    if (
      forgotPassword?.sent_at &&
      (new Date().getTime() - forgotPassword.sent_at.getTime()) / 60000 <
        UsersService.EMAIL_FORGOT_PASSWORD_TIMEOUT_MINUTES
    ) {
      throw UsersErrors.EmailForgotPasswordSentError.create()
    } else {
      if (!forgotPassword) {
        forgotPassword = new UserForgotPassword()
        forgotPassword.email = email
      }

      forgotPassword.token = randomstring.generate({
        length: 32,
        charset: 'alphanumeric',
      })
      forgotPassword.sent_at = null
    }

    return this.forgotPasswordRepository.saveEntity(forgotPassword)
  }

  findForgotPassword(params: any): Promise<UserForgotPassword> {
    return this.forgotPasswordRepository.findOneBy(params)
  }

  setForgotPasswordSent(forgotPassword: UserForgotPassword) {
    forgotPassword.sent_at = new Date()
    forgotPassword.updated_at = new Date()

    return this.forgotPasswordRepository.saveEntity(forgotPassword)
  }
}
