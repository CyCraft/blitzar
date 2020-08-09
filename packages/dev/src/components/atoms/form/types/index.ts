export type PlainObject = { [key in string]: any }
export type StringObject = { [key in string]: string }
export type Schema = Blueprint[] | { [key: string]: Blueprint }

export interface Blueprint {
  rules?: ((val: any) => boolean | string)[]
  required?: boolean
  [key: string]: any
}
