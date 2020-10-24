import { isArray, isUndefined, isFunction, isFullString, isBoolean, isPlainObject } from 'is-what'
import { getProp } from 'path-to-prop'

export default function schemaToQTableColumns(schema) {
  const schemaArray = !isArray(schema) ? [schema] : schema
  return schemaArray.map((blueprint) => {
    const {
      id,
      valueType,
      type,
      label,
      align,
      defaultValue,
      sortable,
      parseValue,
      sort,
      format,
      headerClasses,
      headerStyle,
    } = blueprint
    const field = (row) => {
      const value = getProp(row, id)
      // todo: can I retrieve the BlitzField context? should I?
      const blitzFieldContext = { formData: row, fieldInput: () => {} }
      // fieldInput has a chance to be triggered on `parseValue`, and thus needs to be added as fn to make sure it exists on the context but does nothing. We don't want to trigger fieldInput on sorting, therefore it must be an empty fn.
      const valueOrDefaultValue = !isUndefined(value)
        ? value
        : isFunction(defaultValue)
        ? defaultValue(row, blitzFieldContext)
        : defaultValue
      if (isFunction(parseValue)) return parseValue(valueOrDefaultValue, blitzFieldContext)
      return valueOrDefaultValue
    }
    const quasarColumnConfig = {
      name: id,
      field,
      label,
      align: ['left', 'right', 'center'].includes(align)
        ? align
        : [valueType, type].includes('number')
        ? 'right'
        : 'left',
      sortable: isBoolean(sortable) ? sortable : id !== 'id',
      sort: isFunction(sort) ? sort : undefined,
      format: isFunction(format) ? format : undefined,
      headerClasses: [isArray, isPlainObject, isFullString].some((fn) => fn(headerClasses))
        ? headerClasses
        : undefined,
      headerStyle: [isArray, isPlainObject, isFullString].some((fn) => fn(headerStyle))
        ? headerStyle
        : undefined,
      // not sure why i'd want to set these:
      // required,
      // style,
      // classes,
    }
    return quasarColumnConfig
  })
}
