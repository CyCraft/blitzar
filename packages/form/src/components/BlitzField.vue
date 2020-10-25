<template>
  <div
    v-if="getEvaluatedPropOrAttr('showCondition')"
    :class="[
      'blitz-field',
      `blitz-field--${getEvaluatedPropOrAttr('mode')}`,
      `blitz-field--${componentName}`,
      `blitz-field--label-${labelPosition}`,
      {
        'blitz-field--no-label': !labelUsedHere,
        'blitz-field--no-sub-label': !subLabelHtmlUsedHere,
        'blitz-field--no-component': !component,
      },
      ...fieldClassesArrayUsedHere,
    ]"
    :style="fieldStyleUsedHere"
  >
    <div
      v-if="
        labelUsedHere || (getEvaluatedPropOrAttr('slots') && getEvaluatedPropOrAttr('slots').label)
      "
      class="blitz-field__label"
    >
      {{ labelUsedHere }}
      <slot name="label">
        <BlitzH
          v-if="getEvaluatedPropOrAttr('slots') && getEvaluatedPropOrAttr('slots').label"
          :options="getEvaluatedPropOrAttr('slots').label"
        />
      </slot>
    </div>
    <div v-if="subLabelHtmlUsedHere" class="blitz-field__sub-label" v-html="subLabelHtmlUsedHere" />
    <!-- no component -->
    <template v-if="!component"></template>
    <!-- raw component -->
    <BlitzH
      v-else-if="getEvaluatedPropOrAttr('mode') === 'raw'"
      :options="{
        component: 'div',
        slot: parsedFieldValue,
        class: ['blitz-field__component', ...componentClassesArrayUsedHere],
        style: componentStyleUsedHere,
      }"
    />
    <!-- raw component -->
    <input
      v-else-if="hasInternalOrNoErrors && component === 'input'"
      v-model="cValue"
      v-bind="propsAndAttrsToPass"
      v-on="eventsCalculated"
      style="flex: 1"
      :class="['blitz-field__component', ...componentClassesArrayUsedHere]"
      :style="componentStyleUsedHere"
    />
    <select
      v-else-if="hasInternalOrNoErrors && component === 'select'"
      v-model="cValue"
      v-bind="propsAndAttrsToPass"
      v-on="eventsCalculated"
      style="flex: 1"
      :class="['blitz-field__component', ...componentClassesArrayUsedHere]"
      :style="componentStyleUsedHere"
    >
      <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
    </select>
    <component
      v-else-if="hasInternalOrNoErrors"
      :is="component"
      :class="['blitz-field__component', ...componentClassesArrayUsedHere]"
      v-model="cValue"
      v-bind="propsAndAttrsToPass"
      v-on="eventsCalculated"
      :style="componentStyleUsedHere"
    >
      <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
    </component>
    <QField
      v-else
      v-model="cValue"
      v-bind="propsAndAttrsToPassForQField"
      :class="['blitz-field__component', ...componentClassesArrayUsedHere]"
      :style="componentStyleUsedHere"
    >
      <template v-slot:control>
        <input
          v-if="component === 'input'"
          v-model="cValue"
          v-bind="propsAndAttrsToPass"
          v-on="eventsCalculated"
          style="flex: 1"
        />
        <select
          v-else-if="component === 'select'"
          v-model="cValue"
          v-bind="propsAndAttrsToPass"
          v-on="eventsCalculated"
          style="flex: 1"
        >
          <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
        </select>
        <component
          v-else
          :is="component"
          v-model="cValue"
          v-bind="propsAndAttrsToPass"
          v-on="eventsCalculated"
          style="flex: 1"
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
     * @example val => val && val.toUpperCase()
     * @example val => Number(val)
     * @example val => Date(val)
     * @category model
     */
    parseValue: { type: Function },
    /**
     * A function that modifies a value after user input but before the value is emitted. (see `parseValue` for the reverse)
     * @type {(val: any) => any}
     * @example val => String(val)
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
    component: { type: [String, Function] },
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
     * @category content
     */
    label: { type: [String, Function] },
    /**
     * A smaller label for extra info.
     * @type {string | EvaluatedProp<string>}
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
     * @type {boolean | EvaluatedProp<boolean>}
     * @category state
     */
    readonly: { type: [Boolean, Function], default: false },
    /**
     * `disabled` defaults to `true` on `mode: 'disabled'.
     * @type {boolean | EvaluatedProp<boolean>}
     * @category state
     */
    disabled: { type: [Boolean, Function], default: false },
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
     * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | EvaluatedProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
     * @example 'padding: 1em;'
     * @category style
     */
    fieldStyle: { type: [Object, Array, String, Function] },
    /**
     * Custom classes to be applied to the BlitzField. Applied like so `:class="fieldClasses"`. Can be an Evaluated Prop (this is why I opted to have a different name from `class`).
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
    const { value, defaultValue, formData, internalErrors } = this
    if (!isUndefined(value)) return { innerValue: value }
    const innerValue = isFunction(defaultValue) ? defaultValue(formData, this) : defaultValue
    this.$emit('input', innerValue, 'default')
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
    getEvaluatedPropOrAttr(propOrAttr) {
      const { evaluatedPropsDataObject } = this
      if (propOrAttr in evaluatedPropsDataObject) return evaluatedPropsDataObject[propOrAttr]
      if (propOrAttr in this) return this[propOrAttr]
      return this.$attrs[propOrAttr]
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
        const { parseInput, events } = this
        if (isFunction(parseInput)) val = parseInput(val, this)
        if (isFunction(events.input)) events.input(val, this)
        this.$emit('input', val, ...otherArguments)
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
      const { getEvaluatedPropOrAttr } = this
      const slots = getEvaluatedPropOrAttr('slots')
      if (isPlainObject(slots)) return slots.default
    },
    componentName() {
      const { getEvaluatedPropOrAttr } = this
      const component = getEvaluatedPropOrAttr('component')
      if (isString(component)) return component
      const { name } = component || {}
      return name
    },
    hasInternalOrNoErrors() {
      const { getEvaluatedPropOrAttr, componentName, rulesCalculated } = this
      const internalErrors = getEvaluatedPropOrAttr('internalErrors')
      if (internalErrors !== undefined) return internalErrors
      return !rulesCalculated.length
    },
    internalLabelsCalculated() {
      const { component, getEvaluatedPropOrAttr } = this
      const internalLabels = getEvaluatedPropOrAttr('internalLabels')
      return internalLabels && !isNullOrUndefined(component)
    },
    langCalculated() {
      const { getEvaluatedPropOrAttr } = this
      const defaults = defaultLang() || {}
      const lang = getEvaluatedPropOrAttr('lang') || {}
      return merge(defaults, lang)
    },
    rulesCalculated() {
      const { getEvaluatedPropOrAttr, langCalculated } = this
      const required = getEvaluatedPropOrAttr('required')
      const rules = getEvaluatedPropOrAttr('rules')
      if (required) {
        const requiredRule = createRequiredRule(langCalculated['requiredField'])
        return [requiredRule, ...rules]
      }
      return rules
    },
    eventsCalculated() {
      const { getEvaluatedPropOrAttr } = this
      const context = this
      const events = getEvaluatedPropOrAttr('events')
      return Object.entries(events).reduce((carry, [eventName, eventFn]) => {
        // input event is handled in cValue
        if (eventName === 'input') return carry
        carry[eventName] = (val, ...otherArguments) => eventFn(val, context, ...otherArguments)
        return carry
      }, {})
    },
    propsAndAttrsToPass() {
      // props only used here: parseValue, parseInput, label
      const {
        $attrs,
        getEvaluatedPropOrAttr,
        langCalculated,
        rulesCalculated,
        internalLabelsCalculated,
      } = this
      // should we pass on label & subLabel (as hint) or not
      const labelToPass = !internalLabelsCalculated ? undefined : getEvaluatedPropOrAttr('label')
      const hintToPass = !internalLabelsCalculated
        ? getEvaluatedPropOrAttr('hint')
        : getEvaluatedPropOrAttr('subLabel')
      const readonlyToPass =
        getEvaluatedPropOrAttr('mode') === 'view' || getEvaluatedPropOrAttr('readonly')
      const disabledToPass =
        getEvaluatedPropOrAttr('mode') === 'disabled' || getEvaluatedPropOrAttr('disabled')
      const propsToPass = {
        lang: langCalculated,
        rules: rulesCalculated,
        label: labelToPass,
        hint: hintToPass,
        readonly: readonlyToPass,
        disable: disabledToPass,
        disabled: disabledToPass,
      }
      const attrsToPass = Object.keys($attrs).reduce((carry, attrKey) => {
        carry[attrKey] = getEvaluatedPropOrAttr(attrKey)
        return carry
      }, {})
      return { ...propsToPass, ...attrsToPass }
    },
    propsAndAttrsToPassForQField() {
      // disable prefix suffix for QField
      return merge(this.propsAndAttrsToPass, {
        prefix: undefined,
        suffix: undefined,
        borderless: true,
        stackLabel: true,
      })
    },
    labelUsedHere() {
      const { internalLabelsCalculated, getEvaluatedPropOrAttr } = this
      return internalLabelsCalculated ? undefined : getEvaluatedPropOrAttr('label')
    },
    subLabelHtmlUsedHere() {
      const { internalLabelsCalculated, getEvaluatedPropOrAttr } = this
      const subLabel = internalLabelsCalculated ? undefined : getEvaluatedPropOrAttr('subLabel')
      if (!isFullString(subLabel)) return null
      return snarkdown(subLabel)
    },
    fieldStyleUsedHere() {
      return this.getEvaluatedPropOrAttr('fieldStyle')
    },
    componentStyleUsedHere() {
      return this.getEvaluatedPropOrAttr('componentStyle')
    },
    fieldClassesArrayUsedHere() {
      const classes = this.getEvaluatedPropOrAttr('fieldClasses')
      if (isString(classes)) return classes.split(' ')
      if (isPlainObject(classes)) return [classes]
      return classes
    },
    componentClassesArrayUsedHere() {
      const classes = this.getEvaluatedPropOrAttr('componentClasses')
      if (isString(classes)) return classes.split(' ')
      if (isPlainObject(classes)) return [classes]
      return classes
    },
    parsedFieldValue() {
      const { cValue, getEvaluatedPropOrAttr } = this
      const blueprint = {
        valueType: getEvaluatedPropOrAttr('valueType'),
        type: getEvaluatedPropOrAttr('type'),
        dateFormat: getEvaluatedPropOrAttr('dateFormat'),
        suffix: getEvaluatedPropOrAttr('suffix'),
        prefix: getEvaluatedPropOrAttr('prefix'),
        options: getEvaluatedPropOrAttr('options'),
        multiple: getEvaluatedPropOrAttr('multiple'),
        slots: getEvaluatedPropOrAttr('slots'),
        component: getEvaluatedPropOrAttr('component'),
      }
      return parseFieldValue(cValue, blueprint)
    },
  },
}
</script>
