import { flattenObjectProps } from 'flatten-anything'
import { isArray, isFullString } from 'is-what'

/**
 * Flattens an object to be in line with a schema.
 *
 * @export
 * @param {Record<string, any>} target the target object
 * @param {Record<string, any> | (Record<string, any>[])} schema
 * @returns {Record<string, any>}
 */
export function flattenPerSchema(
  target: Record<string, any>,
  schema: Record<string, any> | Record<string, any>[]
) {
  const schemaArray = isArray(schema) ? schema : Object.values(schema)
  const schemaNestedIds = schemaArray
    .map((blueprint: Record<string, any>) => blueprint.id)
    .filter((id: string | Symbol) => isFullString(id) && id.includes('.'))
  return flattenObjectProps(target, schemaNestedIds)
}
