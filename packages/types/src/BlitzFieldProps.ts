import { PropType } from 'vue'
import { DynamicProp, FormContext, Lang, Mode, ShowErrorsOn } from './core'
import { ExternalProps } from './VueExternalProps'

export const blitzFieldProps = {
  /**
   * The value of the field. The BlitzForm `formData` is an object with the value of each field and the id for key.
   * @category model
   */
  modelValue: { type: null as unknown as PropType<any>, default: undefined },
  /**
   * An `id` is required for the BlitzForm to be able to know which fields have which value.
   *
   * A string with dot notation will become a nested field in the `formData`.
   * @category model
   */
  id: { type: String as PropType<string>, default: undefined },
  /**
   * A default value to be used when the `modelValue` is `undefined`.
   *
   * You can also pass a function that will receive two params you can work with: `(formData, context)`
   * - `formData` is the `modelValue` object of your BlitzForm. This will be undefined when BlitzField is used as stand-alone (without BlitzForm) unless you manually pass it.
   * - `context` is either your BlitzForm or BlitzField context with many usefull props. See the documentation on Dynamic Props for more info.
   * @example
   * ```js
   * // default to an string (just pass it directly)
   * defaultValue: 'Hello'
   * ```
   * @example
   * ```js
   * // default to an array (just like Vue props)
   * defaultValue: () => []
   * ```
   * @example
   * ```js
   * // default to an object (just like Vue props)
   * defaultValue: () => ({})
   * ```
   * @example
   * ```js
   * // default to a Function (you must pass a function that returns your function)
   * defaultValue: () => () => {}
   * ```
   * @category model
   */
  defaultValue: {
    type: undefined as unknown as PropType<
      ((formData: Record<string, any>, formContext: FormContext) => any) | any
    >,
    default: undefined,
  },
  /**
   * A function that modifies a value before it is used in the actual component. (see `parseInput` for the reverse)
   * @example
   * ```js
   * val => val && val.split(' ').map(str => !str ? '' : `${str[0].toUpperCase()}${str.slice(1)}`).join(' ')
   * ```
   * @example
   * ```js
   * val => Number(val)
   * ```
   * @example
   * ```js
   * val => Date(val)
   * ```
   * @category model
   */
  parseValue: {
    type: Function as PropType<(val: any, formContext: FormContext) => any>,
    default: undefined,
  },
  /**
   * A function that modifies a value after user input but before the value is emitted. (see `parseValue` for the reverse)
   * @example
   * ```js
   * val => (val || '').toLowerCase()
   * ```
   * @example
   * ```js
   * val => val.toISOString()
   * ```
   * @category model
   */
  parseInput: {
    type: Function as PropType<(val: any, formContext: FormContext) => any>,
    default: undefined,
  },
  /**
   * The component to be used for the field. Is mounted via `<component :is="component" />`. You can pass the name of a native HTML5 element or Vue component that is globally registered. You can also import the Vue file and directly pass the imported object, just like you would when you add it to a Vue file's components prop.
   * @example 'input'
   * @example 'MyCustomField'
   * @category content
   */
  component: {
    type: [String, Function, Object] as PropType<DynamicProp<string | any>>,
    default: undefined,
  }, // object for imported vue instances
  /**
   * An Object with keys for the slot names and an object for values. The object you pass to a slot is itself applied as a `<component is="" />`.
   *
   * The last example below shows how this is actually used under the hood.
   * @example
   * ```js
   * { label: { component: 'MyTooltip', tip: 'hi' } } }
   * ```
   * @example
   * ```js
   * <slot name="label"><component :is="slots.label.component" v-bind="slots.label" /></slot>
   * ```
   * @category content
   */
  slots: {
    type: [Object, Function] as PropType<
      DynamicProp<{
        label?: string | Record<string, any> | Record<string, any>[]
        default?: string | Record<string, any> | Record<string, any>[]
      }>
    >,
    default: undefined,
  },
  /**
   * The text used in the UI for the action buttons and some error messages.
   *
   * The example shows how the error message for required fields is overwritten.
   * @example
   * ```js
   * { requiredField: `Don't forget this field!` }
   * ```
   * @category content
   */
  lang: {
    type: [Object, Function] as PropType<DynamicProp<Partial<Lang>>>,
    // when changing the default, do it for both BlitzForm; BlitzField and lang.js
    /** @type () => Lang */
    default: () => ({
      archive: 'Archive',
      delete: 'Delete',
      cancel: 'Cancel',
      edit: 'Edit',
      save: 'Save',
      requiredField: 'Field is required',
      formValidationError: 'There are remaining errors.',
    }),
  },
  /**
   * The field label.
   * @example 'Your Name'
   * @category content
   */
  label: { type: [String, Function] as PropType<DynamicProp<string>>, default: undefined },
  /**
   * A smaller label for extra info.
   * @example 'first and last'
   * @category content
   */
  subLabel: {
    type: [String, Function] as PropType<DynamicProp<string>>,
    default: undefined,
  },
  /**
   * The mode represents how fields are rendered
   * - `'edit'` — (default) show editable fields based on the schema
   * - `'readonly'` — show each field with `readonly: true`
   * - `'disabled'` — show each field with `disabled: true`
   * - `'raw'` — used to show raw data of your form (for select components, it will show the data label instead of its value)
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @category state
   */
  mode: {
    type: [String, Function] as PropType<DynamicProp<Mode>>,
    default: 'edit',
    validator: (prop: any) =>
      typeof prop === 'function' ||
      (['edit', 'readonly', 'disabled', 'raw'].includes(prop) as never),
  },
  /**
   * An Object with an event name as key and the handler function as value. The function you pass will receive the native event payload as first parameter and the BlitzField context (the component instance) as second: `($event, context) => {}`
   * @example
   * ```js
   * { click: (val, { formData }) => console.log(formData) }
   * ```
   * @category behavior
   */
  events: {
    type: [Object, Function] as PropType<
      DynamicProp<Record<string, (event: any, formContext: FormContext) => any>>
    >,
    default: () => ({}),
  },
  /**
   * Whether or not the field is required or not. If a field is marked 'required' it will add a default rule like so: `[val => (val !== null && val !== undefined) || 'Field is required']`. The default message can be set in the `lang` prop as `requiredField`.
   * @category behavior
   */
  required: {
    type: [Boolean, Function] as PropType<DynamicProp<boolean | 'required'>>,
    default: undefined,
  },
  /**
   * An array with prop names that should be treated as Dynamic Props when passed a function.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @category behavior
   */
  dynamicProps: {
    type: Array as PropType<string[]>,
    default: () => [
      'component',
      'showCondition',
      'error',
      'required',
      'label',
      'subLabel',
      'fieldStyle',
      'fieldClasses',
      'componentStyle',
      'componentClasses',
      'events',
      'lang',
    ],
  },
  /**
   * Set to `true` if the component will take care of showing the `label` and `subLabel`. Both of these props will be passed to the component and not shown in BlitzField.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @category style
   */
  internalLabels: {
    type: [Boolean, undefined] as PropType<DynamicProp<boolean | undefined>>,
    required: false,
    default: undefined,
  },
  /**
   * Set to true if the component has its own error handling. This makes sure it passes on props like `error` and does nothing with them in the BlitzField.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @category behavior
   */
  internalErrors: {
    type: [Boolean, undefined] as PropType<DynamicProp<boolean | undefined>>,
    required: false,
    default: undefined,
  },
  /**
   * - 'interaction' — evaluates & shows errors on every interaction or keystroke
   * - 'save' — only evaluates & shows errors when clicking 'save'
   * - 'save-focus' — only evaluates & shows errors when clicking 'save', then focuses the first field with an error
   * - 'never' — never evaluate or show errors
   * - 'always' — always evaluate and show errors, even without user interaction
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @category behavior
   */
  showErrorsOn: {
    type: String as PropType<DynamicProp<ShowErrorsOn>>,
    default: 'interaction',
  },
  /**
   * Setting to `false` will hide the field. When using as an Dynamic Prop it can used to conditionally hide fields based on the other `formData`.
   * @example
   * ```js
   * (val, { mode }) => (mode === 'edit')
   * ```
   * @example false
   * @category state
   */
  showCondition: {
    type: [Boolean, Function] as PropType<DynamicProp<boolean>>,
    default: true,
  },
  /**
   * `readonly` defaults to `true` on `mode: 'readonly'`
   * @category state
   */
  readonly: {
    type: [Boolean, Function, String, undefined] as PropType<DynamicProp<boolean | 'readonly'>>,
    default: undefined,
  },
  /**
   * `disabled` defaults to `true` on `mode: 'disabled'`
   * @category state
   */
  disabled: {
    type: [Boolean, Function, String, undefined] as PropType<DynamicProp<boolean | 'disabled'>>,
    default: undefined,
  },
  /**
   * Error can be passed a `string` which will be displayed below the field as an error message.
   *
   * Usually it's more useful to use as DynamicProp:
   * - pass a function that receives the value of the field as payload
   * - return `null` if there should be no error shown
   * - return a `string` with your error message if there should be an error
   *
   * @example
   * ```js
   * {
   *   dynamicProps: ['error'],
   *   error: (val) => Number(val) >= 18 ? null : 'You have to be over 18!'
   * }
   * ```
   */
  error: {
    type: [String, Function] as PropType<DynamicProp<string | null>>,
    default: undefined,
  },
  /**
   * The position of the label in comparison to the field.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @category style
   */
  labelPosition: {
    type: [String, Function] as PropType<DynamicProp<'top' | 'left'>>,
    default: 'top',
    validator: (prop: any) =>
      typeof prop === 'function' || (['top', 'left'].includes(prop) as never),
  },
  /**
   * Custom styling to be applied to the BlitzField. Applied like so `:style="fieldStyle"`. Can be an Dynamic Prop (this is why I opted to have a different name from `style`).
   *
   * In a BlitzForm schema you can also just write `style: '...'` and BlitzForm will pass that as fieldStyle for you, because "style" is not a valid prop name.
   * @example 'padding: 0.5em; color: white'
   * @category style
   */
  fieldStyle: {
    type: [Object, Array, String, Function] as PropType<
      DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>
    >,
    default: undefined,
  },
  /**
   * Custom classes to be applied to the BlitzField. Applied like so `:class="fieldClasses"`. Can be an Dynamic Prop (this is why I opted to have a different name from `class`).
   *
   * In a BlitzForm schema you can also just write `class: '...'` and BlitzForm will pass that as `fieldClasses` for you, because "class" is not a valid prop name.
   * @example ['dark-theme']
   * @category style
   */
  fieldClasses: {
    type: [Object, Array, String, Function] as PropType<
      DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>
    >,
    default: undefined,
  },
  /**
   * Custom styling to be applied to the inner component of BlitzField. Applied like so `:style="componentStyle"`. Can be an Dynamic Prop.
   * @example 'padding: 1em;'
   * @category style
   */
  componentStyle: {
    type: [Object, Array, String, Function] as PropType<
      DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>
    >,
    default: undefined,
  },
  /**
   * Custom classes to be applied to the inner component of BlitzField. Applied like so `:class="componentClasses"`. Can be an Dynamic Prop.
   * @example ['dark-theme']
   * @category style
   */
  componentClasses: {
    type: [Object, Array, String, Function] as PropType<
      DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>
    >,
    default: undefined,
  },
  /**
   * Custom styling to be applied to the label of BlitzField. Applied like so `:style="componentStyle"`. Can be an Dynamic Prop.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @example 'font-weight: 200;'
   * @category style
   */
  labelStyle: {
    type: [Object, Array, String, Function] as PropType<
      DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>
    >,
    default: undefined,
  },
  /**
   * Custom classes to be applied to the label of BlitzField. Applied like so `:class="labelClasses"`. Can be an Dynamic Prop.
   *
   * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
   * @example ['text-h6']
   * @category style
   */
  labelClasses: {
    type: [Object, Array, String, Function] as PropType<
      DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>
    >,
    default: undefined,
  },
  /**
   * This is the *nested* data of all the fields inside a BlitzForm. (When using BlitzListForm as standalone, this is an array.)
   *
   * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
   * @category readonly
   */
  formData: {
    type: [Object, Array] as PropType<Record<string, any> | Record<string, any>[]>,
    default: undefined,
  },
  /**
   * This is the *flattened* data of all the fields inside a BlitzForm.
   *
   * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
   * @category readonly
   */
  formDataFlat: { type: Object as PropType<Record<string, any>>, default: undefined },
  /**
   * A manually set 'id' of the BlitzForm. This only exists if you passed an id directly to the BlitzForm.
   *
   * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
   * @category readonly
   */
  formId: { type: String as PropType<string>, default: undefined },
  /**
   * The `mode` of the BlitzForm. A BlitzField inherits the `mode` from the `BlitzForm` via its `mode` prop; however, if you had manually overwritten the mode to be something else, `formMode` can be used to check the current mode of the form. This can be useful inside an Dynamic Prop.
   *
   * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
   * @category readonly
   */
  formMode: {
    type: String as PropType<Mode>,
    default: undefined,
    validator: (prop: any) => ['edit', 'readonly', 'disabled', 'raw'].includes(prop) as never,
  },
  /**
   * The `updateField` function of BlitzForm. Is passed so it can be used in events. Eg.: `events: { '@update:modelValue': (value, { updateField } => updateField({ id: 'otherField', value }))}`
   *
   * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
   * @category readonly
   */
  updateField: {
    type: Function as PropType<(val: any, formContext: FormContext) => void>,
    default: undefined,
  },
  /**
   * (only present in BlitzListForm!)
   * The `updateRow` function of BlitzForm. Is passed so it can be used in events. Eg.: `events: { '@update:modelValue': (value, { updateRow } => updateRow({ id: 'otherFieldInRow', value }))}`
   *
   * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Dynamic Props.
   * @category readonly
   */
  updateRow: {
    type: Function as PropType<(payload: { id: string; value: any }) => void>,
    default: undefined,
  },
  /**
   * (only present in BlitzListForm!)
   * The current row index of this field.
   *
   * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Dynamic Props.
   * @category readonly
   */
  rowIndex: { type: Number as PropType<number>, default: undefined },
  /**
   * (only present in BlitzListForm!)
   * This is the *nested* data of all the fields of the row.
   *
   * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Dynamic Props.
   * @category readonly
   */
  rowData: { type: Object as PropType<Record<string, any>>, default: undefined },
  /**
   * (only present in BlitzListForm!)
   * This is a function that you can call to delete the row.
   *
   * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Dynamic Props.
   * @category readonly
   */
  deleteRow: { type: Function as PropType<() => void>, default: undefined },
} as const

export type BlitzFieldProps = ExternalProps<typeof blitzFieldProps> & { [key in string]: unknown }
