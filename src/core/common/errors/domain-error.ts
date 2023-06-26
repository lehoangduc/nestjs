export class DomainError extends Error {
  message: string
  meta?: any
  http_status?: number

  constructor(message?: string, meta?: any, httpStatus?: number) {
    super(message)
    this.meta = meta
    this.http_status = httpStatus
  }
}
