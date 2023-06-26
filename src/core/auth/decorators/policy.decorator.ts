import { SetMetadata } from '@nestjs/common'
import { Ability } from '@casl/ability'

interface IPolicyHandler {
  handle(ability: Ability): boolean
}

type PolicyHandlerCallback = (ability: Ability) => boolean

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

export const CHECK_POLICIES_KEY = 'check_policy'
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers)
