export type PlainObject = { [key: string]: any }
export type StringObject = { [key: string]: string }
export type Schema = Blueprint[] | { [key: string]: Blueprint }

export interface Blueprint {
  rules?: ((val: any) => boolean | string)[]
  required?: boolean
  [key: string]: any
}
