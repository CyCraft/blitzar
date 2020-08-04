<template>
  <div class="ef-div" v-bind="$attrs" v-on="$listeners">{{ cValue }}</div>
</template>

<style lang="sass">
// $
@import '../../index.sass'
</style>

<script>
import { parseFieldValue } from '@blitzar/utils'
import { getUsageDocs } from './sharedProps.js'

export default {
  name: 'EfDiv',
  inheritAttrs: false,
  desc: `${getUsageDocs('EfDiv')}

### description

EfDiv is used by EasyForms when \`mode: 'raw'\`. The component shows the raw values of the data inside a simple \`<div>\`.

The difference the EfDiv field over a regular div, is that it will parse your value as per your field's schema. It will parse your value based on the following schema props:
- \`type\`: shows numbers with thousands separator and dates as YYYY/MM/DD
- \`valueType\`: shows numbers with thousands separator and dates as YYYY/MM/DD
- \`dateFormat\`: the format used when formatting dates, defaults to 'YYYY/MM/DD'
- \`suffix\`: shows \`value + suffix\` when passed
- \`prefix\`: shows \`prefix + value\` when passed
- \`options\`: shows the "label" of the option which has the value when passed
- \`multiple\`: if your field allows to have multiple values, \`multiple\` must be \`true\`. This is used when parsing the \`options\`

The difference between \`type\` and \`valueType\` is when you don't want to set the type for an "input" field, you can use \`valueType\` instead of \`type\`.
`,
  props: {
    // prop categories: behavior content general model state style
    // EF props:
    value: { category: 'model', type: undefined },
    valueType: {
      category: 'model',
      type: String,
      desc: `valueType can be any type.`,
    },
    type: { category: 'model|content', type: String },
    dateFormat: { category: 'model|content', type: String, default: 'YYYY/MM/DD' },
    suffix: { category: 'model|content', type: String },
    prefix: { category: 'model|content', type: String },
    options: { category: 'model|content', type: Array },
    multiple: { category: 'model|content', type: Boolean },
  },
  computed: {
    cValue() {
      const { value, valueType, type, dateFormat, options, suffix, prefix, multiple } = this
      return parseEasyFieldValue(
        value,
        { valueType: valueType || type, dateFormat, options, suffix, prefix, multiple },
        this
      )
    },
  },
  methods: {},
}
</script>
