<script lang="ts">
import { defineComponent } from 'vue'
import snarkdown from 'snarkdown'
import { isFunction, isPlainObject, isUndefined, isFullString, isBoolean } from 'is-what'
import { merge } from 'merge-anything'
import { mapObject } from 'map-anything'
import { parseFieldValue } from '@blitzar/utils'
import type { UpdateModelValueOrigin, Lang } from '@blitzar/types'
import { ROW_SELECTION_ID, blitzFieldProps } from '@blitzar/types'
import BlitzH from '../BlitzH/BlitzH.vue'
import { defaultLang } from '../lang'
import { createRequiredErrorFn } from '../validation'

function evaluateProp(propValue: any, componentValue: any, componentInstance: any) {
  return isFunction(propValue) ? propValue(componentValue, componentInstance) : propValue
}

export default defineComponent({
  name: 'BlitzField',
  components: { BlitzH },
  inheritAttrs: false,
  props: blitzFieldProps,
  emits: {
    'update:modelValue': (payload: any, origin?: UpdateModelValueOrigin) =>
      ['default', '', undefined].includes(origin),
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
  computed: {
    cValue: {
      get(): any {
        const { parseValue, innerValue } = this
        if (isFunction(parseValue)) {
          return parseValue(innerValue, this as any)
        }
        return innerValue
      },
      set(val: any, ...otherArguments: any[]) {
        this.isDirty = true
        this.showingErrorBeforeSave = false
        const { parseInput, evalPropOrAttr } = this
        const events = evalPropOrAttr('events')
        if (isFunction(parseInput)) val = parseInput(val, this as any)
        if (isFunction(events['update:modelValue'])) events['update:modelValue'](val, this)
        if (this.id === ROW_SELECTION_ID) return
        this.event('update:modelValue', val, ...otherArguments)
      },
    },
    dynamicPropsEvaluated(): { [key in string]: any } {
      const { dynamicProps, cValue } = this
      return dynamicProps.reduce<{ [key in string]: any }>((carry, propKey) => {
        if (propKey === 'slots' || propKey === 'slot') {
          const slotsValue = 'slots' in this ? this['slots'] : this.$attrs['slots']
          carry['slots'] = isPlainObject(slotsValue)
            ? mapObject(slotsValue, (propValue) => evaluateProp(propValue, cValue, this))
            : evaluateProp(slotsValue, cValue, this)
          return carry
        }
        const propValue = propKey in this ? (this as any)[propKey] : this.$attrs[propKey]
        carry[propKey] = evaluateProp(propValue, cValue, this)
        return carry
      }, {})
    },
    defaultSlotCalculated(): any {
      const { evalPropOrAttr } = this
      const slots = evalPropOrAttr('slots')
      if (isPlainObject(slots)) return slots.default
      return undefined
    },
    usesInternalLabels(): boolean {
      const { evalPropOrAttr } = this
      return Boolean(evalPropOrAttr('internalLabels') && evalPropOrAttr('component'))
    },
    langCalculated(): Lang {
      const { evalPropOrAttr } = this
      const defaults = defaultLang() || {}
      const lang = evalPropOrAttr('lang') || {}
      return merge(defaults, lang)
    },
    errorCalculated(): null | string {
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
    eventsCalculated(): { [key in string]: any } {
      const { evalPropOrAttr } = this
      const events = evalPropOrAttr('events') as { [key in string]: any }
      return Object.entries(events).reduce<{ [key in string]: any }>(
        (carry, [eventName, eventFn]) => {
          // `update:modelValue` event is handled in cValue
          if (eventName === 'update:modelValue') return carry
          carry[eventName] = (val: any, ...otherArguments: any[]) =>
            eventFn(val, this, ...otherArguments)
          return carry
        },
        {}
      )
    },
    propsAndAttrsToPass(): { [key in string]: any } {
      const { evalPropOrAttr } = this
      const propsToPass: { [key in string]: any } = {}
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
      const attrsToPass = Object.keys(this.$attrs).reduce<{ [key in string]: any }>(
        (carry, attrKey) => {
          if (attrKey === 'class' || attrKey === 'style') {
            // never pass `class` and `style` attrs, because they're applied on the field
            return carry
          }
          carry[attrKey] = evalPropOrAttr(attrKey)
          return carry
        },
        {}
      )
      return { ...propsToPass, ...attrsToPass }
    },
    labelUsedHere(): string | undefined {
      const { usesInternalLabels, evalPropOrAttr } = this
      return usesInternalLabels ? undefined : evalPropOrAttr('label')
    },
    subLabelHtmlUsedHere(): string | null {
      const { usesInternalLabels, evalPropOrAttr } = this
      const subLabel = usesInternalLabels ? undefined : evalPropOrAttr('subLabel')
      if (!isFullString(subLabel)) return null
      return snarkdown(subLabel)
    },
    parsedFieldValue(): any {
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
  watch: {
    modelValue(newValue) {
      this.innerValue = newValue
    },
  },
  mounted() {
    const { modelValue, defaultValue, formData = {} } = this
    if (isUndefined(modelValue)) {
      const newDefaultValue = isFunction(defaultValue)
        ? defaultValue(formData, this as any)
        : defaultValue
      this.event('update:modelValue', newDefaultValue, 'default')
    }
    this.justMounted = true
  },
  methods: {
    evalPropOrAttr(propOrAttr: any): any {
      const { dynamicPropsEvaluated } = this
      if (propOrAttr in dynamicPropsEvaluated) return dynamicPropsEvaluated[propOrAttr]
      if (propOrAttr in this) return (this as any)[propOrAttr]
      return this.$attrs[propOrAttr]
    },
    event(eventName: 'update:modelValue', payload: any, origin?: UpdateModelValueOrigin) {
      if (eventName === 'update:modelValue') {
        /**
         * This event enables the field to be usable with `v-model="value"`
         * @property {*} payload the updated value
         * @property {UpdateModelValueOrigin} origin the cause of the `update:modelValue` event:
         * - `'default'` means that the event was emitted when the form was mounted and all fields have initialised their default values.
         * - `update:modelValue` events from user input won't have an origin.
         */
        this.$emit('update:modelValue', payload, origin)
      }
    },
    evaluateError(): null | string {
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
     * @param focusIfError — Wether or not it should focus the field with an error. Defaults to `false`
     * @returns the result of the error validation
     */
    validate(focusIfError?: boolean | undefined): null | string {
      const { evaluateError, evalPropOrAttr } = this

      this.showingErrorBeforeSave = true

      const result = evaluateError()
      const shouldFocus = isBoolean(focusIfError)
        ? focusIfError
        : evalPropOrAttr('showErrorsOn') === 'save-focus'

      if (shouldFocus && isFullString(result) && evalPropOrAttr('mode') === 'edit') {
        const component = this.$refs['ref-component'] as any
        if (component) {
          try {
            component.focus()
          } catch (error) {
            /** error */
          }
        }
      }
      return result
    },
    // resetDirtyAndErrors() IS CALLED FROM REFERENCE!!
    /**
     * Resets internal values
     */
    resetDirtyAndErrors(): void {
      this.isDirty = false
      this.showingErrorBeforeSave = false
    },
  },
})
</script>

<template>
  <div
    v-if="evalPropOrAttr('showCondition')"
    :class="[
      'blitz-field',
      `blitz-field--${evalPropOrAttr('mode')}`,
      `blitz-field--label-${labelPosition}`,
      {
        'blitz-field--no-label': !labelUsedHere,
        'blitz-field--no-sub-label': !subLabelHtmlUsedHere,
        'blitz-field--no-component': !evalPropOrAttr('component'),
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
        slot:
          !parsedFieldValue && propsAndAttrsToPass.slot
            ? propsAndAttrsToPass.slot
            : parsedFieldValue,
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
      :class="['blitz-field__component', evalPropOrAttr('componentClasses')]"
      :style="evalPropOrAttr('componentStyle')"
      v-on="eventsCalculated"
    />
    <select
      v-else-if="evalPropOrAttr('component') === 'select'"
      v-bind="propsAndAttrsToPass"
      ref="ref-component"
      v-model="cValue"
      :class="['blitz-field__component', evalPropOrAttr('componentClasses')]"
      :style="evalPropOrAttr('componentStyle')"
      v-on="eventsCalculated"
    >
      <BlitzH v-if="defaultSlotCalculated" :options="defaultSlotCalculated" />
    </select>
    <component
      :is="evalPropOrAttr('component')"
      v-else-if="evalPropOrAttr('component')"
      v-bind="propsAndAttrsToPass"
      ref="ref-component"
      v-model="cValue"
      :class="['blitz-field__component', evalPropOrAttr('componentClasses')]"
      :style="evalPropOrAttr('componentStyle')"
      v-on="eventsCalculated"
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
