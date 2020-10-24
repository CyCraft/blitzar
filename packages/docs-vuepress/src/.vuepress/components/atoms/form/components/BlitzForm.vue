<template>
  <component
    :is="innerFormComponent"
    ref="refBlitzForm"
    :class="`blitz-form blitz-form--nav-${actionButtonsPosition} _${formComponent}`"
  >
    <template v-if="formComponent === 'QForm'">
      <!-- prevent the default behaviour of HTML5 forms being "submitted" on "enter" inside input fields -->
      <button type="submit" disabled style="display: none" aria-hidden="true"></button>
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
          :key="blueprint.id || i"
          v-bind="blueprint"
          v-on="blueprint.events"
        />
      </div>
    </template>
    <!-- form contents -->
    <slot v-bind="{ schema: cSchema, formDataFlat }">
      <!-- https://github.com/CyCraft/blitzar/issues/38 -->
      <div
        class="blitz-form__form"
        :style="`grid-template-columns:${' 1fr'.repeat(columnCount)}; grid-gap: ${gridGap}`"
      >
        <BlitzField
          v-for="field in cSchema"
          :key="field.id"
          v-bind="{ ...field, span: undefined }"
          :value="formDataFlat[field.id]"
          @input="(value, origin) => fieldInput({ id: field.id, value, origin })"
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
  &._QForm
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
</style>

<script>
import { QForm } from 'quasar'
import { merge } from 'merge-anything'
import { copy } from 'copy-anything'
import { isArray, isFunction, isFullString, isPlainObject, isString } from 'is-what'
import { nestifyObject } from 'nestify-anything'
import { validateFormPerSchema } from '../helpers/validation'
import { flattenPerSchema } from '@blitzar/utils'
import { defaultLang } from '../meta/lang'
import BlitzField from './BlitzField.vue'

export default {
  name: 'BlitzForm',
  components: { BlitzField, QForm },
  inheritAttrs: false,
  props: {
    /**
     * An object with the data of the entire form. The object keys are the ids of the fields passed in the 'schema'.
     *
     * To be used with `:value` or `v-model`.
     * @type {Record<string, any>}
     * @example { name: '' }
     * @category model
     */
    value: { type: Object, default: () => ({}) },
    /**
     * A manually set 'id' of the BlitzForm. This prop is accessible in the `context` (as `formId`) of any "evaluated prop" and event.
     *
     * Read more on Evaluated Props in its dedicated page.
     * @type {string}
     * @category model
     */
    id: { type: String },
    /**
     * This is the heart of your BlitzForm. It's the schema that will defined what fields will be generated.
     * @type {Record<string, any>[]}
     * @example [{id: 'name', label: 'Name', component: 'QInput'}, {id: 'age', label: 'Age', component: 'QInput', type: 'number'}]
     * @category model
     */
    schema: { type: Array, required: true },
    /**
     * Buttons on top of the form that control the 'mode' of the form. The possible pre-made buttons are:
     * - 'edit' a button which puts the form in 'edit' mode & does `emit('edit')`
     * - 'cancel' a button which puts the form in 'view' mode & does `emit('cancel')`
     * - 'save' a button which puts the form in 'edit' mode & does `emit('save', {newData, oldData})`
     * - 'delete' a red button which does `emit('delete')`
     * - 'archive' a red button which does `emit('archive')`
     *
     * You can also pass custom buttons with the same schema to generate forms.
     *
     * See the documentation on "Action Buttons" for more info.
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
     * A function which serves as global validator for your form. It will receive the edited data as first param and the original data (before user edits) as second. It should return true if all is OK or a string with error message.
     * @type {(newData: Record<string, any>, oldData: Record<string, any>) => (true | string)}
     * @example (newData, oldData) => newData.pass1 === newData.pass2 || 'passwords don't match'
     * @category behavior
     */
    validator: { type: Function },
    /**
     * The amount of columns the form should have.
     *
     * Each field can set a specific 'span' to be able to span multiple columns.
     * @type {number}
     * @category style
     */
    columnCount: { type: Number, default: 1 },
    /**
     * The gap between each field in the form.
     * @type {string}
     * @category style
     */
    gridGap: { type: String, default: '1em' },
    /**
     * The text used in the UI for the action buttons and some error messages.
     * @type {{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string } | EvaluatedProp<{ archive?: string, delete?: string, cancel?: string, edit?: string, save?: string, requiredField?: string, formValidationError?: string }>}
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
     * - `'edit'`: (default) Show editable fields based on the schema
     * - `'view'`: Show each field with `readonly: true`.
     * - `'disabled'`: Show each field with `disabled: true`.
     * - `'raw'`: Used to show raw data of your form. No fields are generated, just divs with the labels and values. This mode is powerful because it will automatically map values to the schema provided (eg. adding pre-/suffix; mapping to options of a select; etc.)
     * - `'add'`: The same as 'edit'
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
     * Set to true if the entire form has its own labels and you do not want the BlitzField to show a label.
     *
     * When `true` subLabels will be passed as a prop called 'hint'.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {boolean | undefined}
     * @category behavior
     */
    internalLabels: { type: [Boolean, undefined], required: false, default: undefined },
    /**
     * Set to true if the entire form has its own error handling. This makes sure it passes on props like `rules` and does nothing with them in the BlitzField.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @type {boolean | undefined}
     * @category behavior
     */
    internalErrors: { type: [Boolean, undefined], required: false, default: undefined },
    /**
     * Pass the component names (without `.vue`) that have internal error handling. This makes sure it passes on props like `rules` and does nothing with them in the BlitzField.
     * @type {string[]}
     * @category behavior
     */
    internalErrorsFor: {
      type: Array,
      default: () => ['QInput', 'QSelect', 'QField', 'q-input', 'q-select', 'q-field'],
    },
    /**
     * The component that should be used to generate the form. Defaults to QForm. You can pass the name of a native HTML5 element or Vue component that is globally registered. You can also import the Vue file and directly pass the imported object, just like you would when you add it to a Vue file's components prop.
     * @type {string | Function}
     * @example 'form'
     * @example 'tr'
     * @example 'MyFormWrapper'
     */
    formComponent: { type: [String, Function], default: 'QForm' },
  },
  data() {
    const { mode, id, value, schema, lang } = this
    // merge user provided lang onto defaults
    const innerLang = merge(defaultLang(), lang)
    const innerMode = mode
    const formId = id
    const dataFlat = flattenPerSchema(value, schema)
    const schemaArray = isArray(schema) ? schema : Object.values(schema)
    const dataFlatDefaults = schemaArray.reduce((carry, { id, default: df }) => {
      if (!isFullString(id)) return carry
      carry[id] = isFunction(df) ? df(value, this) : df
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
      innerFormComponent: this.formComponent === 'QForm' ? QForm : this.formComponent,
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
        fieldInput: this.fieldInput,
        // just pass
        labelPosition: this.labelPosition,
        evaluatedProps: this.evaluatedProps,
        internalLabels: this.internalLabels,
        internalErrors: this.internalErrors,
      }
    },
    schemaForcedDefaults() {
      const { formData, formDataFlat, formId } = this
      return {
        formData,
        formDataFlat,
        formId,
      }
    },
    cSchema() {
      const { schema, schemaOverwritableDefaults, schemaForcedDefaults, internalErrorsFor } = this
      return schema.map((blueprint) => {
        const internalErrorDefaults = internalErrorsFor.includes(blueprint.component)
          ? { internalErrors: true }
          : {}
        const slotsOverwrite = !blueprint.slot
          ? {}
          : { slots: merge(blueprint.slots || {}, { default: blueprint.slot }) }
        const blueprintParsed = merge(
          schemaOverwritableDefaults,
          internalErrorDefaults,
          blueprint,
          slotsOverwrite,
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
          showCondition: (_, { mode }) => ['view', 'raw'].includes(mode),
          slot: innerLang['edit'],
          events: { click: tapEdit },
        },
        cancel: {
          component: 'button',
          type: 'button',
          showCondition: (_, { mode }) => ['edit', 'add'].includes(mode),
          slot: innerLang['cancel'],
          events: { click: tapCancel },
        },
        save: {
          component: 'button',
          type: 'button',
          showCondition: (_, { mode }) => ['edit', 'add'].includes(mode),
          slot: innerLang['save'],
          events: { click: tapSave },
        },
      }
      return merge(map, actionButtonDefaults)
    },
    actionButtonsSchema() {
      const {
        actionButtons,
        schemaOverwritableDefaults,
        schemaForcedDefaults,
        actionButtonsMap,
        formDataFlat,
      } = this
      return actionButtons.map((blueprint) => {
        const _bp = isString(blueprint) ? actionButtonsMap[blueprint] : blueprint
        const slotsOverwrite = !_bp.slot
          ? {}
          : { slots: merge(_bp.slots || {}, { default: _bp.slot }) }
        const events = _bp.events || {}
        const eventsOverwrites = !events.input
          ? {}
          : {
              events: { input: (value, origin) => fieldInput({ id: field.id, value, origin }) },
            }
        const overwrites = {
          span: undefined,
          value: formDataFlat[_bp.id],
          ...slotsOverwrite,
          ...eventsOverwrites,
        }
        const blueprintParsed = merge(
          schemaOverwritableDefaults,
          _bp,
          overwrites,
          schemaForcedDefaults
        )
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
     * @param {'update:mode' | 'field-input' | 'input' | 'edit' | 'cancel' | 'save' | 'delete' | 'archive'} eventName
     * @param {any} payload
     * @param {'default' | 'cancel' | '' | undefined} origin
     */
    event(eventName, payload, origin) {
      if (eventName === 'update:mode') {
        /**
         * This event makes it possible to sync the prop 'mode' like so: `:mode.sync="mode"`
         * @property {'edit' | 'view' | 'disabled' | 'raw' | 'add'} payload event payload
         */
        this.$emit('update:mode', payload)
      }
      if (eventName === 'field-input') {
        /**
         * This event triggers every time a field gets updated.
         *
         * The payload is an object with `id` for the field id and `value` as the new value.
         *
         * The `origin` prop of the event payload is what caused field-input event:
         * - `'default'` means that the event was emitted when the form was mounted and all fields have initialised their default values.
         * - `'cancel'` means that the 'cancel' button was clicked and the event data was reset to what it was before it was edited.
         * - field-input events from user input won't have an origin.
         * - A custom origin can be added when you execute `fieldInput` from inside an evaluatuated prop.
         *
         * @property {{ id: string, value: any, origin?: 'default' | 'cancel' | '' }} payload event payload
         */
        this.$emit('field-input', payload)
      }
      if (eventName === 'input') {
        /**
         * This event enables the form to be usable with `v-model="formData"`
         * @property {{ [id in string]: any }} payload event payload
         * @property {'default' | 'cancel' | '' | undefined} origin the cause of the input event:
         * - `'default'` means that the event was emitted when the form was mounted and all fields have initialised their default values.
         * - `'cancel'` means that the 'cancel' button was clicked and the event data was reset to what it was before it was edited.
         * - input events from user input won't have an origin.
         */
        this.$emit('input', payload, origin)
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
    fieldInput({ id, value, origin }) {
      // no idea why I do this:
      this.edited = true
      // keep a list of edited field ids
      if (!this.editedFields.includes(id)) this.editedFields.push(id)
      // set the new value onto the formData (might be an empty object)
      this.$set(this.formDataFlat, id, value)
      // emit field-input with field's id and new data
      this.event('field-input', { id, value, origin })
      // emit input with entire formData
      this.event('input', this.formData, origin) // do not extract `this` from here
      // if the form has a formErrorMsg, validate gain to check to see if it's solved
      if (isFullString(this.formErrorMsg)) {
        const res = validateFormPerSchema(this.formData, this.schema, this.innerLang)
        const errorsRemain = Object.values(res).some((val) => val !== true)
        if (!errorsRemain) this.formErrorMsg = null
      }
    },
    resetState() {
      this.cMode = 'view'
      this.edited = false
      this.editedFields = []
      this.formDataFlatBackups.push(copy(this.formDataFlat))
      this.formErrorMsg = ''
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
        // emit field-input with field's id and new data
        this.event('field-input', { id, value, origin })
      })
      // emit input with entire formData
      this.event('input', this.formData, origin) // do not extract `this` from here
      this.event('cancel')
    },
    validate() {
      // validate will focus the field with error, so only use it when the user is not typing something else
      const { $refs, innerLang, validator, dataEdited, dataBackup, schema, formDataFlat } = this
      return new Promise((resolve, reject) => {
        if (isFunction(validator)) {
          const validatorRes = validator(dataEdited, dataBackup)
          if (isFullString(validatorRes)) reject(validatorRes)
        }
        $refs.refBlitzForm
          .validate()
          .then((success) => {
            if (success) return resolve()
            reject(innerLang['formValidationError'])
          })
          .catch((e) => reject(innerLang['formValidationError']))
      })
    },
    tapEdit() {
      this.cMode = 'edit'
      this.event('edit')
    },
    tapSave() {
      const { validate, dataEdited, dataBackup, resetState } = this
      validate()
        .then(() => {
          const newData = copy(dataEdited)
          const oldData = copy(dataBackup)
          this.event('save', { newData, oldData })
          resetState()
        })
        .catch((formErrorMsg) => {
          this.formErrorMsg = formErrorMsg
        })
    },
    tapDelete() {
      this.event('delete')
    },
    tapArchive() {
      this.event('archive')
    },
  },
}
</script>
