import { Transform, ExposeOptions, TransformFnParams } from 'class-transformer'

export const ExposeId = (options?: ExposeOptions) => (target: Object, propertyKey: string) => {
  Transform((params: TransformFnParams) => params.obj[propertyKey])(target, propertyKey), options
}
