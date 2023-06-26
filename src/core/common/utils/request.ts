export const parseSortRequestParam = (param: string): { field: string; order: 'ASC' | 'DESC' } => {
  if (!param) return null

  const parts = param.split('-')

  if (!parts.length) return null
  if (parts.length > 1) return { field: parts[1], order: 'DESC' }

  return { field: parts[0], order: 'ASC' }
}

export const parsePaginationParam = (param: {
  number: any
  size: any
}): { number: number; size: number } => {
  const defaults = {
    number: 1,
    size: 20,
  }

  if (!param) return defaults

  let number = parseInt(param.number, 10)
  let size = parseInt(param.size, 10)

  number = isNaN(number) || number <= 0 ? defaults.number : number
  size = isNaN(size) || size <= 0 ? defaults.size : size

  return {
    number,
    size,
  }
}
