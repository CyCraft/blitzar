import { isDate, isNumber, isPlainObject, isArray } from 'is-what'
import commafy from 'commafy-anything'

/**
 * takes a value and returns the parsed value based on a BlitzField blueprint provided.
 *
 * @export
 * @param {*} value any value. In our example blueprint `1` should be returned as `'one'`
 * @param {Record<string, any>} blueprint a blueprint like eg.
 *     - `{options: [{value: 1, label: 'one'}]}` out of which the "label" will be retrieved.
 *     - Besides `options` you can also have `prefix` and `suffix`.
 *     - When `valueType: 'date'` and the value is a `Date` type, it will be printed as toLocaleDateString().
 *     - When `valueType: 'number'` it will receive thousand separators.
 * @returns {*} the parsed value
 */
export function parseFieldValue(value: any, blueprint: Record<string, any>): any {
  if (!blueprint) return value
  const { valueType, options, multiple, suffix, prefix, slot, slots, component } = blueprint
  const valueArray = !isArray(value) ? [value] : value
  const newValue = valueArray.map((val: any) => {
    let newVal = val
    // special handling for HTML5 'select' fields:
    const isHtml5SelectField = component === 'select' && (isArray(slot) || isArray(slots?.default))
    const selectOptions = isHtml5SelectField ? slot || slots?.default : options
    if (isArray(selectOptions)) {
      if (valueType === 'object' && isPlainObject(value)) {
        newVal = multiple
          ? Object.values(value)
              .filter((v) => v)
              .join(', ')
          : value.label
      } else {
        if (isPlainObject(val)) {
          newVal = val.label
        } else {
          const option = selectOptions.find((o) => o.value === val) || {}
          newVal = option.label || option.slot || option.slots?.default || val
        }
      }
    }
    if (valueType === 'date' && isDate(value)) newVal = value.toLocaleDateString()
    if (valueType === 'number' && isNumber(value)) newVal = commafy(newVal)
    if (suffix) newVal = `${newVal}${suffix}`
    if (prefix) newVal = `${prefix}${newVal}`
    return newVal
  })
  return newValue.join(', ')
}
