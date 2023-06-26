import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import * as _ from 'lodash'

dayjs.extend(utc)
dayjs.extend(timezone)

export const formatDateTime = (value: Date, format = 'YYYY-MM-DD', tz = 'Asia/Ho_Chi_Minh') => {
  const date = dayjs(value).tz(tz)
  return format === 'ISO' ? date.toISOString() : date.format(format)
}

export const toDate = (value: string, tz = 'UTC', format = 'YYYY-MM-DDTHH:mm:ss.000[Z]') => {
  return dayjs.tz(_.split(value, '.', 1).join(''), format, tz).toDate()
}

export const diffDateTime = (from: Date, to: Date, unit?: any) => {
  if (!from || !to) return 0

  return Math.round(dayjs(from).diff(to, unit || 'seconds', true))
}

export const getStartOfDateTime = (unit: dayjs.OpUnitType, date?: Date, tz?: string) => {
  return dayjs(date || new Date())
    .tz(tz || 'UTC')
    .startOf(unit)
    .toDate()
}

export const getEndOfDateTime = (unit: dayjs.OpUnitType, date?: Date, tz?: string) => {
  return dayjs(date || new Date())
    .tz(tz || 'UTC')
    .endOf(unit)
    .toDate()
}

export const isDateValid = (value: string) => {
  if (!value) return false

  return dayjs(value).isValid()
}
