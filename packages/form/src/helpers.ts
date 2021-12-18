import { merge } from 'merge-anything'

export function getBlitzFieldOverwrites(field: Record<string, any>): Record<string, any> {
  if (!field) return {}

  const overwrites: Record<string, any> = {}

  if (field.slot) {
    overwrites.slots = merge(field.slots || {}, { default: field.slot })
  }
  const fieldClasses = field.fieldClasses || field.class
  if (fieldClasses) overwrites.fieldClasses = fieldClasses

  const fieldStyle = field.fieldStyle || field.style
  if (fieldStyle) overwrites.fieldStyle = fieldStyle

  return overwrites
}
