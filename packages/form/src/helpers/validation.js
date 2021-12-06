import { flattenPerSchema } from '@blitzar/utils'
import { isArray, isBoolean, isFullString, isFunction } from 'is-what'
import { defaultLang } from '../meta/lang'

export function createRequiredErrorFn(requiredFieldErrorMsg) {
  return (val) => (val === 0 || !!val) ? null : requiredFieldErrorMsg
}

/**
 * @typedef ValidationResultForm
 * @type {{ [fieldId: string]: null | string }}
 */

/**
 * Validates a field data based on its blueprint
 *
 * @export
 * @param {*} payload
 * @param {Blueprint} blueprint
 * @param {Context} context
 * @returns {null | string}
 */
export function validateFieldPerSchema(payload, blueprint, context = {}) {
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

  if (isRequired) {
    const lang = context.lang || defaultLang()
    const requiredErrorFn = createRequiredErrorFn(lang.requiredField)
    const requiredResult = requiredErrorFn(payload)
    if (isFullString(requiredResult)) return requiredResult
  }

  if (!blueprint.error) return null
  
  let errorResult = !isFunction(blueprint.error) ? blueprint.error : blueprint.error(payload, context)
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
 *
 * @export
 * @param {PlainObject} formData the form data in an object that looks like: `{[fieldId: string]: any}`
 * @param {Schema} schema
 * @param {StringObject} [lang] the lang object with at least the key `requiredField` used as error message for required fields
 * @returns {ValidationResultForm}
 */
export function validateFormPerSchema(formData, schema, lang) {
  const schemaObject = !isArray(schema)
    ? schema
    : schema.reduce((carry, blueprint) => {
        carry[blueprint.id] = blueprint
        return carry
      }, {})
  const formDataFlatEmpty = Object.keys(schemaObject)
    .reduce((carry, key) => ({ ...carry, [key]: null }), {}) // prettier-ignore
  const formDataFlatCurrent = flattenPerSchema(formData, schema)
  const formDataFlat = { ...formDataFlatEmpty, ...formDataFlatCurrent }
  
  const resultPerField = Object.entries(formDataFlat).reduce((carry, [fieldId, fieldValue]) => {
    if (fieldId === 'undefined') return carry
    
    const blueprint = schemaObject[fieldId]
    const context = { formData, formDataFlat, lang: lang || defaultLang() }
    
    carry[fieldId] = !blueprint ? null : validateFieldPerSchema(fieldValue, blueprint, context)
    return carry
  }, {})
  
  return resultPerField
}
