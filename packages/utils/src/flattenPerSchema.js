import { flattenObjectProps } from 'flatten-anything'
import { isArray } from 'is-what'

/**
 * Flattens an object to be in line with a schema.
 *
 * @export
 * @param {Object} target the target object
 * @param {(Object|Object[])} schema
 * @returns {Object}
 */
export function flattenPerSchema(target, schema) {
  const schemaArray = isArray(schema) ? schema : Object.values(schema)
  const schemaNestedIds = schemaArray
    .map((blueprint) => blueprint.id)
    .filter((id) => id && id.includes('.'))
  return flattenObjectProps(target, schemaNestedIds)
}
