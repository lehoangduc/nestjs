import { subject } from '@casl/ability'
import * as bcrypt from 'bcrypt'
import * as _ from 'lodash'

import { UserAbility, UserAction } from '@core/casl'
import { toBoolean } from '@core/common/utils/misc'
import { User } from '../entities/user.entity'

export class UsersHelper {
  static removeInvalidFields(user: User, data: any, ability?: UserAbility) {
    if (!ability) return data

    const invalidFields = Object.keys(data).filter((key) =>
      ability.pure.cannot(UserAction.Update, subject('User', user), key)
    )

    return _.omit(data, invalidFields)
  }

  static isValidPassword(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash)
  }

  static async applyProfileData(user: User, data: any, ability?: UserAbility) {
    if (user._id) data = UsersHelper.removeInvalidFields(user, data, ability)

    if (!user._id) {
      user.role = data.role
      user.created_at = new Date()
      user.is_active = toBoolean(data.is_active)
      data = UsersHelper.removeInvalidFields(user, data, ability)
    } else {
      if (data.is_active !== undefined) user.is_active = toBoolean(data.is_active)
    }

    if (data.fullname) user.fullname = data.fullname.trim()
    if (data.email) {
      const email = data.email.trim().toLowerCase()
      user.email = email
    }
    if (data.password) user.password = await bcrypt.hash(data.password.trim(), 10)

    user.updated_at = new Date()
  }
}
