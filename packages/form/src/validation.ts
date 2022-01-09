import { flattenPerSchema } from '@blitzar/utils'
import { isFullString, isFunction, isArray } from 'is-what'
import type { BlitzFieldProps, FormContext, Lang, Schema } from '@blitzar/types'
import { defaultLang } from './lang'

/**
 * returns a prop as is, or when it's defined as dynamicProp it will evaluate it.
 */
function evalDynamicProp(
  propName: string,
  payload: any,
  blueprint: BlitzFieldProps,
  context: FormContext
): any {
  const propValue = blueprint[propName]
  if (isFunction(propValue)) {
    return propValue(payload, context)
  }
  return propValue
}

export function createRequiredErrorFn(
  requiredFieldErrorMsg: string
): (payload: any) => null | string {
  return (val) => (val === 0 || !!val ? null : requiredFieldErrorMsg)
}

/**
 * @typedef ValidationResultForm
 * @type {{ [fieldId: string]: null | string }}
 */

/**
 * Validates a field data based on its blueprint
 */
export function validateFieldPerSchema(
  payload: any,
  blueprint: BlitzFieldProps,
  context: FormContext
): null | string {
  const required = evalDynamicProp('required', payload, blueprint, context)
  if (required === true) {
    const lang = context.lang || defaultLang()
    const requiredErrorFn = createRequiredErrorFn(lang.requiredField)
    const requiredResult = requiredErrorFn(payload)
    if (isFullString(requiredResult)) return requiredResult
  }

  const error = evalDynamicProp('error', payload, blueprint, context)
  return isFullString(error) ? error : null
}

/**
 * Validates a form data based on its schema
 */
export function validateFormPerSchema(
  formData: Record<string, any>,
  schema: Schema,
  lang: Lang
): {
  [fieldId in string]: ReturnType<typeof validateFieldPerSchema>
} {
  const schemaObject = schema.reduce((carry, blueprint) => {
    carry[blueprint.id] = blueprint
    return carry
  }, {})
  const formDataFlatEmpty = Object.keys(schemaObject)
    .reduce((carry, key) => ({ ...carry, [key]: null }), {}) // prettier-ignore
  const formDataFlatCurrent = flattenPerSchema(formData, schema)
  const formDataFlat = { ...formDataFlatEmpty, ...formDataFlatCurrent }

  const resultPerField = Object.entries(formDataFlat).reduce<{
    [fieldId in string]: ReturnType<typeof validateFieldPerSchema>
  }>((carry, [fieldId, fieldValue]) => {
    if (fieldId === 'undefined') return carry

    const blueprint = schemaObject[fieldId]
    const context: FormContext = {
      mode: 'edit',
      formMode: 'edit',
      formData,
      formDataFlat,
      updateField() {},
      lang: lang || defaultLang(),
    }

    carry[fieldId] = !blueprint ? null : validateFieldPerSchema(fieldValue, blueprint, context)
    return carry
  }, {})

  return resultPerField
}
