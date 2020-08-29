<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="2" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QToggle } from 'quasar'
import Vue from 'vue'
Vue.component('QToggle', QToggle)

const schema = [
  {
    id: 'over18',
    component: 'QToggle',
    default: false,
    label: 'Are you over 18?',
  },
  {
    id: 'parentalConsent',
    component: 'QToggle',
    default: false,
    label: 'Do you have parental consent?',
    subLabel: 'This will be disabled when the first question is `true`.',
    evaluatedProps: ['disable'],
    // component props:
    disable: (val, { formData }) => formData.over18,
  },
]

/**
## Dynamic prop based on the value of "another" field

Eg. `disable: (val, {formData}) => formData.over18`
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
