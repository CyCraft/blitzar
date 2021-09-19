export type PlainObject = { [key in string]: any }
export type StringObject = { [key in string]: string }
export type Schema = Blueprint[] | { [key: string]: Blueprint }
export type Context = { formData: { [key in string]: any }, formDataFlat: { [key in string]: any }, mode: string }

export type Blueprint = {
  error?: (val: any, context: Context) => (null | string)
  required?: boolean
  [key: string]: any
}
