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
import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip'
import Vue from 'vue'
Vue.component('VueCustomTooltip', VueCustomTooltip)

const schema = [
  {
    id: 'example',
    component: 'input',
    label: 'Example of a label slot with extra text',
    slots: {
      label: {
        component: 'span',
        slot: '(extra text)',
        style: 'color: grey; padding-left: 0.5em',
      },
    },
  },
  {
    id: 'tooltip',
    component: 'input',
    label: 'Example of a label slot with a tooltip',
    slots: {
      label: {
        component: 'span',
        slot: {
          component: 'VueCustomTooltip',
          slot: 'ℹ️',
          label: `Hi! I'm a tooltip! Yiiiihaaaa`,
        },
      },
    },
  },
  {
    id: 'rainbows',
    component: 'input',
    label: 'Example of a label slot with multiple components',
    slots: {
      label: [
        { component: 'span', slot: 'double rainbow!!', style: 'color: grey; padding: 0 1em' },
        '🌈',
        { component: 'span', slot: '🌈', style: 'font-size: 2em' },
      ],
    },
  },
]

/**
## Label Slot

You can use a `label` slot to pass extra content to a field's label.

In the example below we see usage of the label slot to add some extra content next to the title.
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
