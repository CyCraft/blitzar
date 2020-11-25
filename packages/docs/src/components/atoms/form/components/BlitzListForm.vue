<template>
  <div class="blitz-list-form">
    <div
      class="blitz-list-form__row"
      :style="`grid-template-columns: ${gridTemplateColumnsCalculated}`"
    >
      <BlitzField
        v-for="(subfield, fieldIndex) in schemaLabels"
        :key="fieldIndex"
        class="blitz-list-form__sub-field"
        v-bind="subfield"
      />
    </div>
    <div
      class="blitz-list-form__row"
      v-for="(row, rowIndex) in cValue"
      :style="`grid-template-columns: ${gridTemplateColumnsCalculated}`"
      :key="rowIndex"
    >
      <BlitzField
        v-for="(subfield, fieldIndex) in cSchema"
        :key="fieldIndex"
        class="blitz-list-form__sub-field"
        :rowIndex="rowIndex"
        :rowData="cValue[rowIndex]"
        :rowInput="(params) => setSubFieldValue({ id: params.id, value: params.value, rowIndex })"
        :deleteRow="() => deleteRow(rowIndex)"
        v-bind="subfield"
        :value="cValue[rowIndex][subfield.id]"
        @input="
          (val, origin) => setSubFieldValue({ id: subfield.id, value: val, rowIndex }, origin)
        "
        @keyup.native.delete="onDeleteKey(rowIndex, subfield.id)"
      />
    </div>
  </div>
</template>

<style lang="sass">
@import '../index.sass'

.blitz-list-form
  > .blitz-list-form__row
    display: grid
    justify-items: stretch
    align-items: center
    grid-gap: $sm
    margin-bottom: $sm
</style>

<script>
import { merge } from 'merge-anything'
import { copy } from 'copy-anything'
import { isNumber } from 'is-what'
import BlitzField from './BlitzField.vue'

/**
With BlitzListForm you can pass a `schema` just like a BlitzForm. The difference is that BlitzListForm is more like a (as the name says) _**list**_ form. 😃

The `schema` you specify is shown as a single row. New rows are added automatically on user input.
 */
export default {
  name: 'BlitzListForm',
  inheritAttrs: false,
  components: { BlitzField },
  props: {
    /**
     * @category model
     */
    value: { type: Array, default: () => [] },
    /**
     * This is the information on the columns you want to be shown. An array of objects just like a BlitzForm.
     * @example [{ label: 'Amount', id: 'amount', component: 'QInput', type: 'number' }, { label: 'Currency', id: 'curr', component: 'QSelect', options: [{ label: 'USD', value: 'usd' }] }]
     * @category content
     */
    schema: { type: Array, default: () => [{ component: 'input' }] },
    /**
     * A list of prop (attribute) names to be passed on to each single BlitzField generated in the list form.
     *
     * This is useful when you want to use Evaluated Props in the schema of the mine form but need information from the top level BlitzForm.
     * @example ['formData', 'mode', 'myCustomProp']
     * @category content
     */
    attrsToPass: {
      type: Array,
      default: () => ['formData', 'formDataFlat', 'formId', 'mode', 'fieldInput', 'lang'],
    },
    /**
     * Allows to limit the max amount of rows.
     * @category content
     */
    maxRows: { type: Number },
    disable: { type: Boolean },
    readonly: { type: Boolean },
  },
  computed: {
    cValue: {
      get() {
        const { value, schema, disable, readonly, maxRows } = this
        const emptyRow = schema.reduce((carry, { id }) => ({ ...carry, [id]: undefined }), {})
        if (!disable && !readonly && (!isNumber(maxRows) || maxRows > value.length)) {
          return value.concat([emptyRow])
        }
        return value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    listFormAttrsToPass() {
      const { attrsToPass, getPropOrAttrOrParentProp } = this
      return attrsToPass.reduce((carry, attrKey) => {
        carry[attrKey] = getPropOrAttrOrParentProp(attrKey)
        return carry
      }, {})
    },
    cSchema() {
      const { schema, disable, readonly, listFormAttrsToPass } = this
      // slot, class, style are 3 prop names we cannot directly pass via `v-bind`.
      // - slot: we pass as `slots: { default: ... }`
      // - class: we pass as `fieldClasses`
      // - style: we pass as `fieldStyle`
      return schema.map((blueprint) => {
        const overwritableDefaults = { disable, readonly }
        const overwrites = {
          label: '',
          subLabel: '',
        }
        if (blueprint.slot) {
          overwrites.slots = merge(blueprint.slots || {}, { default: blueprint.slot })
        }
        const fieldClasses = blueprint.fieldClasses || blueprint.class
        if (fieldClasses) overwrites.fieldClasses = fieldClasses
        const fieldStyle = blueprint.fieldStyle || blueprint.style
        if (fieldStyle) overwrites.fieldStyle = fieldStyle

        return merge(listFormAttrsToPass, overwritableDefaults, blueprint, overwrites)
      })
    },
    schemaLabels() {
      const { schema, listFormAttrsToPass } = this
      return schema.map((subfield) => {
        return merge(listFormAttrsToPass, subfield, { component: undefined })
      })
    },
    gridTemplateColumnsCalculated() {
      const { schema } = this
      return schema.reduce((total, field) => {
        const fr = Number(field.span)
        if (isNumber(fr)) return `${total} ${fr}fr`
        return `${total} ${field.span || '1fr'}`
      }, '')
    },
  },
  methods: {
    getPropOrAttrOrParentProp(propKey) {
      if (propKey in this) return this[propKey]
      if (propKey in this.$attrs) return this.$attrs[propKey]
      if (propKey in this.$parent) return this.$parent[propKey]
      return this.$parent.$parent[propKey]
    },
    deleteRow(rowIndex) {
      const { value } = this
      const allRows = copy(value)
      if (allRows[rowIndex] === undefined) return
      allRows.splice(rowIndex, 1)
      this.$emit('input', allRows)
    },
    setSubFieldValue({ id, value: newValue, rowIndex }, origin) {
      // do not emit when the origin is from the default value initialisation
      if (origin === 'default') return
      const { value: oldValue } = this
      const allRows = copy(oldValue)
      if (allRows[rowIndex] === undefined) this.$set(allRows, rowIndex, {})
      allRows[rowIndex][id] = newValue
      this.$emit('input', allRows)
    },
    onDeleteKey(rowIndex, fieldId) {
      const { value, deleteRow } = this
      const allRows = value
      const row = allRows[rowIndex]
      if (!row) return
      if (Object.keys(row).every((key) => row[key] === '' || row[key] === 0)) {
        deleteRow(rowIndex)
      }
    },
  },
}
</script>
