import { isFullString } from 'is-what'
import { merge } from 'merge-anything'

export function getBlitzFieldOverwrites(
  field: Record<string, any>,
  lang: Record<string, string>
): Record<string, any> {
  if (!field) return {}

  const overwrites: Record<string, any> = {}

  const label = 'label' in field ? field.label : lang[field?.id]
  if (isFullString(label)) {
    overwrites.label = label
  }
  if (field.slot) {
    overwrites.slots = merge(field.slots || {}, { default: field.slot })
  }
  const fieldClasses = field.fieldClasses || field.class
  if (fieldClasses) overwrites.fieldClasses = fieldClasses

  const fieldStyle = field.fieldStyle || field.style
  if (fieldStyle) overwrites.fieldStyle = fieldStyle

  return overwrites
}
