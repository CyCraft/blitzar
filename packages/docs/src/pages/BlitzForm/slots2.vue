<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput, QSelect, QIcon, QTooltip } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)
Vue.component('QSelect', QSelect)
Vue.component('QIcon', QIcon)
Vue.component('QTooltip', QTooltip)

const schema = [
  {
    id: 'tooltip',
    component: 'input',
    label: 'Example of a label slot with a tooltip',
    slots: {
      label: {
        component: 'QIcon',
        name: 'info',
        slots: {
          default: {
            component: 'QTooltip',
            slots: { default: `Hi! I'm a tooltip! Yiiiihaaaa` },
          },
        },
      },
    },
  },
  {
    id: 'rainbows',
    component: 'input',
    label: 'Example of a label slot with multiple components',
    slots: {
      label: ['🌈', { component: 'span', slots: { default: '🌈' }, style: 'font-size: 2em' }],
    },
  },
]

/**
## label slot

In the example below we see usage of the label slot to add some extra content next to the title.
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
