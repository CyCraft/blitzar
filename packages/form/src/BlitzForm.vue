<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { merge } from 'merge-anything'
import { copy } from 'copy-anything'
import { isFunction, isFullString, isPlainObject, isString, isBoolean, isFullArray } from 'is-what'
import { nestifyObject } from 'nestify-anything'
import { flattenPerSchema } from '@blitzar/utils'
import type { Lang, Mode, Schema, ShowErrorsOn, UpdateModelValueOrigin } from '@blitzar/types'
import BlitzField from './BlitzField.vue'
import { defaultLang } from './lang'
import { getBlitzFieldOverwrites } from './helpers'

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
     * @example { name: '' }
     * @category model
     */
    modelValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    /**
     * A manually set `id` of the BlitzForm. This prop is accessible in the `context` (as `formId`) of any Dynamic Prop and event.
     *
     * Read more on Dynamic Props in its dedicated page.
     * @category model
     */
    id: { type: String, default: undefined },
    /**
     * This is the heart of your BlitzForm. It's the schema that defines what fields will be generated.
     *
     * The possible props you can pass are:
     * - BlitzField props (see BlitzField API Card in the documentation)
     * - any props of the actual component you define
     * @example
     * ```js
     * [{id: 'name', label: 'Name', component: 'input', style: 'color: white'}, {id: 'age', label: 'Age', component: 'input', type: 'number', style: 'color: white'}]
     * ```
     * @category model
     */
    schema: {
      type: Array as PropType<Record<string, any>[]>,
      required: true,
    },
    /**
     * Buttons on top of the form that control the `mode` of the form. The possible pre-made buttons are:
     * - `'edit'` — a button which puts the form in 'edit' mode & does `emit('edit')`
     * - `'cancel'` — a button which puts the form in 'readonly' mode & does `emit('cancel')`
     * - `'save'` — a button which puts the form in 'edit' mode & does `emit('save', {newData, oldData})`
     * - `'delete'` — a red button which does `emit('delete')`
     * - `'archive'` — a red button which does `emit('archive')`
     *
     * You can also pass custom buttons with the same schema to generate forms.
     *
     * See the documentation on Action Buttons for more info.
     * @example
     * ```js
     * ['delete', 'cancel', 'edit', 'save']
     * ```
     * @example
     * ```js
     * [{component: 'button', type: 'button', slot: 'log', events: {click: console.log}}]
     * ```
     * @category content
     */
    actionButtons: {
      type: Array as PropType<
        ('edit' | 'cancel' | 'save' | 'delete' | 'archive' | Record<string, any>)[]
      >,
      default: () => [],
    },
    /**
     * You can overwrite the schema used for the default action buttons for edit, cancel, save, delete & archive.
     * @example
     * ```js
     * {'save': {push: true}, 'delete': {color: 'secondary'}}
     * ```
     * @category content
     */
    actionButtonDefaults: {
      type: Object as PropType<{
        edit?: Record<string, any>
        cancel?: Record<string, any>
        save?: Record<string, any>
        delete?: Record<string, any>
        archive?: Record<string, any>
      }>,
      default: () => ({}),
    },
    /**
     * The position of the action buttons.
     * @category content
     */
    actionButtonsPosition: {
      type: String as PropType<'top' | 'bottom' | 'right' | 'left'>,
      default: 'top',
      validator: (prop: 'top' | 'bottom' | 'right' | 'left') =>
        ['top', 'bottom', 'right', 'left'].includes(prop),
    },
    /**
     * The amount of columns the form should have. Each field can set a specific 'span' to be able to span multiple columns.
     * @category style
     */
    columnCount: {
      type: Number,
      default: 1,
    },
    /**
     * The size of the gap between each field in the form.
     * @category style
     */
    gridGap: {
      type: String,
      default: '1em',
    },
    /**
     * The text used in the UI for the action buttons and some error messages.
     * @example
     * ```js
     * { cancel: 'キャンセル', edit: '編集', save: '保存' }
     * ```
     * @category content
     */
    lang: {
      type: Object as PropType<Partial<Lang>>,
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
      type: String as PropType<Mode>,
      default: 'edit',
      validator: (prop: Mode) => ['edit', 'readonly', 'disabled', 'raw'].includes(prop),
    },
    /**
     * The position of the label in comparison to the field.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @category style
     */
    labelPosition: {
      type: [String, Function] as PropType<'top' | 'left'>,
      default: 'top',
      validator: (prop: 'top' | 'left') => ['top', 'left'].includes(prop),
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
        string | Record<string, boolean> | (string | Record<string, boolean>)[]
      >,
      default: null,
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
        string | Record<string, boolean> | (string | Record<string, boolean>)[]
      >,
      default: null,
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
     * @category behavior
     */
    internalLabels: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    /**
     * Set to true if the component has its own error handling. This makes sure it passes on props like `error` and does nothing with them in the BlitzField.
     *
     * This prop can be set on a BlitzField or on a BlitzForm (in which case it's applied to all fields).
     * @category behavior
     */
    internalErrors: {
      type: Boolean as PropType<boolean | undefined>,
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
      type: String as PropType<ShowErrorsOn>,
      default: 'interaction',
      validator: (prop: ShowErrorsOn) =>
        ['interaction', 'save', 'save-focus', 'never', 'always'].includes(prop),
    },
    /**
     * The component that should be used to generate the form. Defaults to a div. You can pass the name of a native HTML5 element or Vue component that is globally registered. You can also import the Vue file and directly pass the imported object, just like you would when you add it to a Vue file's components prop.
     * @example 'form'
     * @example 'tr'
     * @example 'MyFormWrapper'
     */
    formComponent: {
      type: [String, Function] as PropType<string | any>,
      default: 'div',
    },
  },
  emits: {
    'update:mode': (payload: Mode) => ['edit', 'readonly', 'disabled', 'raw'].includes(payload),
    updateField: (payload: { id: string; value: any; origin?: UpdateModelValueOrigin }) =>
      isPlainObject(payload),
    'update:modelValue': (payload: Record<string, any>, origin?: UpdateModelValueOrigin) =>
      isPlainObject(payload) && ['default', 'cancel', '', undefined].includes(origin),
    edit: () => true, // no payload
    cancel: () => true, // no payload
    save: (payload: {
      newData: Record<string, any>
      oldData: Record<string, any>
      formData: Record<string, any>
    }) => isPlainObject(payload),
    delete: () => true, // no payload
    archive: () => true, // no payload
    /** HTML5 event from the top level component */
    click: null,
    /** HTML5 event from the top level component */
    dblclick: null,
    /** HTML5 event from the top level component */
    mousedown: null,
    /** HTML5 event from the top level component */
    mouseup: null,
  },
  data() {
    const { mode, id, modelValue, schema, lang } = this
    // merge user provided lang onto defaults
    const innerLang: Lang = merge(defaultLang(), lang)
    const innerMode = mode
    const formId = id
    const dataFlat = flattenPerSchema(modelValue, schema)
    const dataFlatDefaults: Record<string, any> = schema.reduce<Record<string, any>>(
      (carry, { id, defaultValue }) => {
        if (!isFullString(id)) return carry
        carry[id] = isFunction(defaultValue) ? defaultValue(modelValue, this) : defaultValue
        return carry
      },
      {}
    )
    const formDataFlat: Record<string, any> = merge(dataFlatDefaults, copy(dataFlat))
    return {
      innerLang,
      innerMode,
      formId,
      edited: false,
      editedFields: [] as string[],
      formDataFlat,
      formDataFlatBackups: [copy(formDataFlat)],
      formErrorMsg: null as null | string,
    }
  },
  computed: {
    formData(): Record<string, any> {
      return nestifyObject(this.formDataFlat)
    },
    cMode: {
      get(): Mode {
        return this.innerMode
      },
      set(val: Mode) {
        this.innerMode = val
        this.event('update:mode', val)
      },
    },
    schemaOverwritableDefaults(): Record<string, any> {
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
    schemaForcedDefaults(): Record<string, any> {
      const { formData, formDataFlat, formId, innerMode } = this
      return {
        formData,
        formDataFlat,
        formId,
        formMode: innerMode,
      }
    },
    cSchema(): Schema {
      // slot, class, style are 3 prop names we cannot directly pass via `v-bind`.
      // - slot: we pass as `slots: { default: ... }`
      // - class: we pass as `fieldClasses`
      // - style: we pass as `fieldStyle`
      const { schema, schemaOverwritableDefaults, schemaForcedDefaults } = this

      return schema.map((field) =>
        merge(
          schemaOverwritableDefaults,
          field,
          getBlitzFieldOverwrites(field),
          schemaForcedDefaults
        )
      )
    },
    actionButtonsMap(): {
      edit: Record<string, any> | undefined
      cancel: Record<string, any> | undefined
      save: Record<string, any> | undefined
      delete: Record<string, any> | undefined
      archive: Record<string, any> | undefined
    } {
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
          showCondition: () => ['readonly', 'raw'].includes(innerMode),
          slot: innerLang['edit'],
          events: { click: tapEdit },
        },
        cancel: {
          component: 'button',
          type: 'button',
          showCondition: () => innerMode === 'edit',
          slot: innerLang['cancel'],
          events: { click: tapCancel },
        },
        save: {
          component: 'button',
          type: 'button',
          showCondition: () => innerMode === 'edit',
          slot: innerLang['save'],
          events: { click: tapSave },
        },
      }
      return merge(map, actionButtonDefaults)
    },
    actionButtonsSchema(): Record<string, any>[] {
      const {
        actionButtons,
        schemaForcedDefaults,
        actionButtonsMap,
        formDataFlat,
        innerLang,
        updateField,
      } = this
      const overwritableDefaults = { lang: innerLang, updateField }
      return actionButtons.map((blueprint) => {
        const _bp = isString(blueprint) ? actionButtonsMap[blueprint] || {} : blueprint
        const slotsOverwrite = !_bp.slot
          ? {}
          : { slots: merge(_bp.slots || {}, { default: _bp.slot }) }
        const overwrites = {
          span: undefined,
          modelValue: formDataFlat[_bp.id],
          ...slotsOverwrite,
        }
        const blueprintParsed = merge(overwritableDefaults, _bp, overwrites, schemaForcedDefaults)
        return blueprintParsed
      })
    },
    dataBackup(): Record<string, any> {
      const { formDataFlatBackups } = this
      if (!formDataFlatBackups.length) return {}
      const lastBackup = formDataFlatBackups.slice(-1)[0]
      const dataNested = nestifyObject(lastBackup)
      return dataNested
    },
    dataEdited(): Record<string, any> {
      const { editedFields, formDataFlat } = this
      const dataFlat = editedFields.reduce<Record<string, any>>((carry, prop) => {
        carry[prop] = formDataFlat[prop]
        return carry
      }, {})
      const dataNested = nestifyObject(dataFlat)
      return dataNested
    },
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
  methods: {
    isFullString,
    event(
      eventName:
        | 'update:mode'
        | 'updateField'
        | 'update:modelValue'
        | 'edit'
        | 'cancel'
        | 'save'
        | 'delete'
        | 'archive',
      payload?: any,
      origin?: UpdateModelValueOrigin
    ): void {
      if (eventName === 'update:mode') {
        /**
         * This event makes it possible to sync the prop 'mode' like so: `v-model:mode="mode"`
         * @property {Mode} payload event payload
         */
        this.$emit('update:mode', payload)
      }
      if (eventName === 'updateField') {
        /**
         * This event triggers every time a field gets updated.
         *
         * The payload is an object with `id` for the field id and `value` as the new value.
         *
         * The `origin` prop of the event payload is what caused updateField event:
         * - `'default'` means that the event was emitted when the form was mounted and all fields have initialised their default values.
         * - `'cancel'` means that the 'cancel' button was clicked and the event data was reset to what it was before it was edited.
         * - updateField events from user input won't have an origin.
         * - A custom origin can be added when you execute `updateField` from inside an evaluatuated prop.
         *
         * @property {{ id: string, value: any, origin?: UpdateModelValueOrigin }} payload event payload
         */
        this.$emit('updateField', payload)
      }
      if (eventName === 'update:modelValue') {
        /**
         * This event enables the form to be usable with `v-model="formData"`
         * @property {{ [id in string]: any }} payload event payload
         * @property {UpdateModelValueOrigin} origin the cause of the `update:modelValue` event:
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
         * (no payload) The cancel-button was tapped and the form was put back into "readonly" mode & reverted to its original state
         */
        this.$emit('cancel')
      }
      if (eventName === 'save') {
        /**
         * The save-button was tapped and the form was put back into "readonly" mode & kept the modified content
         * @property {{ newData: Record<string, any>, oldData: Record<string, any>, formData: Record<string, any> }} payload event payload
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
    updateField({
      id,
      value,
      origin,
    }: {
      id: string
      value: any
      origin?: UpdateModelValueOrigin
    }): void {
      // do not emit anything when the field had no `id` on its schema blueprint
      if (id === undefined) return
      // no idea why I do this:
      this.edited = true
      // keep a list of edited field ids
      if (!this.editedFields.includes(id)) this.editedFields.push(id)
      // set the new value onto the formData (might be an empty object)
      this.formDataFlat[id] = value
      // emit `updateField` with field's id and new data
      this.event('updateField', { id, value, origin })
      // emit `update:modelValue` with entire formData
      this.event('update:modelValue', this.formData, origin) // do not extract `this` from here
      // if the form has a formErrorMsg, validate gain to check to see if it's solved
      if (isFullString(this.formErrorMsg)) {
        this.validate()
      }
    },
    resetState(): void {
      this.cMode = 'readonly'
      this.edited = false
      this.editedFields = []
      this.formDataFlatBackups.push(copy(this.formDataFlat))
      this.formErrorMsg = ''
      for (const [i, blueprint] of this.cSchema.entries()) {
        const refField = this.$refs[`ref-field-${i}`]
        // not sure why but one case during doc creation this turned out to be an array
        const _refField = isFullArray(refField) ? refField[0] : refField
        if (_refField) _refField.resetDirtyAndErrors()
      }
    },
    restoreBackup(): void {
      if (!this.formDataFlatBackups.length) return
      const lastBackup = this.formDataFlatBackups.pop() || {}
      this.formDataFlat = lastBackup
    },
    tapCancel(): void {
      this.restoreBackup()
      this.resetState()
      const origin = 'cancel'
      Object.entries(this.formDataFlat).forEach(([id, value]) => {
        // emit `updateField` with field's id and new data
        this.event('updateField', { id, value, origin })
      })
      // emit `update:modelValue` with entire formData
      this.event('update:modelValue', this.formData, origin) // do not extract `this` from here
      this.event('cancel')
    },
    /**
     * Validate all fields for potential errors
     * @param focusIfError Wether or not it should focus the field with an error. Defaults to `false`
     * @returns The result of the first field it finds with an error, or `null` if no errors were found.
     */
    validate(focusIfError: undefined | boolean = undefined): null | string {
      const { cSchema, innerLang, showErrorsOn } = this

      if (showErrorsOn === 'never') return null

      const shouldFocus = isBoolean(focusIfError) ? focusIfError : showErrorsOn === 'save-focus'

      for (const [i, blueprint] of cSchema.entries()) {
        const refField = this.$refs[`ref-field-${i}`]
        // not sure why but one case during doc creation this turned out to be an array
        const _refField = isFullArray(refField) ? refField[0] : refField
        if (!_refField) continue

        const result = _refField.validate(shouldFocus)

        if (isFullString(result)) {
          this.formErrorMsg = innerLang['formValidationError']
          return result
        }
      }
      this.formErrorMsg = null
      return null
    },
    tapEdit(): void {
      this.cMode = 'edit'
      this.event('edit')
    },
    tapSave(): void {
      const { validate, dataEdited, dataBackup, resetState, formData } = this
      const foundError = validate()
      if (foundError) return

      const newData = copy(dataEdited)
      const oldData = copy(dataBackup)
      this.event('save', { newData, oldData, formData })
      resetState()
    },
    tapDelete(): void {
      this.event('delete')
    },
    tapArchive(): void {
      this.event('archive')
    },
  },
})
</script>

<template>
  <component
    :is="formComponent"
    ref="refBlitzForm"
    :class="[`blitz-form blitz-form--nav-${actionButtonsPosition}`, $attrs.class]"
    :style="$attrs.style"
    @click="(e: any) => $emit('click', e)"
    @dblclick="(e: any) => $emit('dblclick', e)"
    @mousedown="(e: any) => $emit('mousedown', e)"
    @mouseup="(e: any) => $emit('mouseup', e)"
  >
    <!-- navigation buttons row (save, edit, ...) -->
    <div
      v-if="isFullString(formErrorMsg) || actionButtonsSchema.length"
      :class="`blitz-form__nav-row blitz-form__nav-row--${actionButtonsPosition}`"
    >
      <div v-if="isFullString(formErrorMsg)" class="blitz-form__validation-error text-negative">
        {{ formErrorMsg }}
      </div>
      <BlitzField
        v-for="(blueprint, i) in actionButtonsSchema"
        :key="`${blueprint.id}-${i}`"
        v-bind="blueprint"
      />
      <!-- temporary slot -->
      <slot name="nav" />
    </div>
    <!-- form contents -->
    <!-- @slot The default slot is what contains by default the actual form fields. This slot should not be used, unless you are only interested in the logic of BlitzForm and not of BlitzFields. -->
    <slot v-bind="{ schema: cSchema, formData, formDataFlat, updateField }">
      <div
        class="blitz-form__form"
        :style="`grid-template-columns:${' minmax(0, 1fr)'.repeat(
          columnCount
        )}; grid-gap: ${gridGap}`"
      >
        <BlitzField
          v-for="(field, i) in cSchema"
          :key="`${field.id}-${i}`"
          :ref="`ref-field-${i}`"
          v-bind="{ ...field, span: undefined }"
          :modelValue="formDataFlat[field.id]"
          :style="
            field.span
              ? `grid-column: ${field.span === true ? '1 / -1' : `span ${field.span}`}`
              : ''
          "
          @update:modelValue="(value, origin) => updateField({ id: field.id, value, origin })"
        />
      </div>
    </slot>
  </component>
</template>

<style lang="sass">
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
  grid-gap: 1rem
  &--top
    order: 0
    grid-auto-flow: column
    margin-bottom: 1rem
  &--bottom
    order: 1
    grid-auto-flow: column
    margin-top: 1rem
  &--right
    order: 1
    grid-auto-flow: row
    margin-left: 1rem
  &--left
    order: 0
    grid-auto-flow: row
    margin-right: 1rem

.blitz-form__validation-error
  color: crimson
</style>
