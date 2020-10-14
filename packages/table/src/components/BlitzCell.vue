<template>
  <div :class="['blitz-cell', ...cCellClassesArray]" :style="cCellStyle">
    <BlitzField v-if="component" v-model="cValue" v-bind="blitzFieldProps" />
    <div v-else>{{ cValue }}</div>
  </div>
</template>

<style lang="sass">
@import '../index.sass'
</style>

<script>
import { isArray, isPlainObject, isFunction, isString, isAnyObject } from 'is-what'
import commafy from 'commafy-anything'
import { merge } from 'merge-anything'
import { BlitzField, BlitzDiv } from '@blitzar/form'
import Vue from 'vue'

Vue.component('BlitzDiv', BlitzDiv)

function resolveBlitzFieldProp(propValue, componentValue, componentContext) {
  return isFunction(propValue) ? propValue(componentValue, componentContext) : propValue
}

export default {
  name: 'BlitzCell',
  components: { BlitzField },
  inheritAttrs: false,
  props: {
    /**
     * the value unformatted
     */
    value: { type: undefined },
    /**
     * Custom styling to be applied to the BlitzCell. Applied like so `:style="cellStyle"`
     * @category style
     */
    cellStyle: { type: [Object, Array, String, Function], examples: [`'padding: 1em;'`] },
    /**
     * Custom classes to be applied to the BlitzCell. Applied like so `:class="cellClasses"`
     * @category style
     */
    cellClasses: { type: [Object, Array, String, Function], examples: [`['dark-theme']`] },
    // BlitzForm props that are used here:
    /**
     * @category blitzFormProp
     */
    formData: { type: Object, default: () => ({}) },
    /**
     * @category blitzFormProp
     */
    formDataFlat: { type: Object, default: () => ({}) },
    /**
     * @category blitzFormProp
     */
    formId: { type: String },
    /**
     * @category blitzFormProp
     */
    mode: { type: String },
    /**
     * @category blitzFormProp
     */
    fieldInput: { type: Function },
    // BlitzField props that are used here:
    component: { type: [String, Object, Function] },
    /**
     * only 'click' is used for button fields
     */
    events: { type: Object, default: () => ({}) },
  },
  computed: {
    blitzFieldProps() {
      return merge(
        // overwritable defaults:
        { mode: 'raw' },
        this.$attrs,
        this.$props,
        // force these options:
        { label: null, subLabel: null }
      )
    },
    blitzFieldSimulatedContext() {
      // simulate the BlitzField component to be able to resolve EvaluatedProps
      return merge(this.blitzFieldProps, {
        $store: this.$store,
        $router: this.$router,
        $q: this.$q,
      })
    },
    cCellStyle() {
      const { cellStyle, cValue, blitzFieldSimulatedContext } = this
      return resolveBlitzFieldProp(cellStyle, cValue, blitzFieldSimulatedContext)
    },
    cCellClassesArray() {
      const { cellClasses, cValue, blitzFieldSimulatedContext } = this
      const classes = resolveBlitzFieldProp(cellClasses, cValue, blitzFieldSimulatedContext)
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
