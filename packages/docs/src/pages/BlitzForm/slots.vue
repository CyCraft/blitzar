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
    id: 'name',
    component: 'QInput',
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
    // component props:
    outlined: true,
  },
  {
    id: 'powerOrigin',
    component: 'QSelect',
    label: 'Example of a label slot with multiple components',
    slots: {
      label: [
        { component: 'span', slots: { default: '🌈' } },
        { component: 'span', slots: { default: '🌈' }, class: 'q-pl-xl' },
      ],
    },
    // component props:
    options: [
      { label: 'Mutation', value: 'mutation' },
      { label: 'Self taught', value: 'self' },
      { label: 'Magic item', value: 'item' },
    ],
    outlined: true,
    emitValue: true,
    mapOptions: true,
  },
]

/**
Here is an example of the special "slots" prop you can pass for components in your form.

Currently supported is the "label" slot and the "default" slot.

> PLEASE NOTE, this feature is still experimental and is prone to change while we are in beta!!
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
