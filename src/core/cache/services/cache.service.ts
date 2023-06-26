import { createClient } from 'redis'

export class CacheService {
  #client

  constructor(options: any) {
    this.#client = createClient({
      username: options.username || null,
      password: options.password || null,
      socket: {
        host: options.host || 'localhost',
        port: options.port || 6379,
      },
    })

    this.#client.on('error', (err: Error) => console.log('Redis Client Error: ', err))
  }

  connect() {
    return this.#client.connect()
  }

  getClient() {
    return this.#client
  }
}
