<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { merge } from 'merge-anything'
import { copy } from 'copy-anything'
import { isNumber } from 'is-what'
import type { Schema, UpdateModelValueOrigin } from '@blitzar/types'
import BlitzField from './BlitzField.vue'

/**
With BlitzListForm you can pass a `schema` just like a BlitzForm. The difference is that BlitzListForm is more like a (as the name says) _**list**_ form. 😃

The `schema` you specify is shown as a single row. New rows are added automatically on user input.
 */
export default defineComponent({
  name: 'BlitzListForm',
  components: { BlitzField },
  inheritAttrs: false,
  props: {
    /**
     * @category model
     */
    modelValue: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    /**
     * This is the information on the columns you want to be shown. An array of objects just like a BlitzForm.
     * @example [{ label: 'Amount', id: 'amount', component: 'input', type: 'number', style: 'color: white' }, { label: 'Currency', id: 'curr', component: 'select', slot: [{ component: 'option', value: '', slot: 'Select one', disabled: true }, { component: 'option', value: 'usd', slot: 'USD' }], style: 'color: white' }]
     * @category content
     */
    schema: {
      type: Array as PropType<Schema>,
      default: () => [{ component: 'input' }],
    },
    /**
     * A list of prop (attribute) names to be passed on to each single BlitzField generated in the list form.
     *
     * This is useful when you want to use Dynamic Props in the schema of the mine form but need information from the top level BlitzForm.
     * @example ['formData', 'mode', 'myCustomProp']
     * @category content
     */
    attrsToPass: {
      type: Array as PropType<string[]>,
      default: () => [
        'formData',
        'formDataFlat',
        'formId',
        'formMode',
        'mode',
        'updateField',
        'lang',
      ],
    },
    /**
     * Allows to limit the max amount of rows.
     * @category content
     */
    maxRows: { type: Number, default: undefined },
    disabled: { type: Boolean, default: undefined },
    readonly: { type: Boolean, default: undefined },
  },
  emits: {
    /**
     * @type {(payload: any) => boolean}
     */
    'update:modelValue': null,
  },
  computed: {
    /**
     * This is the value with an empty row concatinated to it.
     */
    cValue: {
      get(): any {
        const { modelValue, schema, disabled, readonly, maxRows } = this
        const emptyRow = schema.reduce((carry, { id }) => ({ ...carry, [id]: undefined }), {})
        if (!disabled && !readonly && (!isNumber(maxRows) || maxRows > modelValue.length)) {
          return modelValue.concat([emptyRow])
        }
        return modelValue
      },
      set(val: any) {
        this.$emit('update:modelValue', val)
      },
    },
    listFormAttrsToPass(): Record<string, any> {
      const { attrsToPass, getPropOrAttrOrParentProp, modelValue } = this
      const attrs = attrsToPass.reduce<Record<string, any>>((carry, attrKey) => {
        carry[attrKey] = getPropOrAttrOrParentProp(attrKey)
        return carry
      }, {})
      if (!attrs.formData) {
        return { ...attrs, formData: modelValue }
      }
      return attrs
    },
    cSchema(): Schema {
      const { schema, disabled, readonly, listFormAttrsToPass } = this
      // slot, class, style are 3 prop names we cannot directly pass via `v-bind`.
      // - slot: we pass as `slots: { default: ... }`
      // - class: we pass as `fieldClasses`
      // - style: we pass as `fieldStyle`
      return schema.map((blueprint) => {
        const overwritableDefaults = { disabled, readonly }
        const overwrites: Record<string, any> = {
          label: '',
          subLabel: '',
          slots: { label: undefined },
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
    schemaLabelsAndAttrs(): Record<string, any>[] {
      const { schema, listFormAttrsToPass } = this
      return schema.map((subfield) => {
        return merge(listFormAttrsToPass, subfield, { component: undefined })
      })
    },
    gridTemplateColumnsCalculated(): string {
      const { schema } = this
      return schema.reduce<string>((total, field) => {
        const fr = Number(field.span)
        if (isNumber(fr)) return `${total} ${fr}fr`
        return `${total} ${field.span || '1fr'}`
      }, '')
    },
  },
  methods: {
    getPropOrAttrOrParentProp(propKey: string): any {
      if (propKey in this) return (this as any)[propKey]
      if (propKey in this.$attrs) return this.$attrs[propKey]
      // TODO: WTF, this is such bad practice... Why did I do this... :'D
      if (this.$parent && propKey in this.$parent) return (this.$parent as any)[propKey]
      if (this.$parent && this.$parent.$parent && propKey in this.$parent.$parent) {
        return (this.$parent.$parent as any)[propKey]
      }
      return undefined
    },
    deleteRow(rowIndex: number): void {
      const { modelValue } = this
      const allRows = copy(modelValue)
      if (allRows[rowIndex] === undefined) return
      allRows.splice(rowIndex, 1)
      this.$emit('update:modelValue', allRows)
    },
    setSubFieldValue(
      { id, value: newValue, rowIndex }: { id: string | undefined; value: any; rowIndex: number },
      origin?: UpdateModelValueOrigin
    ): void {
      // do not emit when the origin is from the default value initialisation
      if (origin === 'default' || !id) return

      const { modelValue: oldValue } = this
      const allRows = copy(oldValue)

      if (allRows[rowIndex] === undefined) allRows[rowIndex] = {}

      allRows[rowIndex][id] = newValue
      this.$emit('update:modelValue', allRows)
    },
    onDeleteKey(rowIndex: number): void {
      const { modelValue, deleteRow } = this
      const allRows = modelValue
      const row = allRows[rowIndex]
      if (!row) return
      if (Object.keys(row).every((key) => row[key] === '' || row[key] === 0)) {
        deleteRow(rowIndex)
      }
    },
  },
})
</script>

<template>
  <div class="blitz-list-form" :class="$attrs.class" :style="($attrs as any).style">
    <div
      class="blitz-list-form__row"
      :style="`grid-template-columns: ${gridTemplateColumnsCalculated}`"
    >
      <BlitzField
        v-for="(subfield, fieldIndex) in schemaLabelsAndAttrs"
        :key="fieldIndex"
        v-bind="subfield"
        class="blitz-list-form__sub-field"
      />
    </div>
    <div
      v-for="(row, rowIndex) in cValue"
      :key="rowIndex"
      class="blitz-list-form__row"
      :style="`grid-template-columns: ${gridTemplateColumnsCalculated}`"
    >
      <BlitzField
        v-for="(subfield, fieldIndex) in cSchema"
        :key="fieldIndex"
        v-bind="subfield"
        class="blitz-list-form__sub-field"
        :rowIndex="rowIndex"
        :rowData="cValue[rowIndex]"
        :rowInput="(params) => setSubFieldValue({ id: params.id, value: params.value, rowIndex })"
        :deleteRow="() => deleteRow(rowIndex)"
        :modelValue="cValue[rowIndex][subfield.id]"
        @update:modelValue="
          (val, origin) => setSubFieldValue({ id: subfield.id, value: val, rowIndex }, origin)
        "
        @keyup.delete="onDeleteKey(rowIndex)"
      />
    </div>
  </div>
</template>

<style lang="sass">
.blitz-list-form
  > .blitz-list-form__row
    display: grid
    justify-items: stretch
    align-items: center
    grid-gap: 0.5rem
    margin-bottom: 0.5rem
</style>
