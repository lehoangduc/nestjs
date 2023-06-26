import { Column, Entity, Index, ObjectIdColumn } from 'typeorm'
import { ObjectId } from 'mongodb'
import { Type } from 'class-transformer'

import { ExposeId } from '@core/common/utils/database'

@Entity('users_forgot_passwords')
@Index('IDX_email', ['email'], { unique: true })
export class UserForgotPassword {
  @ObjectIdColumn()
  @ExposeId({ toClassOnly: true })
  @Type(() => String)
  _id: ObjectId

  @Column()
  email: string

  @Index()
  @Column()
  token: string

  @Column()
  @Type(() => Date)
  sent_at: Date

  @Column()
  @Type(() => Date)
  updated_at: Date

  constructor(data?: Partial<UserForgotPassword>) {
    Object.assign(this, data, {
      created_at: new Date(),
      updated_at: new Date(),
    })
  }
}
