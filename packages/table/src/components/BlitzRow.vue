<template>
  <q-tr
    :props="qTableRowProps"
    :class="['blitz-table__row', 'blitz-row', `blitz-row__${id}`, ...cRowClassesArray]"
    :style="cRowStyle"
  >
    <slot v-bind="blitzFormSimulatedContext" />
  </q-tr>
</template>

<style lang="sass" scoped>
@import '../index.sass'

// .blitz-row
</style>

<script>
import { merge } from 'merge-anything'
import { copy } from 'copy-anything'
import { nestifyObject } from 'nestify-anything'
import { isArray, isFunction, isString, isPlainObject } from 'is-what'
import { QTr } from 'quasar'
import { flattenPerSchema } from '@blitzar/utils'

function resolveBlitzFormProp(propValue, componentValue, component) {
  return isFunction(propValue) ? propValue(componentValue, component) : propValue
}

export default {
  name: 'BlitzRow',
  components: { QTr },
  inheritAttrs: false,
  props: {
    /**
     * The QTable v-slot:body props to pass to QTr
     */
    qTableRowProps: { type: Object },
    /**
     * The BlitzForm data
     */
    value: { type: Object },
    /**
     * The BlitzForm schema
     */
    schema: { type: [Array, Object] },
    /**
     * Custom styling to be applied to the BlitzRow. Applied like so `:style="rowStyle"`
     * @example 'padding: 1em;'
     * @category style
     */
    rowStyle: { type: [Object, Array, String, Function] },
    /**
     * Custom classes to be applied to the BlitzRow. Applied like so `:class="rowClasses"`
     * @example ['dark-theme']
     * @category style
     */
    rowClasses: { type: [Object, Array, String, Function] },
    // Other BlitzForm props yet to be fully implemented:
    mode: { type: String },
    id: { type: String },
  },
  computed: {
    cRowStyle() {
      const { rowStyle, value } = this
      return resolveBlitzFormProp(rowStyle, value, this)
    },
    cRowClassesArray() {
      const { rowClasses, value } = this
      const classes = resolveBlitzFormProp(rowClasses, value, this)
      if (isString(classes)) return classes.split(' ')
      if (isPlainObject(classes)) return [classes]
      return classes
    },
    blitzFormSimulatedContext() {
      const { value: formData, schema, id: formId, mode } = this
      const schemaArray = isArray(schema) ? schema : Object.values(schema)
      const dataFlat = flattenPerSchema(formData, schema)
      const dataFlatDefaults = schemaArray.reduce((carry, { id, default: df }) => {
        // set default for formDataFlat
        carry[id] = isFunction(df) ? df(formData) : df
        return carry
      }, {})
      const formDataFlat = merge(dataFlatDefaults, copy(dataFlat))
      const fieldInput = ({ id: fieldId, value, origin }) =>
        this.$emit('row-input', {
          rowId: formId,
          fieldId,
          value,
          origin,
        })
      return {
        // make sure formData is rebuild from "flat" to have the default value
        formData: nestifyObject(formDataFlat),
        formDataFlat,
        formId,
        mode,
        fieldInput,
      }
    },
  },
  methods: {},
}
</script>
