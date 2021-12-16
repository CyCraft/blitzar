<template>
  <div
    v-if="evalPropOrAttr('showCondition')"
    :class="[
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
      $attrs.class,
    ]"
    :style="[evalPropOrAttr('fieldStyle'), $attrs.style]"
    @click="(e) => $emit('click', e)"
    @dblclick="(e) => $emit('dblclick', e)"
    @mousedown="(e) => $emit('mousedown', e)"
    @mouseup="(e) => $emit('mouseup', e)"
  >
    <div
      v-if="labelUsedHere || (evalPropOrAttr('slots') && evalPropOrAttr('slots').label)"
      :class="['blitz-field__label', evalPropOrAttr('labelClasses')]"
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
    <!-- raw component -->
    <BlitzH
      v-if="evalPropOrAttr('mode') === 'raw'"
      :options="{
        component: 'div',
        slot: parsedFieldValue,
        class: ['blitz-field__component', evalPropOrAttr('componentClasses')],
        style: evalPropOrAttr('componentStyle'),
      }"
    />
    <!-- raw component -->
    <input
      v-else-if="evalPropOrAttr('component') === 'input'"
      v-bind="propsAndAttrsToPass"
      ref="ref-component"
      v-model="cValue"
      v-on="eventsCalculated"
      :class="['blitz-field__component', evalPropOrAttr('componentClasses')]"
      :style="evalPropOrAttr('componentStyle')"
    />
    <select
      v-else-if="evalPropOrAttr('component') === 'select'"
      v-bind="propsAndAttrsToPass"
      ref="ref-component"
      v-model="cValue"
      v-on="eventsCalculated"
      :class="['blitz-field__component', evalPropOrAttr('componentClasses')]"
      :style="evalPropOrAttr('componentStyle')"
    >
      <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
    </select>
    <component
      v-else-if="evalPropOrAttr('component')"
      v-bind="propsAndAttrsToPass"
      ref="ref-component"
      :is="evalPropOrAttr('component')"
      v-model="cValue"
      v-on="eventsCalculated"
      :class="['blitz-field__component', evalPropOrAttr('componentClasses')]"
      :style="evalPropOrAttr('componentStyle')"
    >
      <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
    </component>
    <div v-if="errorCalculated" class="blitz-field__error">{{ errorCalculated }}</div>
  </div>
</template>

<style lang="sass">
// layout
.blitz-field
  max-width: 100%
  display: grid
  align-content: start
  grid-gap: 0.5rem 1rem
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
    .blitz-field__component,
    .blitz-field__error
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
  .blitz-field__error
    color: crimson
</style>

<script>
import { defineComponent, PropType } from 'vue'
import snarkdown from 'snarkdown'
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
import { parseFieldValue, RowSelectionId } from '@blitzar/utils'
import BlitzH from './BlitzH.vue'
import { defaultLang } from './lang'
import { createRequiredErrorFn } from './validation.js'
import './types'

function evaluateProp(propValue, componentValue, componentInstance) {
  return isFunction(propValue) ? propValue(componentValue, componentInstance) : propValue
}

/**
`<BlitzField />` is what is used by BlitzForm under the hood to render the form fields.

Use this API Card to check out all the possible props you can use in a single field of a schema.
 */
export default defineComponent({
  name: 'BlitzField',
  inheritAttrs: false,
  components: { BlitzH },
  props: {
    /**
     * The value of the field. The BlitzForm `formData` is an object with the value of each field and the id for key.
     * @category model
     */
    modelValue: {
      /** @type {PropType<any>} */
      type: undefined,
    },
    /**
     * An `id` is required for the BlitzForm to be able to know which fields have which value.
     *
     * A string with dot notation will become a nested field in the `formData`.
     * @category model
     */
    id: {
      /** @type {PropType<string>} */
      type: String,
    },
    /**
     * A default value to be used when the `modelValue` is `undefined`.
     *
     * You can also pass a function that will receive two params you can work with: `(formData, context)`
     * - `formData` is the `modelValue` object of your BlitzForm. This will be undefined when BlitzField is used as stand-alone (without BlitzForm) unless you manually pass it.
     * - `context` is either your BlitzForm or BlitzField context with many usefull props. See the documentation on Dynamic Props for more info.
     * @category model
     */
    defaultValue: {
      /** @type {PropType<(formData: Record<string, any>, formContext: FormContext) => any | any>} */
      type: undefined,
    },
    /**
     * A function that modifies a value before it is used in the actual component. (see `parseInput` for the reverse)
     * @example val => val && val.split(' ').map(str => !str ? '' : `${str[0].toUpperCase()}${str.slice(1)}`).join(' ')
     * @example val => Number(val)
     * @example val => Date(val)
     * @category model
     */
    parseValue: {
      /** @type {PropType<(val: any, formContext: FormContext) => any>} */
      type: Function,
    },
    /**
     * A function that modifies a value after user input but before the value is emitted. (see `parseValue` for the reverse)
     * @example val => (val || '').toLowerCase()
     * @example val => val.toISOString()
     * @category model
     */
    parseInput: {
      /** @type {PropType<(val: any, formContext: FormContext) => any>} */
      type: Function,
    },
    /**
     * The component to be used for the field. Is mounted via `<component :is="component" />`. You can pass the name of a native HTML5 element or Vue component that is globally registered. You can also import the Vue file and directly pass the imported object, just like you would when you add it to a Vue file's components prop.
     * @example 'input'
     * @example 'MyCustomField'
     * @category content
     */
    component: {
      /** @type {PropType<string | Function | any | DynamicProp<string | Function | any>>} */
      type: [String, Function, Object],
    }, // object for imported vue instances
    /**
     * An Object with keys for the slot names and an object for values. The object you pass to a slot is itself applied as a `<component is="" />`.
     *
     * The last example below shows how this is actually used under the hood.
     * @example { label: { component: 'MyTooltip', tip: 'hi' } } }
     * @example <slot name="label"><component :is="slots.label.component" v-bind="slots.label" /></slot>
     * @category content
     */
    slots: {
      /** @type {PropType<{ label?: string | Record<string, any> | Record<string, any>[], default?: string | Record<string, any> | Record<string, any>[] } | DynamicProp<{ label?: string | Record<string, any> | Record<string, any>[], default?: string | Record<string, any> | Record<string, any>[] }>>} */
      type: [Object, Function],
    },
    /**
     * The text used in the UI for the action buttons and some error messages.
     *
     * The example shows how the error message for required fields is overwritten.
     * @example { requiredField: `Don't forget this field!` }
     * @category content
     */
    lang: {
      /** @type {PropType<Partial<Lang> | DynamicProp<Partial<Lang>>>} */
      type: [Object, Function],
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
    label: {
      /** @type {PropType<string | DynamicProp<string>>} */
      type: [String, Function],
    },
    /**
     * A smaller label for extra info.
     * @example 'first and last'
     * @category content
     */
    subLabel: {
      /** @type {PropType<string | DynamicProp<string>>} */
      type: [String, Function],
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
      /** @type {PropType<Mode | DynamicProp<Mode>>} */
      type: [String, Function],
      default: 'edit',
      /** @type {never} */
      validator: (prop) =>
        ['edit', 'readonly', 'disabled', 'raw'].includes(prop) || typeof prop === 'function',
    },
    /**
     * An Object with an event name as key and the handler function as value. The function you pass will receive the native event payload as first parameter and the BlitzField context (the component instance) as second: `($event, context) => {}`
     * @example { click: (val, { formData }) => console.log(formData) }
     * @category behavior
     */
    events: {
      /** @type {PropType<Record<string, (event: any, formContext: FormContext) => any> | DynamicProp<Record<string, (event: any, formContext: FormContext) => any>>>} */
      type: [Object, Function],
      default: () => ({}),
    },
    /**
     * Whether or not the field is required or not. If a field is marked 'required' it will add a default rule like so: `[val => (val !== null && val !== undefined) || 'Field is required']`. The default message can be set in the `lang` prop as `requiredField`.
     * @category behavior
     */
    required: {
      /** @type {PropType<boolean | 'required' | DynamicProp<boolean | 'required'>>} */
      type: [Boolean, Function],
    },
    /**
     * An array with prop names that should be treated as Dynamic Props when passed a function.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @category behavior
     */
    dynamicProps: {
      /** @type {PropType<string[]>} */
      type: Array,
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
      /** @type {PropType<boolean | undefined | DynamicProp<boolean | undefined>>} */
      type: [Boolean, undefined],
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
      /** @type {PropType<boolean | undefined | DynamicProp<boolean | undefined>>} */
      type: [Boolean, undefined],
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
      /** @type {PropType<ShowErrorsOn | DynamicProp<ShowErrorsOn>>} */
      type: String,
      default: 'interaction',
    },
    /**
     * Setting to `false` will hide the field. When using as an Dynamic Prop it can used to conditionally hide fields based on the other `formData`.
     * @example (val, { mode }) => (mode === 'edit')
     * @example false
     * @category state
     */
    showCondition: {
      /** @type {PropType<boolean | DynamicProp<boolean>>} */
      type: [Boolean, Function],
      default: true,
    },
    /**
     * `readonly` defaults to `true` on `mode: 'readonly'`
     * @category state
     */
    readonly: {
      /** @type {PropType<boolean | 'readonly' | DynamicProp<boolean | 'readonly'>>} */
      type: [Boolean, Function, String, undefined],
      default: undefined,
    },
    /**
     * `disabled` defaults to `true` on `mode: 'disabled'`
     * @category state
     */
    disabled: {
      /** @type {PropType<boolean | 'disabled' | DynamicProp<boolean | 'disabled'>>} */
      type: [Boolean, Function, String, undefined],
      default: undefined,
    },
    /**
     * The position of the label in comparison to the field.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @category style
     */
    labelPosition: {
      /** @type {PropType<'top' | 'left' | DynamicProp<'top' | 'left'>>} */
      type: [String, Function],
      default: 'top',
      /** @type {never} */
      validator: (prop) => ['top', 'left'].includes(prop) || typeof prop === 'function',
    },
    /**
     * Custom styling to be applied to the BlitzField. Applied like so `:style="fieldStyle"`. Can be an Dynamic Prop (this is why I opted to have a different name from `style`).
     *
     * In a BlitzForm schema you can also just write `style: '...'` and BlitzForm will pass that as fieldStyle for you, because "style" is not a valid prop name.
     * @example 'padding: 0.5em; color: white'
     * @category style
     */
    fieldStyle: {
      /** @type {PropType<string | Record<string, boolean> | (string | Record<string, boolean>)[] | DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>>} */
      type: [Object, Array, String, Function],
    },
    /**
     * Custom classes to be applied to the BlitzField. Applied like so `:class="fieldClasses"`. Can be an Dynamic Prop (this is why I opted to have a different name from `class`).
     *
     * In a BlitzForm schema you can also just write `class: '...'` and BlitzForm will pass that as `fieldClasses` for you, because "class" is not a valid prop name.
     * @example ['dark-theme']
     * @category style
     */
    fieldClasses: {
      /** @type {PropType<string | Record<string, boolean> | (string | Record<string, boolean>)[] | DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>>} */
      type: [Object, Array, String, Function],
    },
    /**
     * Custom styling to be applied to the inner component of BlitzField. Applied like so `:style="componentStyle"`. Can be an Dynamic Prop.
     * @example 'padding: 1em;'
     * @category style
     */
    componentStyle: {
      /** @type {PropType<string | Record<string, boolean> | (string | Record<string, boolean>)[] | DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>>} */
      type: [Object, Array, String, Function],
    },
    /**
     * Custom classes to be applied to the inner component of BlitzField. Applied like so `:class="componentClasses"`. Can be an Dynamic Prop.
     * @example ['dark-theme']
     * @category style
     */
    componentClasses: {
      /** @type {PropType<string | Record<string, boolean> | (string | Record<string, boolean>)[] | DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>>} */
      type: [Object, Array, String, Function],
    },
    /**
     * Custom styling to be applied to the label of BlitzField. Applied like so `:style="componentStyle"`. Can be an Dynamic Prop.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @example 'font-weight: 200;'
     * @category style
     */
    labelStyle: {
      /** @type {PropType<string | Record<string, boolean> | (string | Record<string, boolean>)[] | DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>>} */
      type: [Object, Array, String, Function],
    },
    /**
     * Custom classes to be applied to the label of BlitzField. Applied like so `:class="labelClasses"`. Can be an Dynamic Prop.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @example ['text-h6']
     * @category style
     */
    labelClasses: {
      /** @type {PropType<string | Record<string, boolean> | (string | Record<string, boolean>)[] | DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>>} */
      type: [Object, Array, String, Function],
    },
    /**
     * This is the *nested* data of all the fields inside a BlitzForm. (When using BlitzListForm as standalone, this is an array.)
     *
     * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
     * @category readonly
     */
    formData: {
      /** @type {PropType<Record<string, any> | Record<string, any>[]>} */
      type: [Object, Array],
    },
    /**
     * This is the *flattened* data of all the fields inside a BlitzForm.
     *
     * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
     * @category readonly
     */
    formDataFlat: {
      /** @type {PropType<Record<string, any>>} */
      type: Object,
    },
    /**
     * A manually set 'id' of the BlitzForm. This only exists if you passed an id directly to the BlitzForm.
     *
     * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
     * @category readonly
     */
    formId: {
      /** @type {PropType<string>} */
      type: String,
    },
    /**
     * The `mode` of the BlitzForm. A BlitzField inherits the `mode` from the `BlitzForm` via its `mode` prop; however, if you had manually overwritten the mode to be something else, `formMode` can be used to check the current mode of the form. This can be useful inside an Dynamic Prop.
     *
     * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
     * @category readonly
     */
    formMode: {
      /** @type {PropType<Mode>} */
      type: String,
      /** @type {never} */
      validator: (prop) => ['edit', 'readonly', 'disabled', 'raw'].includes(prop),
    },
    /**
     * The `updateField` function of BlitzForm. Is passed so it can be used in events. Eg.: `events: { '@update:modelValue': (value, { updateField } => updateField({ id: 'otherField', value }))}`
     *
     * It's not something you can pass via the schema, but something that BlitzForm will automatically pass to each of its fields so you can use it in Dynamic Props.
     * @category readonly
     */
    updateField: {
      /** @type {PropType<(val: any, formContext: FormContext) => void>} */
      type: Function,
    },
    /**
     * (only present in BlitzListForm!)
     * The `rowInput` function of BlitzForm. Is passed so it can be used in events. Eg.: `events: { '@update:modelValue': (value, { updateField } => updateField({ id: 'otherField', value }))}`
     *
     * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Dynamic Props.
     * @category readonly
     */
    rowInput: {
      /** @type {PropType<(val: any, formContext: FormContext) => void>} */
      type: Function,
    },
    /**
     * (only present in BlitzListForm!)
     * The current row index of this field.
     *
     * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Dynamic Props.
     * @category readonly
     */
    rowIndex: {
      /** @type {PropType<number>} */
      type: Number,
    },
    /**
     * (only present in BlitzListForm!)
     * This is the *nested* data of all the fields of the row.
     *
     * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Dynamic Props.
     * @category readonly
     */
    rowData: {
      /** @type {PropType<Record<string, any>>} */
      type: Object,
    },
    /**
     * (only present in BlitzListForm!)
     * This is a function that you can call to delete the row.
     *
     * It's not something you can pass via the schema, but something that BlitzListForm will automatically pass to each of its fields so you can use it in Dynamic Props.
     * @category readonly
     */
    deleteRow: {
      /** @type {PropType<() => void>} */
      type: Function,
    },
  },
  emits: {
    /**
     * @type {(payload: any, origin?: 'default' | '' | undefined) => boolean}
     */
    'update:modelValue': (payload, origin) => ['default', '', undefined].includes(origin),
    /** HTML5 event from the top level div */
    click: null,
    /** HTML5 event from the top level div */
    dblclick: null,
    /** HTML5 event from the top level div */
    mousedown: null,
    /** HTML5 event from the top level div */
    mouseup: null,
  },
  data() {
    return {
      innerValue: this.modelValue,
      justMounted: false,
      isDirty: false,
      /**
       * Only relevant when `showErrorsOn: 'save'`
       */
      showingErrorBeforeSave: false,
    }
  },
  mounted() {
    const { modelValue, defaultValue, formData } = this
    if (isUndefined(modelValue)) {
      const newDefaultValue = isFunction(defaultValue) ? defaultValue(formData, this) : defaultValue
      this.event('update:modelValue', newDefaultValue, 'default')
    }
    this.justMounted = true
  },
  watch: {
    modelValue(newValue) {
      this.innerValue = newValue
    },
  },
  methods: {
    evalPropOrAttr(propOrAttr) {
      const { dynamicPropsEvaluated } = this
      if (propOrAttr in dynamicPropsEvaluated) return dynamicPropsEvaluated[propOrAttr]
      if (propOrAttr in this) return this[propOrAttr]
      return this.$attrs[propOrAttr]
    },
    /**
     * @param {'update:modelValue'} eventName
     * @param {any} payload
     * @param {'default' | '' | undefined} origin
     */
    event(eventName, payload, origin) {
      if (eventName === 'update:modelValue') {
        /**
         * This event enables the field to be usable with `v-model="value"`
         * @property {any} payload the updated value
         * @property {'default' | '' | undefined} origin the cause of the `update:modelValue` event:
         * - `'default'` means that the event was emitted when the form was mounted and all fields have initialised their default values.
         * - `update:modelValue` events from user input won't have an origin.
         */
        this.$emit('update:modelValue', payload, origin)
      }
    },
    /** @example {null | string} */
    evaluateError() {
      const { evalPropOrAttr, langCalculated, cValue } = this

      const isRequired = evalPropOrAttr('required')
      const requiredErrorFn = createRequiredErrorFn(langCalculated['requiredField'])
      const requiredErrorResult = !isRequired ? null : requiredErrorFn(cValue)

      if (isFullString(requiredErrorResult)) return requiredErrorResult

      return evalPropOrAttr('error') || null
    },
    // validate() IS CALLED FROM REFERENCE!!
    /**
     * Validates a field
     * @param {boolean} [focusIfError] — Wether or not it should focus the field with an error. Defaults to `false`
     * @returns {null | string} the result of the error validation
     */
    validate(focusIfError) {
      const { evaluateError, evalPropOrAttr } = this

      this.showingErrorBeforeSave = true

      const result = evaluateError()
      const shouldFocus = isBoolean(focusIfError)
        ? focusIfError
        : evalPropOrAttr('showErrorsOn') === 'save-focus'

      if (shouldFocus && isFullString(result) && evalPropOrAttr('mode') === 'edit') {
        const component = this.$refs['ref-component']
        if (component) {
          try {
            component.focus()
          } catch (error) {}
        }
      }
      return result
    },
    // resetDirtyAndErrors() IS CALLED FROM REFERENCE!!
    resetDirtyAndErrors() {
      this.isDirty = false
      this.showingErrorBeforeSave = false
    },
  },
  computed: {
    cValue: {
      /** @returns {any} */
      get() {
        const { parseValue, innerValue } = this
        if (isFunction(parseValue)) {
          return parseValue(innerValue, this)
        }
        return innerValue
      },
      set(val, ...otherArguments) {
        this.isDirty = true
        this.showingErrorBeforeSave = false
        const { parseInput, evalPropOrAttr } = this
        const events = evalPropOrAttr('events')
        if (isFunction(parseInput)) val = parseInput(val, this)
        if (isFunction(events['update:modelValue'])) events['update:modelValue'](val, this)
        if (this.id === RowSelectionId) return
        this.event('update:modelValue', val, ...otherArguments)
      },
    },
    /** @returns {any} */
    dynamicPropsEvaluated() {
      const { dynamicProps, cValue } = this
      const context = this
      return dynamicProps.reduce((carry, propKey) => {
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
    /** @returns {any} */
    defaultSlotCalculated() {
      const { evalPropOrAttr } = this
      const slots = evalPropOrAttr('slots')
      if (isPlainObject(slots)) return slots.default
    },
    /** @returns {any} */
    componentName() {
      const { evalPropOrAttr } = this
      const component = evalPropOrAttr('component')
      if (isString(component)) return component
      const { name } = component || {}
      return name
    },
    /** @returns {any} */
    usesInternalLabels() {
      const { evalPropOrAttr, componentName } = this
      const internalLabels = evalPropOrAttr('internalLabels')
      return internalLabels && !isNullOrUndefined(componentName)
    },
    /** @returns {any} */
    langCalculated() {
      const { evalPropOrAttr } = this
      const defaults = defaultLang() || {}
      const lang = evalPropOrAttr('lang') || {}
      return merge(defaults, lang)
    },
    /** @returns {any} */
    /** @example {null | string} */
    errorCalculated() {
      const { evalPropOrAttr, evaluateError, isDirty, showingErrorBeforeSave } = this

      if (evalPropOrAttr('internalErrors') || evalPropOrAttr('showErrorsOn') === 'never') {
        return null
      }
      if (evalPropOrAttr('showErrorsOn') === 'always') {
        return evaluateError()
      }
      if (evalPropOrAttr('showErrorsOn') === 'interaction') {
        if (!isDirty) return null
        return evaluateError()
      }
      if (['save-focus', 'save'].includes(evalPropOrAttr('showErrorsOn'))) {
        if (!showingErrorBeforeSave) return null
        return evaluateError()
      }
      return evaluateError()
    },
    /** @returns {any} */
    eventsCalculated() {
      const { evalPropOrAttr } = this
      const context = this
      const events = evalPropOrAttr('events')
      return Object.entries(events).reduce((carry, [eventName, eventFn]) => {
        // `update:modelValue` event is handled in cValue
        if (eventName === 'update:modelValue') return carry
        carry[eventName] = (val, ...otherArguments) => eventFn(val, context, ...otherArguments)
        return carry
      }, {})
    },
    /** @returns {any} */
    propsAndAttrsToPass() {
      const { evalPropOrAttr } = this
      const propsToPass = {}
      // only pass `error` when it has internal errors
      if (evalPropOrAttr('internalErrors')) {
        propsToPass.error = evalPropOrAttr('error')
      }
      // only pass `label` and `hint` when it has internal labels
      if (this.usesInternalLabels) {
        propsToPass.label = evalPropOrAttr('label')
        propsToPass.hint = evalPropOrAttr('subLabel') || evalPropOrAttr('hint')
      } else {
        propsToPass.hint = evalPropOrAttr('hint')
      }
      // set the component's 'readonly' attr/prop
      const readonly = evalPropOrAttr('readonly')
      if (readonly === true || readonly === 'readonly' || evalPropOrAttr('mode') === 'readonly') {
        propsToPass.readonly = true
      }
      // set the component's 'disabled' attr/prop
      const disabled = evalPropOrAttr('disabled')
      if (disabled === true || disabled === 'disabled' || evalPropOrAttr('mode') === 'disabled') {
        propsToPass.disabled = true
      }
      // set the component's 'required' attr/prop (only when not readonly or disabled)
      const required = evalPropOrAttr('required')
      if (
        (required === true || required === 'required') &&
        !propsToPass.disabled &&
        !propsToPass.readonly
      ) {
        propsToPass.required = true
      }
      const attrsToPass = Object.keys(this.$attrs).reduce((carry, attrKey) => {
        if (attrKey === 'class' || attrKey === 'style') {
          // never pass `class` and `style` attrs, because they're applied on the field
          return carry
        }
        carry[attrKey] = evalPropOrAttr(attrKey)
        return carry
      }, {})
      return { ...propsToPass, ...attrsToPass }
    },
    /** @returns {any} */
    labelUsedHere() {
      const { usesInternalLabels, evalPropOrAttr } = this
      return usesInternalLabels ? undefined : evalPropOrAttr('label')
    },
    /** @returns {any} */
    subLabelHtmlUsedHere() {
      const { usesInternalLabels, evalPropOrAttr } = this
      const subLabel = usesInternalLabels ? undefined : evalPropOrAttr('subLabel')
      if (!isFullString(subLabel)) return null
      return snarkdown(subLabel)
    },
    /** @returns {any} */
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
})
</script>
