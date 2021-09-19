<template>
  <component
    :is="formComponent"
    ref="refBlitzForm"
    :class="[`blitz-form blitz-form--nav-${actionButtonsPosition}`, $attrs.class]"
    :style="$attrs.style"
  >
    <!-- navigation buttons row (save, edit, ...) -->
    <div
      :class="`blitz-form__nav-row blitz-form__nav-row--${actionButtonsPosition}`"
      v-if="isFullString(formErrorMsg) || actionButtonsSchema.length"
    >
      <div class="blitz-form__validation-error text-negative" v-if="isFullString(formErrorMsg)">
        {{ formErrorMsg }}
      </div>
      <BlitzField
        v-for="(blueprint, i) in actionButtonsSchema"
        :key="`${blueprint.id}-${i}`"
        v-bind="blueprint"
      />
    </div>
    <!-- form contents -->
    <!-- @slot The default slot is what contains by default the actual form fields. This slot should not be used, unless you are only interested in the logic of BlitzForm and not of BlitzFields. -->
    <slot v-bind="{ schema: cSchema, formDataFlat }">
      <div
        class="blitz-form__form"
        :style="`grid-template-columns:${' 1fr'.repeat(columnCount)}; grid-gap: ${gridGap}`"
      >
        <BlitzField
          v-for="(field, i) in cSchema"
          :key="`${field.id}-${i}`"
          :ref="`ref-field-${i}`"
          v-bind="{ ...field, span: undefined }"
          :modelValue="formDataFlat[field.id]"
          @update:modelValue="(value, origin) => updateField({ id: field.id, value, origin })"
          :style="
            field.span
              ? `grid-column: ${field.span === true ? '1 / -1' : `span ${field.span}`}`
              : ''
          "
        />
      </div>
    </slot>
  </component>
</template>

<style lang="sass">
@import '../index.sass'

.blitz-form
  &.q-form
    display: flex
  &--nav-top,
  &--nav-bottom
    flex-direction: column
  &--nav-left,
  &--nav-right
    flex-direction: row

.blitz-form__form
  flex: 1
  display: grid
  align-items: stretch
  justify-items: stretch
  > .-title
    grid-column: 1 / -1

.blitz-form__nav-row
  min-height: 42px
  display: grid
  justify-content: end
  align-content: start
  align-items: center
  grid-gap: $md
  &--top
    order: 0
    grid-auto-flow: column
    margin-bottom: $md
  &--bottom
    order: 1
    grid-auto-flow: column
    margin-top: $md
  &--right
    order: 1
    grid-auto-flow: row
    margin-left: $md
  &--left
    order: 0
    grid-auto-flow: row
    margin-right: $md

.blitz-form__validation-error
  color: crimson
</style>

<script>
import { defineComponent } from 'vue'
import { merge } from 'merge-anything'
import { copy } from 'copy-anything'
import { isArray, isFunction, isFullString, isPlainObject, isString, isBoolean } from 'is-what'
import { nestifyObject } from 'nestify-anything'
import { flattenPerSchema } from '@blitzar/utils'
import BlitzField from './BlitzField.vue'
import { defaultLang } from '../meta/lang'

/**
Here you can find all the information on the available props & events of BlitzForm.

If any of the documentation is unclear, feel free to [open an issue](https://github.com/cycraft/blitzar/issues) to ask for clarification!
 */
export default defineComponent({
  name: 'BlitzForm',
  components: { BlitzField },
  inheritAttrs: false,
  props: {
    /**
     * An object with the data of the entire form. The object keys are the ids of the fields passed in the `schema`.
     *
     * To be used with `:modelValue` or `v-model`.
     * @type {Record<string, any>}
     * @example { name: '' }
     * @category model
     */
    modelValue: { type: Object, default: () => ({}) },
    /**
     * A manually set `id` of the BlitzForm. This prop is accessible in the `context` (as `formId`) of any Dynamic Prop and event.
     *
     * Read more on Dynamic Props in its dedicated page.
     * @type {string}
     * @category model
     */
    id: { type: String },
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
    schema: { type: Array, required: true },
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
    actionButtons: { type: Array, default: () => [] },
    /**
     * You can overwrite the schema used for the default action buttons for edit, cancel, save, delete & archive.
     * @type {{ edit?: Record<string, any>, cancel?: Record<string, any>, save?: Record<string, any>, delete?: Record<string, any>, archive?: Record<string, any>, }}
     * @example {'save': {push: true}, 'delete': {color: 'secondary'}}
     * @category content
     */
    actionButtonDefaults: { type: Object, default: () => ({}) },
    /**
     * The position of the action buttons.
     * @type {'top' | 'bottom' | 'right' | 'left'}
     * @category content
     */
    actionButtonsPosition: {
      type: String,
      default: 'top',
      validator: (prop) => ['top', 'bottom', 'right', 'left'].includes(prop),
    },
    /**
     * The amount of columns the form should have. Each field can set a specific 'span' to be able to span multiple columns.
     * @type {number}
     * @category style
     */
    columnCount: { type: Number, default: 1 },
    /**
     * The size of the gap between each field in the form.
     * @type {string}
     * @category style
     */
    gridGap: { type: String, default: '1em' },
    /**
     * The text used in the UI for the action buttons and some error messages.
     * @type {{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string } | DynamicProp<{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string }>}
     * @example { cancel: 'キャンセル', edit: '編集', save: '保存' }
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
    // shared props
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
    mode: {
      type: String,
      default: 'edit',
      validator: (prop) => ['edit', 'view', 'disabled', 'raw', 'add'].includes(prop),
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
     * Custom styling to be applied to the label of BlitzField. Applied like so `:style="componentStyle"`. Can be an Dynamic Prop.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
     * @example 'font-weight: 200;'
     * @category style
     */
    labelStyle: { type: [Object, Array, String, Function] },
    /**
     * Custom classes to be applied to the label of BlitzField. Applied like so `:class="labelClasses"`. Can be an Dynamic Prop.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {string | Record<string, boolean> | (string | Record<string, boolean>)[] | DynamicProp<string | Record<string, boolean> | (string | Record<string, boolean>)[]>}
     * @example ['text-h6']
     * @category style
     */
    labelClasses: { type: [Object, Array, String, Function] },
    /**
     * An array with prop names that should be treated as Dynamic Props when passed a function.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {string[]}
     * @category behavior
     */
    dynamicProps: {
      type: Array,
      default: () => [
        'component',
        'showCondition',
        'label',
        'subLabel',
        'required',
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
     * @type {boolean | undefined}
     * @category behavior
     */
    internalLabels: { type: [Boolean, undefined], default: undefined },
    /**
     * Set to true if the component has its own error handling. This makes sure it passes on props like `error` and does nothing with them in the BlitzField.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {boolean | undefined}
     * @category behavior
     */
    internalErrors: { type: [Boolean, undefined], default: undefined },
    /**
     * - 'interaction' — evaluates & shows errors on every interaction or keystroke
     * - 'save' — only evaluates & shows errors when clicking 'save'
     * - 'save-focus' — only evaluates & shows errors when clicking 'save', then focuses the first field with an error
     * - 'never' — never evaluate or show errors
     * - 'always' — always evaluate and show errors, even without user interaction
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {'interaction' | 'save' | 'save-focus' | 'never' | 'always'}
     * @category behavior
     */
    showErrorsOn: { type: String, default: 'interaction' },
    /**
     * The component that should be used to generate the form. Defaults to a div. You can pass the name of a native HTML5 element or Vue component that is globally registered. You can also import the Vue file and directly pass the imported object, just like you would when you add it to a Vue file's components prop.
     * @type {string | Function}
     * @example 'form'
     * @example 'tr'
     * @example 'MyFormWrapper'
     */
    formComponent: { type: [String, Function], default: 'div' },
  },
  emits: {
    'update:mode': (payload) => ['edit', 'view', 'disabled', 'raw', 'add'].includes(payload),
    /**
     * @param {{ id: string, value: any, origin?: 'default' | 'cancel' | '' }} payload
     */
    'update-field': (payload) => isPlainObject(payload),
    /**
     * @param {'default' | 'cancel' | '' | undefined} origin
     */
    'update:modelValue': (payload, origin) =>
      isPlainObject(payload) && ['default', 'cancel', '', undefined].includes(origin),
    edit: (payload) => !payload, // no payload
    cancel: (payload) => !payload, // no payload
    save: (payload) => isPlainObject(payload),
    delete: (payload) => !payload, // no payload
    archive: (payload) => !payload, // no payload
  },
  data() {
    const { mode, id, modelValue, schema, lang } = this
    // merge user provided lang onto defaults
    const innerLang = merge(defaultLang(), lang)
    const innerMode = mode
    const formId = id
    const dataFlat = flattenPerSchema(modelValue, schema)
    const schemaArray = isArray(schema) ? schema : Object.values(schema)
    const dataFlatDefaults = schemaArray.reduce((carry, { id, defaultValue }) => {
      if (!isFullString(id)) return carry
      carry[id] = isFunction(defaultValue) ? defaultValue(modelValue, this) : defaultValue
      return carry
    }, {})
    const formDataFlat = merge(dataFlatDefaults, copy(dataFlat))
    return {
      innerLang,
      innerMode,
      formId,
      edited: false,
      editedFields: [],
      formDataFlat,
      formDataFlatBackups: [copy(formDataFlat)],
      formErrorMsg: '',
    }
  },
  watch: {
    mode(newValue) {
      this.innerMode = newValue
    },
    id(newValue) {
      this.formId = newValue
    },
    lang(newValue) {
      this.innerLang = merge(defaultLang(), newValue)
    },
  },
  computed: {
    formData() {
      return nestifyObject(this.formDataFlat)
    },
    schemaObject() {
      return this.schema.reduce((carry, blueprint) => {
        carry[blueprint.id] = blueprint
        return carry
      }, {})
    },
    cMode: {
      get() {
        return this.innerMode
      },
      set(val) {
        this.innerMode = val
        this.event('update:mode', val)
      },
    },
    schemaOverwritableDefaults() {
      const { innerMode, innerLang } = this
      return {
        // used here & pass
        lang: innerLang,
        mode: innerMode,
        updateField: this.updateField,
        showErrorsOn: this.showErrorsOn,
        // just pass
        labelPosition: this.labelPosition,
        labelStyle: this.labelStyle,
        labelClasses: this.labelClasses,
        dynamicProps: this.dynamicProps,
        internalLabels: this.internalLabels,
        internalErrors: this.internalErrors,
      }
    },
    schemaForcedDefaults() {
      const { formData, formDataFlat, formId, innerMode } = this
      return {
        formData,
        formDataFlat,
        formId,
        formMode: innerMode,
      }
    },
    cSchema() {
      // slot, class, style are 3 prop names we cannot directly pass via `v-bind`.
      // - slot: we pass as `slots: { default: ... }`
      // - class: we pass as `fieldClasses`
      // - style: we pass as `fieldStyle`
      const { schema, schemaOverwritableDefaults, schemaForcedDefaults } = this

      return schema.map((blueprint) => {
        const overwrites = {}
        if (blueprint.slot) {
          overwrites.slots = merge(blueprint.slots || {}, { default: blueprint.slot })
        }
        const fieldClasses = blueprint.fieldClasses || blueprint.class
        if (fieldClasses) overwrites.fieldClasses = fieldClasses

        const fieldStyle = blueprint.fieldStyle || blueprint.style
        if (fieldStyle) overwrites.fieldStyle = fieldStyle

        const blueprintParsed = merge(
          schemaOverwritableDefaults,
          blueprint,
          overwrites,
          schemaForcedDefaults
        )
        return blueprintParsed
      })
    },
    actionButtonsMap() {
      const {
        innerLang,
        tapDelete,
        tapEdit,
        tapArchive,
        tapCancel,
        tapSave,
        actionButtonDefaults,
        innerMode,
      } = this
      const map = {
        delete: {
          component: 'button',
          type: 'button',
          slot: innerLang['delete'],
          color: 'negative',
          events: { click: tapDelete },
        },
        archive: {
          component: 'button',
          type: 'button',
          slot: innerLang['archive'],
          color: 'negative',
          events: { click: tapArchive },
        },
        edit: {
          component: 'button',
          type: 'button',
          showCondition: () => ['view', 'raw'].includes(innerMode),
          slot: innerLang['edit'],
          events: { click: tapEdit },
        },
        cancel: {
          component: 'button',
          type: 'button',
          showCondition: () => ['edit', 'add'].includes(innerMode),
          slot: innerLang['cancel'],
          events: { click: tapCancel },
        },
        save: {
          component: 'button',
          type: 'button',
          showCondition: () => ['edit', 'add'].includes(innerMode),
          slot: innerLang['save'],
          events: { click: tapSave },
        },
      }
      return merge(map, actionButtonDefaults)
    },
    actionButtonsSchema() {
      const { actionButtons, schemaForcedDefaults, actionButtonsMap, formDataFlat, innerLang } =
        this
      const overwritableDefaults = { lang: innerLang, updateField: this.updateField }
      return actionButtons.map((blueprint) => {
        const _bp = isString(blueprint) ? actionButtonsMap[blueprint] : blueprint
        const slotsOverwrite = !_bp.slot
          ? {}
          : { slots: merge(_bp.slots || {}, { default: _bp.slot }) }
        const events = _bp.events || {}
        const eventsOverwrites = !events['update:modelValue']
          ? {}
          : {
              events: {
                'update:modelValue': (value, origin) =>
                  updateField({ id: field.id, value, origin }),
              },
            }
        const overwrites = {
          span: undefined,
          modelValue: formDataFlat[_bp.id],
          ...slotsOverwrite,
          ...eventsOverwrites,
        }
        const blueprintParsed = merge(overwritableDefaults, _bp, overwrites, schemaForcedDefaults)
        return blueprintParsed
      })
    },
    dataBackup() {
      const { formDataFlatBackups } = this
      if (!formDataFlatBackups.length) return {}
      const lastBackup = formDataFlatBackups.slice(-1)[0]
      const dataNested = nestifyObject(lastBackup)
      return dataNested
    },
    dataEdited() {
      const { editedFields, formDataFlat } = this
      const dataFlat = editedFields.reduce((carry, prop) => {
        carry[prop] = formDataFlat[prop]
        return carry
      }, {})
      const dataNested = nestifyObject(dataFlat)
      return dataNested
    },
  },
  methods: {
    isFullString,
    /**
     * @param {'update:mode' | 'update-field' | 'update:modelValue' | 'edit' | 'cancel' | 'save' | 'delete' | 'archive'} eventName
     * @param {any} payload
     * @param {'default' | 'cancel' | '' | undefined} origin
     */
    event(eventName, payload, origin) {
      if (eventName === 'update:mode') {
        /**
         * This event makes it possible to sync the prop 'mode' like so: `v-model:mode="mode"`
         * @property {'edit' | 'view' | 'disabled' | 'raw' | 'add'} payload event payload
         */
        this.$emit('update:mode', payload)
      }
      if (eventName === 'update-field') {
        /**
         * This event triggers every time a field gets updated.
         *
         * The payload is an object with `id` for the field id and `value` as the new value.
         *
         * The `origin` prop of the event payload is what caused update-field event:
         * - `'default'` means that the event was emitted when the form was mounted and all fields have initialised their default values.
         * - `'cancel'` means that the 'cancel' button was clicked and the event data was reset to what it was before it was edited.
         * - update-field events from user input won't have an origin.
         * - A custom origin can be added when you execute `updateField` from inside an evaluatuated prop.
         *
         * @property {{ id: string, value: any, origin?: 'default' | 'cancel' | '' }} payload event payload
         */
        this.$emit('update-field', payload)
      }
      if (eventName === 'update:modelValue') {
        /**
         * This event enables the form to be usable with `v-model="formData"`
         * @property {{ [id in string]: any }} payload event payload
         * @property {'default' | 'cancel' | '' | undefined} origin the cause of the `update:modelValue` event:
         * - `'default'` means that the event was emitted when the form was mounted and all fields have initialised their default values.
         * - `'cancel'` means that the 'cancel' button was clicked and the event data was reset to what it was before it was edited.
         * - `update:modelValue` events from user input won't have an origin.
         */
        this.$emit('update:modelValue', payload, origin)
      }
      if (eventName === 'edit') {
        /**
         * (no payload) The edit-button was tapped and the form was put into "edit" mode
         */
        this.$emit('edit')
      }
      if (eventName === 'cancel') {
        /**
         * (no payload) The cancel-button was tapped and the form was put back into "view" mode & reverted to its original state
         */
        this.$emit('cancel')
      }
      if (eventName === 'save') {
        /**
         * The save-button was tapped and the form was put back into "view" mode & kept the modified content
         * @property {{newData: { [id in string]: any }, oldData: { [id in string]: any }}} payload event payload
         */
        this.$emit('save', payload)
      }
      if (eventName === 'delete') {
        /**
         * (no payload) The delete-button was tapped (you must implement your own logic)
         */
        this.$emit('delete')
      }
      if (eventName === 'archive') {
        /**
         * (no payload) The archive-button was tapped (you must implement your own logic)
         */
        this.$emit('archive')
      }
    },
    updateField({ id, value, origin }) {
      // do not emit anything when the field had no `id` on its schema blueprint
      if (id === undefined) return
      // no idea why I do this:
      this.edited = true
      // keep a list of edited field ids
      if (!this.editedFields.includes(id)) this.editedFields.push(id)
      // set the new value onto the formData (might be an empty object)
      this.formDataFlat[id] = value
      // emit `update-field` with field's id and new data
      this.event('update-field', { id, value, origin })
      // emit `update:modelValue` with entire formData
      this.event('update:modelValue', this.formData, origin) // do not extract `this` from here
      // if the form has a formErrorMsg, validate gain to check to see if it's solved
      if (isFullString(this.formErrorMsg)) {
        this.validate()
      }
    },
    resetState() {
      this.cMode = 'view'
      this.edited = false
      this.editedFields = []
      this.formDataFlatBackups.push(copy(this.formDataFlat))
      this.formErrorMsg = ''
      for (const [i, blueprint] of this.cSchema.entries()) {
        const refField = this.$refs[`ref-field-${i}`]
        if (!refField) continue
        refField.resetDirtyAndErrors()
      }
    },
    restoreBackup() {
      if (!this.formDataFlatBackups.length) return
      const lastBackup = this.formDataFlatBackups.pop()
      this.formDataFlat = lastBackup
    },
    tapCancel() {
      this.restoreBackup()
      this.resetState()
      const origin = 'cancel'
      Object.entries(this.formDataFlat).forEach(([id, value]) => {
        // emit `update-field` with field's id and new data
        this.event('update-field', { id, value, origin })
      })
      // emit `update:modelValue` with entire formData
      this.event('update:modelValue', this.formData, origin) // do not extract `this` from here
      this.event('cancel')
    },
    /**
     * Validate all fields for potential errors
     * @param {boolean} [focusIfError] — Wether or not it should focus the field with an error. Defaults to `false`
     * @returns {null | string} The result of the first field it finds with an error, or `null` if no errors were found.
     */
    validate(focusIfError) {
      const { cSchema, innerLang, showErrorsOn } = this

      if (showErrorsOn === 'never') return null

      const shouldFocus = isBoolean(focusIfError) ? focusIfError : showErrorsOn === 'save-focus'

      for (const [i, blueprint] of cSchema.entries()) {
        const refField = this.$refs[`ref-field-${i}`]
        if (!refField) continue

        const result = refField.validate(shouldFocus)

        if (isFullString(result)) {
          this.formErrorMsg = innerLang['formValidationError']
          return result
        }
      }
      this.formErrorMsg = null
      return null
    },
    tapEdit() {
      this.cMode = 'edit'
      this.event('edit')
    },
    tapSave() {
      const { validate, dataEdited, dataBackup, resetState, formData } = this
      const foundError = validate()
      if (foundError) return

      const newData = copy(dataEdited)
      const oldData = copy(dataBackup)
      this.event('save', { newData, oldData, formData })
      resetState()
    },
    tapDelete() {
      this.event('delete')
    },
    tapArchive() {
      this.event('archive')
    },
  },
})
</script>
