export type FormContext = {
  formData: Record<string, any>
  formDataFlat: Record<string, any>
  formMode: 'edit' | 'readonly' | 'disabled' | 'raw'
  mode: 'edit' | 'readonly' | 'disabled' | 'raw'
  updateField: (payload: { id: string; value: any }) => void
  lang: Lang
  /** Only available in BlitzListForm */
  rowData: Record<string, any>
  /** Only available in BlitzListForm */
  updateRow: (payload: { id: string; value: any }) => void
  /** Only available in BlitzListForm */
  deleteRow?: () => void
  /** Only available in BlitzListForm */
  rowIndex?: number
  [key: string]: any
}

export type DynamicProp<T> = (val: any, formContext: FormContext) => T

/**
 * TODO: This is actually just the type of the props of a BlitzField.vue
 *       must find a better way to auto type this
 */
export type BlitzFieldProps = {
  error?: (val: any, formContext: FormContext) => null | string
  required?: boolean
  [key: string]: any
}

export type Schema = BlitzFieldProps[]

export type Mode = 'edit' | 'readonly' | 'disabled' | 'raw'

export type ShowErrorsOn = 'interaction' | 'save' | 'save-focus' | 'never' | 'always'

export type Lang = {
  archive: string
  delete: string
  cancel: string
  edit: string
  save: string
  requiredField: string
  formValidationError: string
}

/**
 * the 'origin' param explains the reason `@update:modelValue` was emitted from a field:
 * - `undefined` regular field input — no special reason
 * - `'default'`  was because of the provided `defaultValue` in the schema
 * - `'cancel'` the reason `@update:modelValue` was emitted from a field was because the user clicked "cancel" in the BlitzForm
 */
export type UpdateModelValueOrigin = 'default' | 'cancel' | undefined
