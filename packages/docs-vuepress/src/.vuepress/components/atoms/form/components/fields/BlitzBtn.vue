<template>
  <q-btn class="ef-btn" v-bind="quasarProps" v-on="$listeners" />
</template>

<script>
import { merge } from 'merge-anything'
import { QBtn } from 'quasar'

/**
## usage

BlitzBtn is a component that's registered for you; alongside BlitzForm and BlitzField.
You can use it like:
- &#60;BlitzBtn /&#62; as standalone
- &#60;BlitzField component="BlitzBtn" /&#62; inside a field (with label & sublabel)
- in a BlitzForm "schema" like so: `component: 'BlitzBtn'`

## description

BlitzBtn is a wrapper around QBtn. The only differences are:

- you can pass the button label as `btnLabel` (this is required because when using QBtn it will always use the same label as your field label)
- it defaults to `color: primary` which is nice 😄

All other props/attributes are passed on.`,
 */
export default {
  components: { QBtn },
  name: 'BlitzBtn',
  inheritAttrs: false,
  props: {
    // prop categories: behavior content general model state style
    // EF props:
    /**
     * `btnLabel` is the button's "label". (`label` on the other hand is used for the field label of &#60;BlitzField /&#62;)
     * @category content
     */
    btnLabel: { type: String },
    // Quasar props with modified defaults:
    /**
     * @category inheritedProp
     */
    color: { type: String, default: 'primary', inheritedProp: 'modified' },
    // Quasar props with modified behavior:
  },
  computed: {
    quasarProps() {
      return merge(this.$attrs, {
        // Quasar props with modified defaults:
        color: this.color,
        // Quasar props with modified behavior:
        label: this.btnLabel || this.$attrs.label,
      })
    },
  },
  methods: {},
}
</script>
