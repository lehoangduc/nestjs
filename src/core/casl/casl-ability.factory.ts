import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability'
import { Injectable } from '@nestjs/common'

import { UsersRole } from '@core/users/users.enums'
import { User } from '@core/users/entities'
import { UserAction } from './enums'

export class UserAbility {
  public readonly pure: Ability
  public readonly user: User

  constructor(user: User, pure: Ability) {
    this.user = user
    this.pure = pure
  }

  isAdmin() {
    return this.user.role === UsersRole.Admin
  }
}

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): UserAbility {
    if (!user) return null

    const builder = new AbilityBuilder<Ability>(Ability as AbilityClass<Ability>)
    const { build } = builder

    switch (user.role) {
      case UsersRole.Admin:
        this.defineAbilitiesForAdmin(builder, user)
        break

      case UsersRole.Customer:
        this.defineAbilitiesForCustomer(builder, user)
        break
    }

    this.defineCommonAbilities(builder, user)

    return new UserAbility(user, build())
  }

  defineAbilitiesForAdmin(builder: AbilityBuilder<Ability>, user: User) {
    const { can, cannot } = builder

    can(UserAction.Manage, 'all')
  }

  defineAbilitiesForCustomer(builder: AbilityBuilder<Ability>, user: User) {
    const { can } = builder

    can(UserAction.Manage, 'Project', { user_id: user._id })
  }

  defineCommonAbilities(builder: AbilityBuilder<Ability>, user: User) {
    const { can } = builder

    // can read & update some properties itself
    can(UserAction.Read, 'User', { _id: user._id })
    can(UserAction.Update, 'User', ['fullname', 'password'], {
      _id: user._id,
    })
  }
}
