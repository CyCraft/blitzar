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
import { QBtnToggle } from 'quasar'
import Vue from 'vue'
Vue.component('QBtnToggle', QBtnToggle)

const schema = [
  {
    id: 'color',
    span: true,
    component: 'select',
    label: 'What is your favorite color?',
    evaluatedProps: ['subLabel'],
    subLabel: (val) =>
      val === 'red'
        ? 'like the sun'
        : val === 'blue'
        ? 'like the sky'
        : val === 'green'
        ? 'green is not a creative color'
        : val === 'other'
        ? 'oh, come on, just pick one'
        : 'pick a color!',
    // component props:
    slot: [
      { component: 'option', value: '', slot: '' },
      { component: 'option', value: 'red', slot: 'red' },
      { component: 'option', value: 'blue', slot: 'blue' },
      { component: 'option', value: 'green', slot: 'green' },
      { component: 'option', value: 'other', slot: 'other' },
    ],
    spread: true,
  },
]

/**
## Dynamic prop based on the value of the field

Eg. `subLabel: val => val === 'purple' ? 'nice!' : 'choose a color'`
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
