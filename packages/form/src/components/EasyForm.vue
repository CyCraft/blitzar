<template>
  <q-form ref="refEasyForm" :class="`easy-form easy-form--nav-${actionButtonsPosition}`">
    <div
      :class="`easy-form__nav-row easy-form__nav-row--${actionButtonsPosition}`"
      v-if="isFullString(formErrorMsg) || actionButtonsSchema.length"
    >
      <div
        class="easy-form__validation-error text-negative"
        v-if="isFullString(formErrorMsg)"
      >{{ formErrorMsg }}</div>
      <EasyField
        v-for="(field, i) in actionButtonsSchema"
        :key="i"
        v-bind="{ ...field, span: undefined }"
        :value="formDataFlat[field.id]"
        @input="(value, origin) => fieldInput({ id: field.id, value, origin })"
      />
    </div>
    <div
      class="easy-form__form"
      :style="`grid-template-columns:${' 1fr'.repeat(columnCount)}; grid-gap: ${gridGap}`"
    >
      <EasyField
        v-for="field in cSchema"
        :key="field.id"
        v-bind="{ ...field, span: undefined }"
        :value="formDataFlat[field.id]"
        @input="(value, origin) => fieldInput({ id: field.id, value, origin })"
        :style="
          field.span ? `grid-column: ${field.span === true ? '1 / -1' : `span ${field.span}`}` : ''
        "
      />
    </div>
  </q-form>
</template>

<style lang="sass" scoped>
// $
@import '../index.sass'

.easy-form
  display: flex
  &--nav-top,
  &--nav-bottom
    flex-direction: column
  &--nav-left,
  &--nav-right
    flex-direction: row
.easy-form__form
  flex: 1
  display: grid
  align-items: stretch
  justify-items: stretch
  > .-title
    grid-column: 1 / -1
.easy-form__nav-row
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
import defaultLang from '../meta/lang'
import EfBtn from './fields/EfBtn.vue'
import EasyField from './EasyField.vue'
import {
  mode,
  labelPosition,
  evaluatedProps,
  internalLabels,
  internalErrors,
} from './sharedProps.js'

export const EVENTS = {
  'update:mode': {
    name: 'update:mode',
    desc: '',
  },
  'field-input': {
    name: 'field-input',
    desc: '',
  },
  input: {
    name: 'input',
    desc: '',
  },
  edit: {
    name: 'edit',
    desc: '(no payload) The edit-button was tapped and the form was put into "edit" mode',
  },
  cancel: {
    name: 'cancel',
    desc:
      '(no payload) The cancel-button was tapped and the form was put back into "view" mode & reverted to its original state',
  },
  save: {
    name: 'save',
    desc:
      '(payload: {newData, oldData}) The save-button was tapped and the form was put back into "view" mode & kept the modified content',
  },
  delete: {
    name: 'delete',
    desc: '(no payload) The delete-button was tapped (you must implement your own logic)',
  },
  archive: {
    name: 'archive',
    desc: '(no payload) The archive-button was tapped (you must implement your own logic)',
  },
}

export default {
  name: 'EasyForm',
  components: { EfBtn, EasyField, QForm },
  inheritAttrs: false,
  props: {
    // prop categories: behavior content general model state style
    value: {
      category: 'model',
      type: Object,
      desc: `An object with the data of the entire form. The object keys are the ids of the fields passed in the 'schema'.\nTo be used with \`:value\` or \`v-model\`.`,
      default: () => ({}),
      examples: [`{name: ''}`],
    },
    id: {
      category: 'model',
      type: String,
      desc: `A manually set 'id' of the EasyForm. This prop is accessible in the \`context\` (as \`formId\`) of any "evaluated prop" and event*.

Read more on Evaluated Props in its dedicated page.`,
    },
    schema: {
      category: 'model',
      type: Array,
      required: true,
      desc: `This is the heart of your EasyForm. It's the schema that will defined what fields will be generated.`,
      examples: [`[{id: 'name', component: 'QInput'}]`],
    },
    actionButtons: {
      category: 'content',
      type: Array,
      default: () => [],
      desc: `Buttons on top of the form that control the 'mode' of the form. The possible pre-made buttons are:
- 'edit' a button which puts the form in 'edit' mode & does \`emit('edit')\`
- 'cancel' a button which puts the form in 'view' mode & does \`emit('cancel')\`
- 'save' a button which puts the form in 'edit' mode & does \`emit('save', {newData, oldData})\`
- 'delete' a red button which does \`emit('delete')\`
- 'archive' a red button which does \`emit('archive')\`

You can also pass custom buttons with the same schema to generate forms.
See the documentation on "Action Buttons" for more info.`,
      examples: [
        `[] (no buttons)`,
        `['delete', 'cancel', 'edit', 'save']`,
        `[{component: 'EfBtn', btnLabel: 'log', events: {click: console.log}}]`,
      ],
    },
    actionButtonDefaults: {
      category: 'content',
      type: Object,
      default: () => ({}),
      desc: `You can overwrite the schema used for the default action buttons for edit, cancel, save, delete & archive.`,
      examples: [`{'save': {push: true}, 'delete': {color: 'secondary'}}`],
    },
    actionButtonsPosition: {
      category: 'content',
      type: String,
      default: 'top',
      desc: `The position of the action buttons.`,
      examples: ['top', 'bottom', 'right', 'left'],
      values: ['top', 'bottom', 'right', 'left'],
      validator: (prop) => ['top', 'bottom', 'right', 'left'].includes(prop),
    },
    validator: {
      category: 'behavior',
      type: Function,
      desc: `A function which serves as global validator for your form. It will receive the edited data as first param and the original data (before user edits) as second. It should return true if all is OK or a string with error message.`,
      examples: [
        `(newData, oldData) => newData.pass1 === newData.pass2 || 'passwords don't match'`,
      ],
    },
    columnCount: {
      category: 'style',
      type: Number,
      default: 1,
      desc: `The amount of columns the form should have.\nEach field can set a specific 'span' to be able to span multiple columns.`,
    },
    gridGap: {
      category: 'style',
      type: String,
      default: '1em',
      desc: `The gap between each field in the form.`,
    },
    lang: {
      category: 'content',
      type: Object,
      desc: `The text used in the UI, eg. edit/save buttons etc... Pass an object with keys: archive, delete, cancel, edit, save.`,
      default: () => defaultLang,
      examples: [`{cancel: 'キャンセル', edit: '編集', save: '保存'}`],
    },
    // shared props:
    mode,
    labelPosition,
    evaluatedProps,
    internalLabels,
    internalErrors,
  },
  data() {
    const { mode, id, value, schema, lang } = this
    // merge user provided lang onto defaults
    const innerLang = merge(defaultLang, lang)
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
      this.innerLang = merge(defaultLang, newValue)
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
        this.$emit(EVENTS['update:mode'].name, val)
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
      const { schema, schemaOverwritableDefaults, schemaForcedDefaults } = this
      return schema.map((blueprint) => {
        const blueprintParsed = merge(schemaOverwritableDefaults, blueprint, schemaForcedDefaults)
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
          btnLabel: innerLang['delete'],
          flat: true,
          color: 'negative',
          events: { click: tapDelete },
        },
        archive: {
          btnLabel: innerLang['archive'],
          flat: true,
          color: 'negative',
          events: { click: tapArchive },
        },
        edit: {
          showCondition: (_, { mode }) => ['view', 'raw'].includes(mode),
          flat: true,
          btnLabel: innerLang['edit'],
          events: { click: tapEdit },
        },
        cancel: {
          showCondition: (_, { mode }) => ['edit', 'add'].includes(mode),
          btnLabel: innerLang['cancel'],
          flat: true,
          events: { click: tapCancel },
        },
        save: {
          showCondition: (_, { mode }) => ['edit', 'add'].includes(mode),
          unelevated: true,
          btnLabel: innerLang['save'],
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
      } = this
      return actionButtons.map((blueprint) => {
        const buttonBlueprint = isString(blueprint) ? actionButtonsMap[blueprint] : blueprint
        const blueprintParsed = merge(
          { component: 'EfBtn' },
          schemaOverwritableDefaults,
          buttonBlueprint,
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
    fieldInput({ id, value, origin }) {
      // no idea why I do this:
      this.edited = true
      // keep a list of edited field ids
      if (!this.editedFields.includes(id)) this.editedFields.push(id)
      // set the new value onto the formData (might be an empty object)
      this.$set(this.formDataFlat, id, value)
      // emit field-input with field's id and new data
      this.$emit(EVENTS['field-input'].name, { id, value, origin })
      // emit input with entire formData
      this.$emit(EVENTS['input'].name, this.formData) // do not extract `this` from here
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
      this.$emit(EVENTS['cancel'].name)
    },
    validate() {
      // validate will focus the field with error, so only use it when the user is not typing something else
      const { $refs, innerLang, validator, dataEdited, dataBackup, schema, formDataFlat } = this
      return new Promise((resolve, reject) => {
        if (isFunction(validator)) {
          const validatorRes = validator(dataEdited, dataBackup)
          if (isFullString(validatorRes)) reject(validatorRes)
        }
        $refs.refEasyForm
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
      this.$emit(EVENTS['edit'].name)
    },
    tapSave() {
      const { validate, dataEdited, dataBackup, resetState } = this
      validate()
        .then(() => {
          const newData = copy(dataEdited)
          const oldData = copy(dataBackup)
          this.$emit(EVENTS['save'].name, { newData, oldData })
          resetState()
        })
        .catch((formErrorMsg) => {
          this.formErrorMsg = formErrorMsg
        })
    },
    tapDelete() {
      this.$emit(EVENTS['delete'].name)
    },
    tapArchive() {
      this.$emit(EVENTS['archive'].name)
    },
  },
}
</script>
