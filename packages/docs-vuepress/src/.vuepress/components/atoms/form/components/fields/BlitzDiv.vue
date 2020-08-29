<template>
  <div class="ef-div" v-bind="$attrs" v-on="$listeners">{{ cValue }}</div>
</template>

<style lang="sass">
// $
@import '../../index.sass'
</style>

<script>
import { parseFieldValue } from '@blitzar/utils'

/**
## usage

BlitzDiv is a component that's registered for you; alongside BlitzForm and BlitzField.
You can use it like:
- `<BlitzDiv />` as standalone
- `<BlitzField component="BlitzDiv" />` inside a field (with label & sublabel)
- in a BlitzForm "schema" like so: `component: 'BlitzDiv'`

## description

BlitzDiv is used by BlitzForms when `mode: 'raw'`. The component shows the raw values of the data inside a simple `<div>`.

The difference the BlitzDiv field over a regular div, is that it will parse your value as per your field's schema. It will parse your value based on the following schema props:
- `type`: shows numbers with thousands separator and dates as toLocaleDateString()
- `valueType`: shows numbers with thousands separator and dates as toLocaleDateString()
- `suffix`: shows `value + suffix` when passed
- `prefix`: shows `prefix + value` when passed
- `options`: shows the "label" of the option which has the value when passed
- `multiple`: if your field allows to have multiple values, `multiple` must be `true`. This is used when parsing the `options`

The difference between `type` and `valueType` is when you don't want to set the type for an "input" field, you can use `valueType` instead of `type`.
 */
export default {
  name: 'BlitzDiv',
  inheritAttrs: false,
  props: {
    // prop categories: behavior content general model state style
    // EF props:
    /**
     * @category model
     */
    value: { type: undefined },
    /**
     * valueType can be any type.
     * @category model
     */
    valueType: { type: String },
    /**
     * @category content
     */
    type: { type: String },
    /**
     * @category content
     */
    suffix: { type: String },
    /**
     * @category content
     */
    prefix: { type: String },
    /**
     * @category content
     */
    options: { type: Array },
    /**
     * @category model
     */
    multiple: { type: Boolean },
  },
  computed: {
    cValue() {
      const { value, valueType, type, dateFormat, options, suffix, prefix, multiple } = this
      return parseFieldValue(
        value,
        { valueType: valueType || type, dateFormat, options, suffix, prefix, multiple },
        this
      )
    },
  },
  methods: {},
}
</script>
