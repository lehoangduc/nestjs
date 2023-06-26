import { Column, Entity, Index, ObjectIdColumn } from 'typeorm'
import { ObjectId } from 'mongodb'
import { Exclude, Type } from 'class-transformer'

import { ExposeId } from '@core/common/utils/database'
import { UsersRole } from '../users.enums'

@Entity('users')
@Index('IDX_email', ['email'], { unique: true })
export class User {
  @ObjectIdColumn()
  @ExposeId({ toClassOnly: true })
  @Type(() => String)
  _id: ObjectId

  @Index()
  @Column()
  role: UsersRole

  @Column()
  fullname: string

  @Column()
  email: string

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string

  @Column({
    default: true,
    transformer: {
      to: (value: number) => (value === undefined || value ? true : false),
      from: (value: number) => (value ? true : false),
    },
  })
  @Type(() => Boolean)
  is_active: boolean

  @Column({
    default: false,
    transformer: {
      to: (value: number) => (value === undefined || value ? true : false),
      from: (value: number) => (value ? true : false),
    },
  })
  @Type(() => Boolean)
  is_test: boolean

  @Column()
  @Type(() => Date)
  created_at: Date

  @Column()
  @Type(() => Date)
  updated_at: Date

  constructor(data?: Partial<User>) {
    Object.assign(this, data, {
      created_at: new Date(),
      updated_at: new Date(),
    })
  }

  isActive() {
    return this.is_active
  }
}
