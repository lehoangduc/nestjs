import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { MongoAbility } from '@casl/ability'

import { AppErrors } from '@core/common/errors/app-errors'
import { CaslAbilityFactory } from '@core/casl/casl-ability.factory'
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators'
import { IS_PUBLIC_KEY } from '../decorators'
import { JwtAuthGuard } from './jwt-auth.guard'

@Injectable()
export class PoliciesGuard extends JwtAuthGuard implements CanActivate {
  constructor(protected reflector: Reflector, protected caslAbilityFactory: CaslAbilityFactory) {
    super(reflector)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    let canActivate: any = true

    try {
      canActivate = await super.canActivate(context)
    } catch (err) {
      canActivate = false
    }

    if (isPublic) return true
    if (!canActivate) throw AppErrors.UnauthorizedError.create()

    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || []

    if (!policyHandlers.length) return true

    const { user } = context.switchToHttp().getRequest()
    const ability = this.caslAbilityFactory.createForUser(user)

    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability.pure))
  }

  private execPolicyHandler(handler: PolicyHandler, ability: MongoAbility) {
    if (typeof handler === 'function') {
      return handler(ability)
    }
    return handler.handle(ability)
  }
}
