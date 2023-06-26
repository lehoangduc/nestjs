import { SetMetadata } from '@nestjs/common'

export const Action = (resource: string, action: string) =>
  SetMetadata('action', { resource, action })
