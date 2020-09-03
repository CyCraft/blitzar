<template>
  <div
    v-if="getEvaluatedPropOrAttr('showCondition')"
    :class="[
      'blitz-field',
      `blitz-field--${mode}`,
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
    <!-- display: inline -->
    <div
      v-if="labelUsedHere || (getEvaluatedPropOrAttr('slots') && getEvaluatedPropOrAttr('slots').label)"
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
    <BlitzDiv
      v-else-if="mode === 'raw'"
      v-bind="BlitzDivProps"
      :class="['blitz-field__component', ...componentClassesArrayUsedHere]"
      :style="componentStyleUsedHere"
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
    <component
      v-else-if="hasInternalOrNoErrors"
      :is="component"
      :class="['blitz-field__component', ...componentClassesArrayUsedHere]"
      v-model="cValue"
      v-bind="propsAndAttrsToPass"
      v-on="eventsCalculated"
      :style="componentStyleUsedHere"
    >
      <BlitzH
        v-if="getEvaluatedPropOrAttr('slots') && getEvaluatedPropOrAttr('slots').default"
        :options="getEvaluatedPropOrAttr('slots').default"
      />
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
        <component
          v-else
          :is="component"
          v-model="cValue"
          v-bind="propsAndAttrsToPass"
          v-on="eventsCalculated"
          style="flex: 1"
        >
          <BlitzH
            v-if="getEvaluatedPropOrAttr('slots') && getEvaluatedPropOrAttr('slots').default"
            :options="getEvaluatedPropOrAttr('slots').default"
          />
        </component>
      </template>
    </QField>
  </div>
</template>

<style lang="sass">
// $
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
import BlitzH from './BlitzH'
import { defaultLang } from '../meta/lang'
import { createRequiredRule } from '../helpers/validation.js'

function evaluateProp(propValue, componentValue, componentInstance) {
  return isFunction(propValue) ? propValue(componentValue, componentInstance) : propValue
}

export default {
  name: 'BlitzField',
  inheritAttrs: false,
  components: { QField, BlitzH },
  props: {
    // prop categories: behavior content general model state style
    // EF props used here:
    /**
     * @category model
     */
    value: { type: undefined },
    /**
     * Each BlitzField has a label, sublabel and a component rendered via &#60;component :is="component" /&#62;. You can pass (1) the name of a registered component, or (2) a component’s options object.
     * @example 'QInput'
     * @example 'MyCustomField
     * @category general
     */
    component: { type: [String, Object, Function] },
    /**
     * A default value to be used when the 'value' is `undefined`.
     *
     * You can also pass a function that will receive two params you can work with: `(formData, context)`
     * - `formData` is the value object of your BlitzForm. This will be undefined when BlitzField is used as stand-alone (without BlitzForm) unless you manually pass it.
     * - `context` is either your BlitzForm or BlitzField context with many usefull props. See the documentation on "Evaluated Props" for more info.
     * @category model
     */
    default: { type: undefined },
    /**
     * Wether or not the field is required or not. If a field is marked 'required' it will add a default rule like so: `[val => (val !== null && val !== undefined) || 'Field is required']`. The default message can be set in the `lang` prop as `requiredField`.
     * @category behavior
     */
    required: { type: [Boolean, Function] },
    /**
     * @category behavior
     */
    rules: { type: [Array, Function], default: () => [] },
    /**
     * An 'id' is required for a &#60;BlitzForm /&#62; to be able to know which fields have which value. When using &#60;BlitzField /&#62; on its own, it is not required.
     * @category model
     */
    id: { type: String },
    /**
     * A smaller label for extra info.
     * @category content
     */
    subLabel: { type: [String, Function] },
    /**
     * Custom styling to be applied to the BlitzField. Applied like so `:style="fieldStyle"`. Can be an Evaluated Prop (this is why I opted to have a different name from `style`).
     * @example 'padding: 1em;'
     * @category style
     */
    fieldStyle: { type: [Object, Array, String, Function] },
    /**
     * Custom classes to be applied to the BlitzField. Applied like so `:class="fieldClasses"`. Can be an Evaluated Prop (this is why I opted to have a different name from `class`).
     * @example ['dark-theme']
     * @category style
     */
    fieldClasses: { type: [Object, Array, String, Function] },
    /**
     * Custom styling to be applied to the inner component of BlitzField. Applied like so `:style="componentStyle"`. Can be an Evaluated Prop.
     * @example 'padding: 1em;'
     * @category style
     */
    componentStyle: { type: [Object, Array, String, Function] },
    /**
     * Custom classes to be applied to the inner component of BlitzField. Applied like so `:class="componentClasses"`. Can be an Evaluated Prop.
     * @example ['dark-theme']
     * @category style
     */
    componentClasses: { type: [Object, Array, String, Function] },
    /**
     * This function can modify a value before it is passed on to the inner component. Also see `parseInput` for the reverse.
     * @example val => Number(val)
     * @example val => Date(val)
     * @category model
     */
    parseValue: { type: Function },
    /**
     * This function can modify a value upon user input, every time before the value is emitted. Also see `parseValue` for the reverse.
     * @example val => String(val)
     * @example val => val.toISOString()
     * @category model
     */
    parseInput: { type: Function },
    /**
     * An Object with an event name as key and the handler function as value. The function you pass will receive the native event payload as first parameter and the BlitzField context (the component instance) as second: `($event, context) => {}`
     * @example {click: (val, {$router}) => $router.push('/')}
     * @example {focus: console.log}
     * @category behavior
     */
    events: { type: Object, default: () => ({}) },
    /**
     * An Object with keys for the slot names and an object for values. The object you pass to a slot is itself applied as a `<component is="" />. See the last example below for how it will be applied:
     * @type {{ label?: string | Record<string, any> | Record<string, any>[], default?: string | Record<string, any> | Record<string, any>[] }}
     * @example { schema: [ { component: 'MyTooltip', tip: 'hi' } ] }
     * @example <slot name="label"><component :is="slots.label.component" v-bind="slots.label" /></slot>
     * @category content
     */
    slots: { type: [Object, Function] },
    /**
     * The text used in the UI, eg. for required fields, etc.
     * @example {requiredField: 'Don\'t forget this field!'}
     * @category content
     */
    lang: {
      type: Object,
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
    // shared props:
    /**
     * The mode represents how fields are rendered
     * - "edit" or "add" means they can be interacted with
     * - "view" means they can't
     * - "raw" means the fields are not generated, just the raw value inside a div
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {'edit' | 'add' | 'view' | 'raw'}
     * @category state
     */
    mode: {
      type: String,
      default: 'edit',
      validator: (prop) => ['edit', 'add', 'view', 'raw'].includes(prop),
    },
    /**
     * The position of the label in comparison to the field.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {'top' | 'left'}
     * @category style
     */
    labelPosition: {
      type: [String, Function],
      default: 'top',
      validator: (prop) => ['top', 'left'].includes(prop),
    },
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
     * Set to true if the component has its own labels and you do not want the BlitzField to show a label.
     *
     * When `true` subLabels will be passed as a prop called 'hint'.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @category style
     */
    internalLabels: { type: [Boolean, undefined], required: false, default: undefined },
    /**
     * Set to true if the component has its own error handling. This makes sure it passes on props like `rules` and does nothing with them in the BlitzField.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @category behavior
     * @category content
     */
    internalErrors: { type: [Boolean, undefined], required: false, default: undefined },
    // passed props:
    /**
     * This is the *nested* data of all the fields inside a BlitzForm.
     * @category blitzFormProp
     */
    formData: { type: Object },
    /**
     * This is the *flattened* data of all the fields inside a BlitzForm.
     * @category blitzFormProp
     */
    formDataFlat: { type: Object },
    /**
     * A manually set 'id' of the BlitzForm.
     * @category blitzFormProp
     */
    formId: { type: String },
    /**
     * The `fieldInput` function of BlitzForm. Is passed so it can be used in the input event: `events: {input: (value, {fieldInput} => fieldInput({id: 'otherField', value}))}`
     * @category blitzFormProp
     */
    fieldInput: { type: Function },
    /**
     * Setting to `true` or `false` can show or hide the field. When using as an Evaluated Prop it can be very powerful.
     * @example (val, {mode}) => mode.edit
     * @example false
     * @category behavior
     * @category state
     */
    showCondition: { type: [Function, Boolean], default: true },
    // Quasar props with modified defaults:
    // (category needs to be specified in case sub-field doesn't inherit this prop from Quasar)
    /**
     * `readonly` defaults to `true` on `mode: 'view'
     * @category state
     * @category inheritedProp
     */
    readonly: { inheritedProp: 'modified', type: [Boolean, Function], default: false },
    /**
     * An BlitzField label is always "external" to the field. (It replaces the Quasar label if the underlying Quasar component uses one.)
     * @category content
     * @category inheritedProp
     */
    label: { inheritedProp: 'modified', type: [String, Function] },
  },
  data() {
    const { value, default: df, formData, internalErrors } = this
    if (!isUndefined(value)) return { innerValue: value }
    const innerValue = isFunction(df) ? df(formData, this) : df
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
        const propValue = propKey in context ? context[propKey] : context.$attrs[propKey]
        carry[propKey] = evaluateProp(propValue, cValue, context)
        return carry
      }, {})
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
      const propsToPass = {
        lang: langCalculated,
        rules: rulesCalculated,
        label: labelToPass,
        hint: hintToPass,
        readonly: readonlyToPass,
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
    BlitzDivProps() {
      const { cValue, getEvaluatedPropOrAttr } = this
      return {
        value: cValue,
        valueType: getEvaluatedPropOrAttr('valueType'),
        type: getEvaluatedPropOrAttr('type'),
        dateFormat: getEvaluatedPropOrAttr('dateFormat'),
        suffix: getEvaluatedPropOrAttr('suffix'),
        prefix: getEvaluatedPropOrAttr('prefix'),
        options: getEvaluatedPropOrAttr('options'),
        multiple: getEvaluatedPropOrAttr('multiple'),
      }
    },
  },
}
</script>
