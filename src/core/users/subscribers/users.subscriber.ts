import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm'

import { UserCreatedEvent, UserUpdatedEvent } from '../events'
import { User } from '../entities'

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource, private readonly eventEmitter: EventEmitter2) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return User
  }

  async afterInsert(event: InsertEvent<User>) {
    if (!event.entity) return

    await event.queryRunner.commitTransaction()
    await event.queryRunner.startTransaction()

    return this.eventEmitter.emitAsync(
      UserCreatedEvent.code,
      new UserCreatedEvent(event.entity as User)
    )
  }

  async afterUpdate(event: UpdateEvent<User>) {
    if (!event.databaseEntity || !event.entity) return

    await event.queryRunner.commitTransaction()
    await event.queryRunner.startTransaction()

    return this.eventEmitter.emitAsync(
      UserUpdatedEvent.code,
      new UserUpdatedEvent(event.databaseEntity, event.entity as User)
    )
  }
}
