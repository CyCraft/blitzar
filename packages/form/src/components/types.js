/**
 * @export
 * @typedef FormContext
 * @type {{
 *   formData: Record<string, any>,
 *   formDataFlat: Record<string, any>,
 *   mode: 'edit' | 'readonly' | 'disabled' | 'raw',
 *   formMode: 'edit' | 'readonly' | 'disabled' | 'raw',
 *   updateField: (payload: { id: string, value: any }) => void,
 *   [key: string]: any
 * }}
 */

/**
 * @export
 * @template T
 * @typedef {(val: any, formContext: FormContext) => T} DynamicProp
 */

/**
 * TODO: This is actually just the type of the props of a BlitzField.vue
 *       must find a better way to auto type this
 * @export
 * @typedef BlitzFieldProps
 * @type {{
 *   error?: (val: any, formContext: FormContext) => (null | string)
 *   required?: boolean
 *   [key: string]: any
 * }}
 */

/**
 * @export
 * @typedef Schema
 * @type {BlitzFieldProps[] | { [key in string]: BlitzFieldProps }}
 */

/**
 * @export
 * @typedef Mode
 * @type {'edit' | 'readonly' | 'disabled' | 'raw'}
 */

/**
 * @export
 * @typedef ShowErrorsOn
 * @type {'interaction' | 'save' | 'save-focus' | 'never' | 'always'}
 */

/**
 * @export
 * @typedef Lang
 * @type {{
 *   archive: string,
 *   delete: string,
 *   cancel: string,
 *   edit: string,
 *   save: string,
 *   requiredField: string,
 *   formValidationError: string,
 * }}
 */
