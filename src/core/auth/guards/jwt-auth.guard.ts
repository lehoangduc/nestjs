import { Reflector } from '@nestjs/core'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(protected readonly reflector: Reflector) {
    super(reflector)
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }
}
