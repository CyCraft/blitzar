/**
 * @param {Record<string, any>} [field]
 * @returns {Record<string, any>}
 */
export function getBlitzFieldOverwrites(field) {
  if (!field) return {}

  const overwrites = {}

  if (field.slot) {
    overwrites.slots = merge(field.slots || {}, { default: field.slot })
  }
  const fieldClasses = field.fieldClasses || field.class
  if (fieldClasses) overwrites.fieldClasses = fieldClasses

  const fieldStyle = field.fieldStyle || field.style
  if (fieldStyle) overwrites.fieldStyle = fieldStyle

  return overwrites
}
