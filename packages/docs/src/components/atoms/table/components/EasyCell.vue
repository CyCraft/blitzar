<template>
  <div :class="['easy-cell', ...cCellClassesArray]" :style="cCellStyle">
    <EasyField v-if="component" v-model="cValue" v-bind="easyFieldProps" />
    <div v-else>{{ cValue }}</div>
  </div>
</template>

<style lang="sass">
// $
@import '../index.sass'
</style>

<script>
import { isArray, isPlainObject, isFunction, isString, isAnyObject } from 'is-what'
import commafy from 'commafy-anything'
import { merge } from 'merge-anything'
import { EasyField, EfDiv } from '@blitzar/form'
import Vue from 'vue'

Vue.component('EfDiv', EfDiv)

function resolveEasyFieldProp(propValue, componentValue, componentContext) {
  return isFunction(propValue) ? propValue(componentValue, componentContext) : propValue
}

export default {
  name: 'EasyCell',
  components: { EasyField },
  inheritAttrs: false,
  props: {
    /**
     * the value unformatted
     */
    value: { type: undefined },
    /**
     * Custom styling to be applied to the EasyCell. Applied like so `:style="cellStyle"`
     * @category style
     */
    cellStyle: { type: [Object, Array, String, Function], examples: [`'padding: 1em;'`] },
    /**
     * Custom classes to be applied to the EasyCell. Applied like so `:class="cellClasses"`
     * @category style
     */
    cellClasses: { type: [Object, Array, String, Function], examples: [`['dark-theme']`] },
    // EasyForm props that are used here:
    /**
     * @category easyFormProp
     */
    formData: { type: Object, default: () => ({}) },
    /**
     * @category easyFormProp
     */
    formDataFlat: { type: Object, default: () => ({}) },
    /**
     * @category easyFormProp
     */
    formId: { type: String },
    /**
     * @category easyFormProp
     */
    mode: { type: String },
    /**
     * @category easyFormProp
     */
    fieldInput: { type: Function },
    // EasyField props that are used here:
    component: { type: [String, Object, Function] },
    /**
     * only 'click' is used for button fields
     */
    events: { type: Object, default: () => ({}) },
  },
  computed: {
    easyFieldProps() {
      return merge(
        // overwritable defaults:
        { mode: 'raw' },
        this.$attrs,
        this.$props,
        // force these options:
        { label: null, subLabel: null }
      )
    },
    easyFieldSimulatedContext() {
      // simulate the EasyField component to be able to resolve EvaluatedProps
      return merge(this.easyFieldProps, {
        $store: this.$store,
        $router: this.$router,
        $q: this.$q,
      })
    },
    cCellStyle() {
      const { cellStyle, cValue, easyFieldSimulatedContext } = this
      return resolveEasyFieldProp(cellStyle, cValue, easyFieldSimulatedContext)
    },
    cCellClassesArray() {
      const { cellClasses, cValue, easyFieldSimulatedContext } = this
      const classes = resolveEasyFieldProp(cellClasses, cValue, easyFieldSimulatedContext)
      if (isString(classes)) return classes.split(' ')
      if (isPlainObject(classes)) return [classes]
      return classes
    },
    cValue: {
      get() {
        return this.value
      },
      /**
       * @param {any} val
       * @param {undefined | 'default'} origin
       */
      set(val, origin) {
        this.$emit('input', val, origin)
      },
    },
  },
  methods: { isArray },
}
</script>
