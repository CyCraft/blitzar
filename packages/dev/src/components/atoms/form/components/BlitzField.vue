<template>
  <div
    v-if="evalPropOrAttr('showCondition')"
    :class="
      [
        'blitz-field',
        `blitz-field--${evalPropOrAttr('mode')}`,
        `blitz-field--${componentName}`,
        `blitz-field--label-${labelPosition}`,
        {
          'blitz-field--no-label': !labelUsedHere,
          'blitz-field--no-sub-label': !subLabelHtmlUsedHere,
          'blitz-field--no-component': !componentName,
        },
        evalPropOrAttr('fieldClasses'),
      ].flat()
    "
    :style="evalPropOrAttr('fieldStyle')"
  >
    <div
      v-if="labelUsedHere || (evalPropOrAttr('slots') && evalPropOrAttr('slots').label)"
      :class="['blitz-field__label', evalPropOrAttr('labelClasses')].flat()"
      :style="evalPropOrAttr('labelStyle')"
    >
      {{ labelUsedHere }}
      <!-- @slot The label slot is the area behind the label on the same line. This slot can be set via the schema at `slots: {label: 'slot content'}`. See the "slots" documentation for more info. -->
      <slot name="label">
        <BlitzH
          v-if="evalPropOrAttr('slots') && evalPropOrAttr('slots').label"
          :options="evalPropOrAttr('slots').label"
        />
      </slot>
    </div>
    <div v-if="subLabelHtmlUsedHere" class="blitz-field__sub-label" v-html="subLabelHtmlUsedHere" />
    <!-- no component -->
    <template v-if="!evalPropOrAttr('component')"></template>
    <!-- raw component -->
    <BlitzH
      v-else-if="evalPropOrAttr('mode') === 'raw'"
      :options="{
        component: 'div',
        slot: parsedFieldValue,
        class: ['blitz-field__component', evalPropOrAttr('componentClasses')].flat(),
        style: evalPropOrAttr('componentStyle'),
      }"
    />
    <!-- raw component -->
    <input
      v-else-if="usesInternalOrNoErrors && evalPropOrAttr('component') === 'input'"
      v-model="cValue"
      v-bind="propsAndAttrsToPass"
      v-on="eventsCalculated"
      :class="['blitz-field__component', evalPropOrAttr('componentClasses')].flat()"
      :style="evalPropOrAttr('componentStyle')"
    />
    <select
      v-else-if="usesInternalOrNoErrors && evalPropOrAttr('component') === 'select'"
      v-model="cValue"
      v-bind="propsAndAttrsToPass"
      v-on="eventsCalculated"
      :class="['blitz-field__component', evalPropOrAttr('componentClasses')].flat()"
      :style="evalPropOrAttr('componentStyle')"
    >
      <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
    </select>
    <component
      v-else-if="usesInternalOrNoErrors"
      :is="evalPropOrAttr('component')"
      v-model="cValue"
      v-bind="propsAndAttrsToPass"
      v-on="eventsCalculated"
      :class="['blitz-field__component', evalPropOrAttr('componentClasses')].flat()"
      :style="evalPropOrAttr('componentStyle')"
    >
      <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
    </component>
    <QField
      v-else
      v-model="cValue"
      v-bind="propsAndAttrsToPassForQField"
      class="blitz-field__component-validation"
    >
      <template v-slot:control>
        <input
          v-if="evalPropOrAttr('component') === 'input'"
          v-model="cValue"
          v-bind="propsAndAttrsToPass"
          v-on="eventsCalculated"
          :class="['blitz-field__component', ...evalPropOrAttr('componentClasses')]"
          :style="evalPropOrAttr('componentStyle')"
        />
        <select
          v-else-if="evalPropOrAttr('component') === 'select'"
          v-model="cValue"
          v-bind="propsAndAttrsToPass"
          v-on="eventsCalculated"
          :class="['blitz-field__component', ...evalPropOrAttr('componentClasses')]"
          :style="evalPropOrAttr('componentStyle')"
        >
          <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
        </select>
        <component
          v-else
          :is="evalPropOrAttr('component')"
          v-model="cValue"
          v-bind="propsAndAttrsToPass"
          v-on="eventsCalculated"
          :class="['blitz-field__component', ...evalPropOrAttr('componentClasses')]"
          :style="evalPropOrAttr('componentStyle')"
        >
          <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
        </component>
      </template>
    </QField>
  </div>
</template>

<style lang="sass">
@import '../index.sass'

// layout
.blitz-field
  max-width: 100%
  display: grid
  align-content: start
  grid-gap: $sm $md
  // grid-grid-template-areas: "label" \
  //                           "sublabel" \
  //                           "field"
  // grid-grid-template-areas: "label sublabel" \
  //                           "label field" \
  //                           "empty field"
  // grid-grid-template-areas: "label    field" \
  //                           "sublabel field"
  &--label-top
    grid-auto-flow: row
  &--label-left
    grid-auto-flow: column
    grid-template-columns: minmax(auto, max-content)
    grid-auto-columns: minmax(50%, 1fr)
    grid-template-rows: auto
    grid-auto-rows: 1fr
    .blitz-field__sub-label
      grid-row: 2 / 3
    .blitz-field__component
      grid-row: 1 / 3
    &.blitz-field--no-sub-label
      .blitz-field__label
        display: flex
        align-items: center
      .blitz-field__component
        grid-row: 1 / 2
  .blitz-field__component
    flex: 1
  /** this fixes an issue where QInput fields are larger when they have rules */
  .blitz-field__component-validation
    .q-field__control,
    .q-field__native
      min-height: 40px

// style
.blitz-field
  .blitz-field__sub-label
    opacity: 0.8
    font-weight: 300
    .q-markdown--token
      white-space: pre-wrap
      word-break: break-word
</style>

<script>
import snarkdown from 'snarkdown'
import { QField } from 'quasar'
import {
  isFunction,
  isPlainObject,
  isString,
  isUndefined,
  isNullOrUndefined,
  isFullString,
  isBoolean,
} from 'is-what'
import { merge } from 'merge-anything'
import { mapObject } from 'map-anything'
import { parseFieldValue } from '@blitzar/utils'
import BlitzH from './BlitzH'
import { defaultLang } from '../meta/lang'
import { createRequiredRule } from '../helpers/validation.js'

function evaluateProp(propValue, componentValue, componentInstance) {
  return isFunction(propValue) ? propValue(componentValue, componentInstance) : propValue
}

/**
 * @typedef FormContext
 * @type {{
  formData: Record<string, any>,
  fieldInput: (payload: { id: string, value: any }) => void,
  [key: string]: any
}}
 */
/**
 * @typedef EvaluatedProp<T>
 * @type {(val: any, formContext: FormContext) => T}
 */
/**
 * @typedef Any
 * @type {{}}
 */

/**
`<BlitzField />` is what is used by BlitzForm under the hood to render the form fields.

Use this API Card to check out all the possible props you can use in a single field of a schema.
 */
export default {
  name: 'BlitzField',
  inheritAttrs: false,
  components: { QField, BlitzH },
  props: {
    /**
     * The value of the field. The BlitzForm formData is an object with the value of each field and the id for key.
     * @type {any}
     * @category model
     */
    value: { type: undefined },
    /**
     * An 'id' is required for the BlitzForm to be able to know which fields have which value.
     *
     * A string with dot notation will become a nested field in the formData.
     * @type {string}
     * @category model
     */
    id: { type: String },
    /**
     * A defaultValue value to be used when the 'value' is `undefined`.
     *
     * You can also pass a function that will receive two params you can work with: `(formData, context)`
     * - `formData` is the value object of your BlitzForm. This will be undefined when BlitzField is used as stand-alone (without BlitzForm) unless you manually pass it.
     * - `context` is either your BlitzForm or BlitzField context with many usefull props. See the documentation on "Evaluated Props" for more info.
     * @type {(formData: Record<string, any>, formContext: FormContext) => any | any}
     * @category model
     */
    defaultValue: { type: undefined },
    /**
     * A function that modifies a value before it is used in the actual component. (see `parseInput` for the reverse)
     * @type {(val: any) => any}
     * @example val => val && val.split(' ').map(str => !str ? '' : `${str[0].toUpperCase()}${str.slice(1)}`).join(' ')
     * @example val => Number(val)
     * @example val => Date(val)
     * @category model
     */
    parseValue: { type: Function },
    /**
     * A function that modifies a value after user input but before the value is emitted. (see `parseValue` for the reverse)
     * @type {(val: any) => any}
     * @example val => (val || '').toLowerCase()
     * @example val => val.toISOString()
     * @category model
     */
    parseInput: { type: Function },
    /**
     * The component to be used for the field. Is mounted via `<component :is="component" />`. You can pass the name of a native HTML5 element or Vue component that is globally registered. You can also import the Vue file and directly pass the imported object, just like you would when you add it to a Vue file's components prop.
     * @type {string | Function | EvaluatedProp<string | Function>}
     * @example 'input'
     * @example 'MyCustomField'
     * @category content
     */
    component: { type: [String, Function, Object] }, // object for imported vue instances
    /**
     * An Object with keys for the slot names and an object for values. The object you pass to a slot is itself applied as a `<component is="" />`.
     *
     * The last example below shows how this is actually used under the hood.
     * @type {{ label?: string | Record<string, any> | Record<string, any>[], default?: string | Record<string, any> | Record<string, any>[] } | EvaluatedProp<{ label?: string | Record<string, any> | Record<string, any>[], default?: string | Record<string, any> | Record<string, any>[] }>}
     * @example { label: { component: 'MyTooltip', tip: 'hi' } } }
     * @example <slot name="label"><component :is="slots.label.component" v-bind="slots.label" /></slot>
     * @category content
     */
    slots: { type: [Object, Function] },
    /**
     * The text used in the UI for the action buttons and some error messages.
     *
     * The example shows how the "required fields" error message is overwritten.
     * @type {{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string } | EvaluatedProp<{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string }>}
     * @example { requiredField: `Don't forget this field!` }
     * @category content
     */
    lang: {
      type: [Object, Function],
      // when changing the default, do it for both BlitzForm; BlitzField and lang.js
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
     * @type {string | EvaluatedProp<string>}
     * @example 'Your Name'
     * @category content
     */
    label: { type: [String, Function] },
    /**
     * A smaller label for extra info.
     * @type {string | EvaluatedProp<string>}
     * @example 'first and last'
     * @category content
     */
    subLabel: { type: [String, Function] },
    /**
     * The mode represents how fields are rendered
     * - `'edit'`: (default) Show editable fields based on the schema
     * - `'view'`: Show each field with `readonly: true`.
     * - `'disabled'`: Show each field with `disabled: true`.
     * - `'raw'`: Used to show raw data of your form. No fields are generated, just divs with the labels and values. This mode is powerful because it will automatically map values to the schema provided (eg. adding pre-/suffix; mapping to options of a select; etc.)
     * - `'add'`: The same as 'edit'
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {'edit' | 'view' | 'disabled' | 'raw' | 'add' | EvaluatedProp<'edit' | 'view' | 'disabled' | 'raw' | 'add'>}
     * @category state
     */
    mode: { type: [String, Function], default: 'edit' },
    /**
     * An Object with an event name as key and the handler function as value. The function you pass will receive the native event payload as first parameter and the BlitzField context (the component instance) as second: `($event, context) => {}`
     * @type {Record<string, (event: any, formContext: FormContext) => any> | EvaluatedProp<Record<string, (event: any, formContext: FormContext) => any>>}
     * @example { click: (val, { formData }) => console.log(formData) }
     * @category behavior
     */
    events: { type: [Object, Function], default: () => ({}) },
    /**
     * Whether or not the field is required or not. If a field is marked 'required' it will add a default rule like so: `[val => (val !== null && val !== undefined) || 'Field is required']`. The default message can be set in the `lang` prop as `requiredField`.
     * @type {boolean | EvaluatedProp<boolean>}
     * @category behavior
     */
    required: { type: [Boolean, Function] },
    /**
     * An array of rule functions that receive the value of the field as parameter and should return `true` if the rule passes or a `string` if the rule fails. The string represents the error message that is then shown underneath the field in red.
     * @type {((val: any) => (true | string))[] | EvaluatedProp<((val: any) => (true | string))[]>}
     * @example [val => (val && val.length <= 3) || 'Maximum 3 characters']
     * @category behavior
     */
    rules: { type: [Array, Function], default: () => [] },
    /**
     * An array with prop names that should be treated as "Evaluated Props" when passed a function.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {string[]}
     * @category behavior
     */
    evaluatedProps: {
      type: Array,
      default: () => [
        'component',
        'showCondition',
        'label',
        'subLabel',
        'required',
        'rules',
        'fieldStyle',
        'fieldClasses',
        'componentStyle',
        'componentClasses',
        'disable',
        'events',
        'lang',
      ],
    },
    /**
     * Set to `true` if the component has its own labels and you do not want the BlitzField to show a label.
     *
     * When `true` subLabels will also be hidden and passed to the component instead as a prop called 'hint'.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {boolean | undefined | EvaluatedProp<boolean | undefined>}
     * @category style
     */
    internalLabels: { type: [Boolean, undefined], required: false, default: undefined },
    /**
     * Set to true if the component has its own error handling. This makes sure it passes on props like `rules` and does nothing with them in the BlitzField.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {boolean | undefined | EvaluatedProp<boolean | undefined>}
     * @category behavior
     */
    internalErrors: { type: [Boolean, undefined], required: false, default: undefined },
    /**
     * Setting to `false` will hide the field. When using as an Evaluated Prop it can used to conditionally hide fields based on the other formData.
     * @type {boolean | EvaluatedProp<boolean>}
     * @example (val, { mode }) => (mode === 'edit')
     * @example false
     * @category state
     */
    showCondition: { type: [Boolean, Function], default: true },
    /**
     * `readonly` defaults to `true` on `mode: 'view'
     * @type {boolean | 'readonly' | EvaluatedProp<boolean | 'readonly'>}
     * @category state
     */
    readonly: { type: [Boolean, Function, String, undefined], default: undefined },
    /**
     * `disabled` defaults to `true` on `mode: 'disabled'.
     * @type {boolean | 'disabled' | EvaluatedProp<boolean | 'disabled'>}
     * @category state
     */
    disabled: { type: [Boolean, Function, String, undefined], default: undefined },
    /**
     * The position of the label in comparison to the field.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {'top' | 'left' | EvaluatedProp<'top' | 'left'>}
     * @category style
     */
    labelPosition: {
      type: [String, Function],
      default: 'top',
      validator: (prop) => ['top', 'left'].includes(prop),
    },
    /**
     * Custom styling to be applied to the BlitzField. Applied like so `:style="fieldStyle"`. Can be an Evaluated Prop (this is why I opted to have a different name from `style`).
     *
     * In a BlitzForm schema you can also just write `style: '...'` and BlitzForm will pass that as fieldStyle for you, because "style" is not a valid prop name.
     * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
     * @example 'padding: 0.5em; color: white'
     * @category style
     */
    fieldStyle: { type: [Object, Array, String, Function] },
    /**
     * Custom classes to be applied to the BlitzField. Applied like so `:class="fieldClasses"`. Can be an Evaluated Prop (this is why I opted to have a different name from `class`).
     *
     * In a BlitzForm schema you can also just write `class: '...'` and BlitzForm will pass that as fieldClasses for you, because "class" is not a valid prop name.
     * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
     * @example ['dark-theme']
     * @category style
     */
    fieldClasses: { type: [Object, Array, String, Function] },
    /**
     * Custom styling to be applied to the inner component of BlitzField. Applied like so `:style="componentStyle"`. Can be an Evaluated Prop.
     * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
     * @example 'padding: 1em;'
     * @category style
     */
    componentStyle: { type: [Object, Array, String, Function] },
    /**
     * Custom classes to be applied to the inner component of BlitzField. Applied like so `:class="componentClasses"`. Can be an Evaluated Prop.
     * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
     * @example ['dark-theme']
     * @category style
     */
    componentClasses: { type: [Object, Array, String, Function] },
    /**
     * Custom styling to be applied to the label of BlitzField. Applied like so `:style="componentStyle"`. Can be an Evaluated Prop.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
     * @example 'font-weight: 200;'
     * @category style
     */
    labelStyle: { type: [Object, Array, String, Function] },
    /**
     * Custom classes to be applied to the label of BlitzField. Applied like so `:class="labelClasses"`. Can be an Evaluated Prop.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
     * @example ['text-h1']
     * @category style
     */
    labelClasses: { type: [Object, Array, String, Function] },
    /**
     * This is the *nested* data of all the fields inside a BlitzForm.
     *
     * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Evaluated Props.
     * @type {Record<string, any>}
     * @category readonly
     */
    formData: { type: Object },
    /**
     * This is the *flattened* data of all the fields inside a BlitzForm.
     *
     * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Evaluated Props.
     * @type {Record<string, any>}
     * @category readonly
     */
    formDataFlat: { type: Object },
    /**
     * A manually set 'id' of the BlitzForm. This only exists if you passed an id directly to the BlitzForm.
     *
     * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Evaluated Props.
     * @type {string}
     * @category readonly
     */
    formId: { type: String },
    /**
     * The `fieldInput` function of BlitzForm. Is passed so it can be used in the input event: `events: { input: (value, { fieldInput } => fieldInput({ id: 'otherField', value }))}`
     *
     * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Evaluated Props.
     * @type {(val: any, formContext: FormContext) => void}
     * @category readonly
     */
    fieldInput: { type: Function },
  },
  data() {
    const { value, defaultValue, formData } = this
    if (!isUndefined(value)) return { innerValue: value }
    const innerValue = isFunction(defaultValue) ? defaultValue(formData, this) : defaultValue
    this.event('input', innerValue, 'default')
    return {
      innerValue,
    }
  },
  watch: {
    value(newValue) {
      this.innerValue = newValue
    },
  },
  methods: {
    evalPropOrAttr(propOrAttr) {
      const { evaluatedPropsDataObject } = this
      if (propOrAttr in evaluatedPropsDataObject) return evaluatedPropsDataObject[propOrAttr]
      if (propOrAttr in this) return this[propOrAttr]
      return this.$attrs[propOrAttr]
    },
    /**
     * @param {'input'} eventName
     * @param {any} payload
     * @param {'default' | '' | undefined} origin
     */
    event(eventName, payload, origin) {
      if (eventName === 'input') {
        /**
         * This event enables the field to be usable with `v-model="value"`
         * @property {any} payload the updated value
         * @property {'default' | '' | undefined} origin the cause of the input event:
         * - `'default'` means that the event was emitted when the form was mounted and all fields have initialised their default values.
         * - input events from user input won't have an origin.
         */
        this.$emit('input', payload, origin)
      }
    },
  },
  computed: {
    cValue: {
      get() {
        const { parseValue, innerValue } = this
        if (isFunction(parseValue)) return parseValue(innerValue, this)
        return innerValue
      },
      set(val, ...otherArguments) {
        const { parseInput, evalPropOrAttr } = this
        const events = evalPropOrAttr('events')
        if (isFunction(parseInput)) val = parseInput(val, this)
        if (isFunction(events.input)) events.input(val, this)
        this.event('input', val, ...otherArguments)
      },
    },
    evaluatedPropsDataObject() {
      const { evaluatedProps, cValue } = this
      const context = this
      return evaluatedProps.reduce((carry, propKey) => {
        if (propKey === 'slots' || propKey === 'slot') {
          const slotsValue = 'slots' in context ? context['slots'] : context.$attrs['slots']
          carry['slots'] = isPlainObject(slotsValue)
            ? mapObject(slotsValue, (propValue) => evaluateProp(propValue, cValue, context))
            : evaluateProp(slotsValue, cValue, context)
          return carry
        }
        const propValue = propKey in context ? context[propKey] : context.$attrs[propKey]
        carry[propKey] = evaluateProp(propValue, cValue, context)
        return carry
      }, {})
    },
    defaultSlotCalculated() {
      const { evalPropOrAttr } = this
      const slots = evalPropOrAttr('slots')
      if (isPlainObject(slots)) return slots.default
    },
    componentName() {
      const { evalPropOrAttr } = this
      const component = evalPropOrAttr('component')
      if (isString(component)) return component
      const { name } = component || {}
      return name
    },
    usesInternalOrNoErrors() {
      const { evalPropOrAttr, componentName, rulesCalculated } = this
      const internalErrors = evalPropOrAttr('internalErrors')
      if (internalErrors !== undefined) return internalErrors
      return !rulesCalculated.length
    },
    usesInternalLabels() {
      const { evalPropOrAttr, componentName } = this
      const internalLabels = evalPropOrAttr('internalLabels')
      return internalLabels && !isNullOrUndefined(componentName)
    },
    langCalculated() {
      const { evalPropOrAttr } = this
      const defaults = defaultLang() || {}
      const lang = evalPropOrAttr('lang') || {}
      return merge(defaults, lang)
    },
    rulesCalculated() {
      const { evalPropOrAttr, langCalculated } = this
      const required = evalPropOrAttr('required')
      const rules = evalPropOrAttr('rules')
      if (required) {
        const requiredRule = createRequiredRule(langCalculated['requiredField'])
        return [requiredRule, ...rules]
      }
      return rules
    },
    eventsCalculated() {
      const { evalPropOrAttr } = this
      const context = this
      const events = evalPropOrAttr('events')
      return Object.entries(events).reduce((carry, [eventName, eventFn]) => {
        // input event is handled in cValue
        if (eventName === 'input') return carry
        carry[eventName] = (val, ...otherArguments) => eventFn(val, context, ...otherArguments)
        return carry
      }, {})
    },
    propsAndAttrsToPass() {
      const { evalPropOrAttr } = this
      const propsToPass = {
        // we always wanna pass only this prop:
        required: evalPropOrAttr('required'),
      }
      // only pass rules when it has internal errors
      if (this.usesInternalOrNoErrors) {
        propsToPass.rules = this.rulesCalculated
      }
      // only pass label and hint when it has internal labels
      if (this.usesInternalLabels) {
        propsToPass.label = evalPropOrAttr('label')
        propsToPass.hint = evalPropOrAttr('subLabel') || evalPropOrAttr('hint')
      } else {
        propsToPass.hint = evalPropOrAttr('hint')
      }
      // if readonly is set as prop
      const readonly = evalPropOrAttr('readonly')
      if (isBoolean(readonly) || readonly === 'readonly') {
        propsToPass.readonly = readonly
      } else {
        propsToPass.readonly = evalPropOrAttr('mode') === 'view'
      }
      // if disabled is set as prop
      const disabled = evalPropOrAttr('disabled')
      if (isBoolean(disabled) || disabled === 'disabled') {
        propsToPass.disabled = disabled
        propsToPass.disable = disabled
      } else {
        propsToPass.disabled = evalPropOrAttr('mode') === 'disabled'
        propsToPass.disable = evalPropOrAttr('mode') === 'disabled'
      }
      const attrsToPass = Object.keys(this.$attrs).reduce((carry, attrKey) => {
        carry[attrKey] = evalPropOrAttr(attrKey)
        return carry
      }, {})
      return { ...propsToPass, ...attrsToPass }
    },
    propsAndAttrsToPassForQField() {
      return merge(this.propsAndAttrsToPass, {
        rules: this.rulesCalculated,
        // defaults for UI
        borderless: true,
        stackLabel: true,
        // always disable prefix suffix for QField
        prefix: undefined,
        suffix: undefined,
      })
    },
    labelUsedHere() {
      const { usesInternalLabels, evalPropOrAttr } = this
      return usesInternalLabels ? undefined : evalPropOrAttr('label')
    },
    subLabelHtmlUsedHere() {
      const { usesInternalLabels, evalPropOrAttr } = this
      const subLabel = usesInternalLabels ? undefined : evalPropOrAttr('subLabel')
      if (!isFullString(subLabel)) return null
      return snarkdown(subLabel)
    },
    parsedFieldValue() {
      const { cValue, evalPropOrAttr } = this
      const blueprint = {
        valueType: evalPropOrAttr('valueType'),
        type: evalPropOrAttr('type'),
        dateFormat: evalPropOrAttr('dateFormat'),
        suffix: evalPropOrAttr('suffix'),
        prefix: evalPropOrAttr('prefix'),
        options: evalPropOrAttr('options'),
        multiple: evalPropOrAttr('multiple'),
        slots: evalPropOrAttr('slots'),
        component: evalPropOrAttr('component'),
      }
      return parseFieldValue(cValue, blueprint)
    },
  },
}
</script>
