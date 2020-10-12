<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QTooltip } from 'quasar'
import Vue from 'vue'
Vue.component('QTooltip', QTooltip)

const schema = [
  {
    id: 'tooltip',
    component: 'input',
    label: 'Example of a label slot with a tooltip',
    slots: {
      label: {
        component: 'span',
        slot: ['⚠️', { component: 'QTooltip', slot: `Hi! I'm a tooltip! Yiiiihaaaa` }],
      },
    },
  },
  {
    id: 'rainbows',
    component: 'input',
    label: 'Example of a label slot with multiple components',
    slots: {
      label: ['🌈', { component: 'span', slot: '🌈', style: 'font-size: 2em' }, 'double rainbow'],
    },
  },
]

/**
## label slot

You can use a "label" slot to pass extra content to a field's label.

In the example below we see usage of the label slot to add some extra content next to the title.
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
