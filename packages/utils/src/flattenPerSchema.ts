import { SchemaField } from '@blitzar/types'
import { flattenObjectProps } from 'flatten-anything'
import { isFullString } from 'is-what'

/**
 * Flattens an object to be in line with a schema.
 */
export function flattenPerSchema(formData: Record<string, any>, schema: SchemaField[]) {
  const schemaNestedIds = schema
    .map((blueprint: Record<string, any>) => blueprint.id)
    .filter((id: string | symbol) => isFullString(id) && id.includes('.'))
  return flattenObjectProps(formData, schemaNestedIds)
}
