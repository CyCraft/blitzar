import Vue, { PluginFunction, VueConstructor } from 'vue';

export interface BlitzarLang {
  archive: string
  delete: string
  cancel: string
  edit: string
  save: string
  requiredField: string
  formValidationError: string
}

export interface BlitzFieldProps {
  /**
   * The value of the field. The BlitzForm `formData` is an object with the value of each field and the id for key.
   * @type {any}
   * @category model
   */
  value: any

  /**
   * An `id` is required for the BlitzForm to be able to know which fields have which value.
   *
   * A string with dot notation will become a nested field in the `formData`.
   * @type {string}
   * @category model
   */
  id: string

  /**
   * A defaultValue value to be used when the `value` is `undefined`.
   *
   * You can also pass a function that will receive two params you can work with: `(formData, context)`
   * - `formData` is the value object of your BlitzForm. This will be undefined when BlitzField is used as stand-alone (without BlitzForm) unless you manually pass it.
   * - `context` is either your BlitzForm or BlitzField context with many usefull props. See the documentation on Evaluated Props for more info.
   * @type {(formData: Record<string, any>, formContext: FormContext) => any | any}
   * @category model
   */
  defaultValue: any

  /**
   * A function that modifies a value before it is used in the actual component. (see `parseInput` for the reverse)
   * @type {(val: any) => any}
   * @example val => val && val.split(' ').map(str => !str ? '' : `${str[0].toUpperCase()}${str.slice(1)}`).join(' ')
   * @example val => Number(val)
   * @example val => Date(val)
   * @category model
   */
  parseValue: Function

  /**
   * A function that modifies a value after user input but before the value is emitted. (see `parseValue` for the reverse)
   * @type {(val: any) => any}
   * @example val => (val || '').toLowerCase()
   * @example val => val.toISOString()
   * @category model
   */
  parseInput: Function

  /**
   * The component to be used for the field. Is mounted via `<component :is="component" />`. You can pass the name of a native HTML5 element or Vue component that is globally registered. You can also import the Vue file and directly pass the imported object, just like you would when you add it to a Vue file's components prop.
   * @type {string | Function | EvaluatedProp<string | Function>}
   * @example 'input'
   * @example 'MyCustomField'
   * @category content
   */
  component: any
  // object for imported vue instances

  /**
   * An Object with keys for the slot names and an object for values. The object you pass to a slot is itself applied as a `<component is="" />`.
   *
   * The last example below shows how this is actually used under the hood.
   * @type {{ label?: string | Record<string, any> | Record<string, any>[], default?: string | Record<string, any> | Record<string, any>[] } | EvaluatedProp<{ label?: string | Record<string, any> | Record<string, any>[], default?: string | Record<string, any> | Record<string, any>[] }>}
   * @example { label: { component: 'MyTooltip', tip: 'hi' } } }
   * @example <slot name="label"><component :is="slots.label.component" v-bind="slots.label" /></slot>
   * @category content
   */
  slots: object | Function

  /**
   * The text used in the UI for the action buttons and some error messages.
   *
   * The example shows how the error message for required fields is overwritten.
   * @type {{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string } | EvaluatedProp<{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string }>}
   * @example { requiredField: `Don't forget this field!` }
   * @category content
   */
  lang: BlitzarLang
  /**
   * The field label.
   * @type {string | EvaluatedProp<string>}
   * @example 'Your Name'
   * @category content
   */
  label: string | Function

  /**
   * A smaller label for extra info.
   * @type {string | EvaluatedProp<string>}
   * @example 'first and last'
   * @category content
   */
  subLabel: string | Function

  /**
   * The mode represents how fields are rendered
   * - `'edit'` — (default) show editable fields based on the schema
   * - `'view'` — show each field with `readonly: true`
   * - `'disabled'` — show each field with `disabled: true`
   * - `'raw'` — used to show raw data of your form (for select components, it will show the data label instead of its value)
   * - `'add'` — the same as `'edit'`
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {'edit' | 'view' | 'disabled' | 'raw' | 'add' | EvaluatedProp<'edit' | 'view' | 'disabled' | 'raw' | 'add'>}
   * @category state
   */
  mode: string | Function

  /**
   * An Object with an event name as key and the handler function as value. The function you pass will receive the native event payload as first parameter and the BlitzField context (the component instance) as second: `($event, context) => {}`
   * @type {Record<string, (event: any, formContext: FormContext) => any> | EvaluatedProp<Record<string, (event: any, formContext: FormContext) => any>>}
   * @example { click: (val, { formData }) => console.log(formData) }
   * @category behavior
   */
  events: any

  /**
   * Whether or not the field is required or not. If a field is marked 'required' it will add a default rule like so: `[val => (val !== null && val !== undefined) || 'Field is required']`. The default message can be set in the `lang` prop as `requiredField`.
   * @type {boolean | EvaluatedProp<boolean>}
   * @category behavior
   */
  required: boolean | Function

  /**
   * An array of rule functions that receive the value of the field as parameter and should return `true` if the rule passes or a `string` if the rule fails. The string represents the error message that is then shown underneath the field in red.
   * @type {((val: any) => (true | string))[] | EvaluatedProp<((val: any) => (true | string))[]>}
   * @example [val => (val && val.length <= 3) || 'Maximum 3 characters']
   * @category behavior
   */
  rules: any

  /**
   * An array with prop names that should be treated as Evaluated Props when passed a function.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {string[]}
   * @category behavior
   */
  evaluatedProps: string[]

  /**
   * Set to `true` if the component has its own labels and you do not want the BlitzField to show a label.
   *
   * When `true` subLabels will also be hidden and passed to the component instead as a prop called 'hint'.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {boolean | undefined | EvaluatedProp<boolean | undefined>}
   * @category style
   */
  internalLabels: boolean

  /**
   * Set to true if the component has its own error handling. This makes sure it passes on props like `rules` and does nothing with them in the BlitzField.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {boolean | undefined | EvaluatedProp<boolean | undefined>}
   * @category behavior
   */
  internalErrors: boolean

  /**
   * Setting to `false` will hide the field. When using as an Evaluated Prop it can used to conditionally hide fields based on the other `formData`.
   * @type {boolean | EvaluatedProp<boolean>}
   * @example (val, { mode }) => (mode === 'edit')
   * @example false
   * @category state
   */
  showCondition: boolean

  /**
   * `readonly` defaults to `true` on `mode: 'view'`
   * @type {boolean | 'readonly' | EvaluatedProp<boolean | 'readonly'>}
   * @category state
   */
  readonly: boolean

  /**
   * `disabled` defaults to `true` on `mode: 'disabled'`
   * @type {boolean | 'disabled' | EvaluatedProp<boolean | 'disabled'>}
   * @category state
   */
  disabled: boolean

  /**
   * The position of the label in comparison to the field.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {'top' | 'left' | EvaluatedProp<'top' | 'left'>}
   * @category style
   */
  labelPosition: string | Function

  /**
   * Custom styling to be applied to the BlitzField. Applied like so `:style="fieldStyle"`. Can be an Evaluated Prop (this is why I opted to have a different name from `style`).
   *
   * In a BlitzForm schema you can also just write `style: '...'` and BlitzForm will pass that as fieldStyle for you, because "style" is not a valid prop name.
   * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
   * @example 'padding: 0.5em; color: white'
   * @category style
   */
  fieldStyle: any

  /**
   * Custom classes to be applied to the BlitzField. Applied like so `:class="fieldClasses"`. Can be an Evaluated Prop (this is why I opted to have a different name from `class`).
   *
   * In a BlitzForm schema you can also just write `class: '...'` and BlitzForm will pass that as `fieldClasses` for you, because "class" is not a valid prop name.
   * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
   * @example ['dark-theme']
   * @category style
   */
  fieldClasses: any

  /**
   * Custom styling to be applied to the inner component of BlitzField. Applied like so `:style="componentStyle"`. Can be an Evaluated Prop.
   * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
   * @example 'padding: 1em;'
   * @category style
   */
  componentStyle: any

  /**
   * Custom classes to be applied to the inner component of BlitzField. Applied like so `:class="componentClasses"`. Can be an Evaluated Prop.
   * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
   * @example ['dark-theme']
   * @category style
   */
  componentClasses: any

  /**
   * Custom styling to be applied to the label of BlitzField. Applied like so `:style="componentStyle"`. Can be an Evaluated Prop.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
   * @example 'font-weight: 200;'
   * @category style
   */
  labelStyle: any

  /**
   * Custom classes to be applied to the label of BlitzField. Applied like so `:class="labelClasses"`. Can be an Evaluated Prop.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
   * @example ['text-h6']
   * @category style
   */
  labelClasses: any

  /**
   * This is the *nested* data of all the fields inside a BlitzForm. (When using BlitzListForm as standalone, this is an array.)
   *
   * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Evaluated Props.
   * @type {Record<string, any> | Record<string, any>[]}
   * @category readonly
   */
  formData: object | Array<any>

  /**
   * This is the *flattened* data of all the fields inside a BlitzForm.
   *
   * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Evaluated Props.
   * @type {Record<string, any>}
   * @category readonly
   */
  formDataFlat: object

  /**
   * A manually set 'id' of the BlitzForm. This only exists if you passed an id directly to the BlitzForm.
   *
   * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Evaluated Props.
   * @type {string}
   * @category readonly
   */
  formId: string

  /**
   * The `fieldInput` function of BlitzForm. Is passed so it can be used in events. Eg.: `events: { input: (value, { fieldInput } => fieldInput({ id: 'otherField', value }))}`
   *
   * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Evaluated Props.
   * @type {(val: any, formContext: FormContext) => void}
   * @category readonly
   */
  fieldInput: Function

  /**
   * (only present in BlitzListForm!)
   * The `rowInput` function of BlitzForm. Is passed so it can be used in events. Eg.: `events: { input: (value, { fieldInput } => fieldInput({ id: 'otherField', value }))}`
   *
   * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Evaluated Props.
   * @type {(val: any, formContext: FormContext) => void}
   * @category readonly
   */
  rowInput: Function

  /**
   * (only present in BlitzListForm!)
   * The current row index of this field.
   *
   * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Evaluated Props.
   * @type {number}
   * @category readonly
   */
  rowIndex: number

  /**
   * (only present in BlitzListForm!)
   * This is the *nested* data of all the fields of the row.
   *
   * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Evaluated Props.
   * @type {Record<string, any>}
   * @category readonly
   */
  rowData: object

  /**
   * (only present in BlitzListForm!)
   * This is a function that you can call to delete the row.
   *
   * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Evaluated Props.
   * @type {() => void}
   * @category readonly
   */
  deleteRow: Function

  [ key: string ]: any
}

export interface BlitzFormProps extends Vue {
  /**
   * An object with the data of the entire form. The object keys are the ids of the fields passed in the `schema`.
   *
   * To be used with `:value` or `v-model`.
   * @type {Record<string, any>}
   * @example { name: '' }
   * @category model
   */
  value: any

  /**
   * A manually set `id` of the BlitzForm. This prop is accessible in the `context` (as `formId`) of any Evaluated Prop and event.
   *
   * Read more on Evaluated Props in its dedicated page.
   * @type {string}
   * @category model
   */
  id: string

  /**
   * This is the heart of your BlitzForm. It's the schema that defines what fields will be generated.
   *
   * The possible props you can pass are:
   * - BlitzField props (see BlitzField API Card in the documentation)
   * - any props of the actual component you define
   * @type {Record<string, any>[]}
   * @example [{id: 'name', label: 'Name', component: 'input', style: 'color: white'}, {id: 'age', label: 'Age', component: 'input', type: 'number', style: 'color: white'}]
   * @category model
   */
  schema: BlitzFieldProps[]

  /**
   * Buttons on top of the form that control the `mode` of the form. The possible pre-made buttons are:
   * - `'edit'` — a button which puts the form in 'edit' mode & does `emit('edit')`
   * - `'cancel'` — a button which puts the form in 'view' mode & does `emit('cancel')`
   * - `'save'` — a button which puts the form in 'edit' mode & does `emit('save', {newData, oldData})`
   * - `'delete'` — a red button which does `emit('delete')`
   * - `'archive'` — a red button which does `emit('archive')`
   *
   * You can also pass custom buttons with the same schema to generate forms.
   *
   * See the documentation on Action Buttons for more info.
   * @type {('edit' | 'cancel' | 'save' | 'delete' | 'archive' | Record<string, any>)[]}
   * @example ['delete', 'cancel', 'edit', 'save']
   * @example [{component: 'button', type: 'button', slot: 'log', events: {click: console.log}}]
   * @category content
   */
  actionButtons: any[]

  /**
   * You can overwrite the schema used for the default action buttons for edit, cancel, save, delete & archive.
   * @type {{ edit?: Record<string, any>, cancel?: Record<string, any>, save?: Record<string, any>, delete?: Record<string, any>, archive?: Record<string, any>, }}
   * @example {'save': {push: true}, 'delete': {color: 'secondary'}}
   * @category content
   */
  actionButtonDefaults: any

  /**
   * The position of the action buttons.
   * @type {'top' | 'bottom' | 'right' | 'left'}
   * @category content
   */
  actionButtonsPosition: string

  /**
   * A function which serves as global validator for your form. It will receive the edited data as first param and the original data (before user edits) as second. It should return true if all is OK or a string with error message.
   * @type {(newData: Record<string, any>, oldData: Record<string, any>) => (true | string)}
   * @example (newData, oldData) => newData.pass1 === newData.pass2 || 'passwords don't match'
   * @category behavior
   */
  validator: Function

  /**
   * The amount of columns the form should have. Each field can set a specific 'span' to be able to span multiple columns.
   * @type {number}
   * @category style
   */
  columnCount: number

  /**
   * The size of the gap between each field in the form.
   * @type {string}
   * @category style
   */
  gridGap: string

  /**
   * The text used in the UI for the action buttons and some error messages.
   * @type {{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string } | EvaluatedProp<{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string }>}
   * @example { cancel: 'キャンセル', edit: '編集', save: '保存' }
   * @category content
   */
  lang: BlitzarLang

  /**
   * The mode represents how fields are rendered
   * - `'edit'` — (default) show editable fields based on the schema
   * - `'view'` — show each field with `readonly: true`
   * - `'disabled'` — show each field with `disabled: true`
   * - `'raw'` — used to show raw data of your form (for select components, it will show the data label instead of its value)
   * - `'add'` — the same as `'edit'`
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {'edit' | 'view' | 'disabled' | 'raw' | 'add'}
   * @category state
   */
  mode: string

  /**
   * The position of the label in comparison to the field.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {'top' | 'left'}
   * @category style
   */
  labelPosition: string | Function

  /**
   * Custom styling to be applied to the label of BlitzField. Applied like so `:style="componentStyle"`. Can be an Evaluated Prop.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
   * @example 'font-weight: 200;'
   * @category style
   */
  labelStyle: any

  /**
   * Custom classes to be applied to the label of BlitzField. Applied like so `:class="labelClasses"`. Can be an Evaluated Prop.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
   * @example ['text-h6']
   * @category style
   */
  labelClasses: any

  /**
   * An array with prop names that should be treated as Evaluated Props when passed a function.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {string[]}
   * @category behavior
   */
  evaluatedProps: Array<string | 'component' | 'showCondition' | 'label' | 'subLabel' | 'required' | 'rules' | 'fieldStyle' | 'fieldClasses' | 'componentStyle' | 'componentClasses' | 'disable' | 'events' | 'lang'>

  /**
   * Set to true if the entire form has its own labels and you do not want the BlitzField to show a label.
   *
   * When `true` subLabels will be passed as a prop called 'hint'.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {boolean | undefined}
   * @category behavior
   */
  internalLabels: boolean
  /**
   * Set to true if the entire form has its own error handling. This makes sure it passes on props like `rules` and does nothing with them in the BlitzField.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @type {boolean | undefined}
   * @category behavior
   */
  internalErrors: boolean

  /**
   * Pass the component names (without `.vue`) that have internal error handling. This makes sure it passes on props like `rules` and does nothing with them in the BlitzField.
   * @type {string[]}
   * @category behavior
   */
  internalErrorsFor: Array<string | 'QInput' | 'QSelect' | 'QField' | 'q-input' | 'q-select' | 'q-field'>
  /**
   * The component that should be used to generate the form. Defaults to QForm. You can pass the name of a native HTML5 element or Vue component that is globally registered. You can also import the Vue file and directly pass the imported object, just like you would when you add it to a Vue file's components prop.
   * @type {string | Function}
   * @example 'form'
   * @example 'tr'
   * @example 'MyFormWrapper'
   */
  formComponent: string | Function
}

export interface BlitzField extends BlitzFieldProps, Vue {}

export interface BlitzForm extends BlitzFormProps, Vue {
  fieldInput(payload: { id: string, value: any }): void

  resetState(): void

  restoreBackup(): void

  tapCancel(): void

  validate(): void

  tapEdit(): void

  tapSave(): void

  tapDelete(): void

  tapArchive(): void
}

export const BlitzField: VueConstructor<BlitzForm>;
export const BlitzForm: VueConstructor<BlitzFormProps>;

// as an alias
export interface Schema extends Partial<BlitzFieldProps> {}

/**
 * Validates a form data based on its schema
 *
 * @export
 * @param {PlainObject} formData the form data in an object that looks like: `{[fieldId: string]: any}`
 * @param {Schema} schema
 * @param {StringObject} lang the lang object with at least the key `requiredField` used as error message for required fields
 * @returns {ValidationResultForm}
 */
export function validateFormPerSchema(formData: any, schema: Schema, lang: BlitzarLang)

export default class Blitzar {
  static BlitzForm: BlitzForm;
  static BlitzField: BlitzField;
  static BlitzH: any;
  static BlitzListForm: any;
  static install: PluginFunction<any>;
}
