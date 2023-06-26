import * as _ from 'lodash'

export const toBoolean = (value: string | boolean) => {
  return value === 'true' || value === true
}

export const isNumeric = (value: any) => {
  if (value === '') return false

  const num = _.toNumber(value)
  return _.isNumber(num) && _.isFinite(num)
}

export const isNumber = (value: any) => {
  return _.isNumber(value) && _.isFinite(value)
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))
