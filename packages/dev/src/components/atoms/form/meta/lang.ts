import { StringObject } from '../types'

// when changing the default, do it for both BlitzForm; BlitzField and lang.js

export const defaultLang = (): StringObject => ({
  archive: 'Archive',
  delete: 'Delete',
  cancel: 'Cancel',
  edit: 'Edit',
  save: 'Save',
  requiredField: 'Field is required',
  formValidationError: 'There are remaining errors.',
})
