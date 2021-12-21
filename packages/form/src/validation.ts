import { flattenPerSchema } from '@blitzar/utils'
import { isBoolean, isFullString, isFunction } from 'is-what'
import type { BlitzFieldProps, FormContext, Lang, Schema } from '@blitzar/types'
import { defaultLang } from './lang'

export function createRequiredErrorFn(
  requiredFieldErrorMsg: string
): (payload: any) => null | string {
  return (val) => (isBoolean(val) || val === 0 || !!val ? null : requiredFieldErrorMsg)
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
  // check whether the field is shown
  let isVisible = true
  if (isFunction(blueprint.showCondition)) {
    isVisible = blueprint.showCondition(payload, context)
  }
  if (!isVisible) return null

  // check whether the field is required
  let isRequired = false
  if (isFunction(blueprint.required)) {
    isRequired = blueprint.required(payload, context)
  } else if (isBoolean(blueprint.required)) {
    isRequired = blueprint.required
  }

  const lang = context.lang || defaultLang()
  if (isRequired) {
    const requiredErrorFn = createRequiredErrorFn(lang.requiredField)
    const requiredResult = requiredErrorFn(payload)
    if (isFullString(requiredResult)) return requiredResult
  }

  if (!blueprint.error) return null

  const errorResult = !isFunction(blueprint.error)
    ? blueprint.error
    : blueprint.error(payload, context)
  // report provided error message if error result is true
  if (isBoolean(errorResult)) {
    if (errorResult) {
      return blueprint.errorMessage ? blueprint.errorMessage : lang.fieldValidationError
    }
    return null
  }

  return errorResult
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
