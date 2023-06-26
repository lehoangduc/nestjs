import {
  DeepPartial,
  getMetadataArgsStorage,
  MongoRepository,
  ObjectLiteral,
  SaveOptions,
} from 'typeorm'
import { plainToInstance } from 'class-transformer'
import * as _ from 'lodash'

export class TypeOrmMongoRepository<Entity extends ObjectLiteral> extends MongoRepository<Entity> {
  saveEntity<T extends DeepPartial<Entity>>(entity: T, options?: SaveOptions): Promise<any> {
    const columns = getMetadataArgsStorage().columns.filter(
      ({ target }) => target === entity.constructor
    )
    const names = columns.map((c) => c.propertyName)

    return this.save(
      plainToInstance(entity.constructor as any, _.pick(entity, names)),
      options
    ) as Promise<T & Entity>
  }
}
