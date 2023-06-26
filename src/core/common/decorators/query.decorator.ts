import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { URL } from 'url'
import * as _ from 'lodash'
import * as qs from 'qs'

import { parsePaginationParam, parseSortRequestParam } from '../utils/request'

export const ParsedQuery = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const parts = new URL(
    request.url,
    (request['x-forwarded-protocol'] || request['protocol']) + `://${request.hostname}`
  )

  let params: any = {}

  if (parts.search) {
    params = qs.parse(parts.search.substring(1), { depth: 2 })

    params.page = parsePaginationParam(params.page)
    params.sort = parseSortRequestParam(params.sort)

    if (!_.isPlainObject(params.filter)) params.filter = {}
    if (!_.isPlainObject(params.sort)) params.sort = {}
  }

  return { ...params }
})
