import { isArray } from 'is-what'
import { PlainObject, Blueprint, Schema, StringObject } from '../types'
import { flattenPerSchema } from '@blitzar/utils'

export type ValidationResultField = boolean | (string | boolean)[]
export type ValidationResultForm = { [fieldId: string]: ValidationResultField }

/**
 * Validates a field data based on its blueprint
 *
 * @export
 * @param {Blueprint} { rules = [], required }
 * @param {*} payload
 * @param {StringObject} lang
 * @returns {ValidationResultField}
 */
export function validateFieldPerSchema(
  { rules = [], required }: Blueprint,
  payload: any,
  lang: StringObject
): ValidationResultField {
  const requiredRule = (val: any) => val === 0 || !!val || lang.requiredField
  const testRules = !required ? rules : [requiredRule, ...rules]
  const results = testRules.reduce((carry, rule) => {
    carry.push(rule(payload))
    return carry
  }, [])
  const hasAnError = Object.values(results).some((result) => result !== true)
  return !hasAnError || results
}

/**
 * Validates a form data based on its schema
 *
 * @export
 * @param {PlainObject} formData the flattened form data in an object that looks like: `{[fieldId: string]: any}`
 * @param {Schema} schema
 * @param {StringObject} lang the lang object with at least the key `requiredField` used as error message for required fields
 * @returns {ValidationResultForm}
 */
export function validateFormPerSchema(
  formData: PlainObject,
  schema: Schema,
  lang: StringObject
): ValidationResultForm {
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
    const blueprint = schemaObject[fieldId]
    carry[fieldId] = validateFieldPerSchema(blueprint, fieldValue, lang)
    return carry
  }, {})
  return resultPerField
}
