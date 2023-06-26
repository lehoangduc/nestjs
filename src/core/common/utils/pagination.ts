import { Expose } from 'class-transformer'

class CustomPaginationMeta {
  constructor(
    public readonly count: number,
    public readonly total: number,
    public readonly current_page: number,
    public readonly per_page: number,
    public readonly pages: number
  ) {}
}

class Pagination {
  @Expose({ name: 'data', toPlainOnly: true })
  items: any[]

  meta: object
}

const customPaginate = (entities: any[], total: number, page: number, perPage: number) => {
  return {
    items: entities,
    meta: new CustomPaginationMeta(
      entities.length,
      total,
      page,
      perPage,
      Math.ceil(total / perPage)
    ),
  }
}

export { customPaginate, Pagination }
