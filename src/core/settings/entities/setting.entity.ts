import { Column, Entity, Index, ObjectIdColumn } from 'typeorm'
import { ObjectId } from 'mongodb'
import { Type } from 'class-transformer'

import { ExposeId } from '@core/common/utils/database'
import { SettingsType } from '../settings.enums'

@Entity('settings')
export class Setting {
  @ObjectIdColumn()
  @ExposeId({ toClassOnly: true })
  @Type(() => String)
  _id: ObjectId

  @Index()
  @Column()
  code: string

  @Column()
  type: SettingsType

  @Column()
  value: any

  @Column({
    default: false,
    transformer: {
      to: (value: number) => (value ? true : false),
      from: (value: number) => (value ? true : false),
    },
  })
  @Type(() => Boolean)
  is_public: boolean

  @Column()
  @Type(() => Date)
  created_at: Date

  @Column()
  @Type(() => Date)
  updated_at: Date

  constructor(data?: Partial<Setting>) {
    Object.assign(this, data, {
      created_at: new Date(),
      updated_at: new Date(),
    })
  }

  fromValue() {
    let value: any = this.value

    if (this.type === SettingsType.Boolean) {
      value = value === 'true' || value === true || parseInt(value, 10) === 1 ? 'true' : 'false'
    } else if (this.type === SettingsType.Number) {
      value = Number(value)
    }

    return value
  }

  toValue() {
    let value: any = this.value

    if (this.type === SettingsType.Boolean) {
      value = value?.toString() === 'true' ? true : false
    } else if (this.type === SettingsType.Number) {
      value = Number(value)
    }

    return value
  }
}
