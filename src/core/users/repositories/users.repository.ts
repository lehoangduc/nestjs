import { ObjectId } from 'mongodb'

import { CustomRepository, TypeOrmMongoRepository } from '@core/database'
import { parsePaginationParam, toBoolean } from '@core/common/utils'
import { customPaginate, Pagination } from '@core/common/utils/pagination'
import { User } from '../entities'

@CustomRepository(User)
export class UsersRepository extends TypeOrmMongoRepository<User> {
  async findAll(params: any): Promise<Pagination> {
    const filters: any = []
    const page = parsePaginationParam(params?.page)

    const options: any = {
      skip: (page.number - 1) * page.size,
      take: page.size,
      order: { _id: 'DESC' },
    }

    if (params?.filter?.keyword?.trim()) {
      const keyword = params.filter.keyword.trim()
      filters.push({
        email: { $regex: `^${keyword}` },
      })
    }

    if (params?.filter?.email?.trim()) {
      filters.push({
        email: params.filter.email.trim(),
      })
    }

    if (params?.filter?.role?.trim()) {
      filters.push({
        role: params.filter.role.trim(),
      })
    }

    const roles = params?.filter?.roles?.trim()?.split(',') || []
    if (roles.length) {
      filters.push({
        role: { $in: roles },
      })
    }

    const excludedRoles = params?.filter?.excluded_roles?.trim()?.split(',') || []
    if (excludedRoles.length) {
      filters.push({
        role: { $nin: excludedRoles },
      })
    }

    const userIds = params?.filter?.user_ids?.toString()?.trim()?.split(',') || []
    if (userIds.length) {
      filters.push({
        _id: { $in: userIds.map((id: string) => new ObjectId(id)) },
      })
    }

    const excludedIds = params?.filter?.excluded_ids?.toString()?.trim()?.split(',') || []
    if (excludedIds.length) {
      filters.push({
        _id: { $nin: excludedIds.map((id: string) => new ObjectId(id)) },
      })
    }

    if (params?.filter?.is_active) {
      filters.push({
        is_active: toBoolean(params.filter.is_active),
      })
    }

    if (params?.filter?.created_at_from?.trim()) {
      filters.push({
        created_at: {
          $gte: new Date(params.filter.created_at_from),
        },
      })
    }

    if (params?.filter?.created_at_to?.trim()) {
      filters.push({
        created_at: {
          $lte: new Date(params.filter.created_at_to),
        },
      })
    }

    if (filters.length) options.where = { $and: filters }

    const result = await this.findAndCount(options)

    return customPaginate(result[0], result[1], page.number, page.size)
  }
}
