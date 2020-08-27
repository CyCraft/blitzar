<template>
  <div>
    <EasyForm
      :schema="schema"
      v-model="formData"
      :actionButtons="['cancel', 'edit', 'save']"
      :columnCount="3"
    />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { EasyForm } from '@blitzar/form'
// All components that are used in the form need to be globally registered.
import { QInput, QToggle } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)
Vue.component('QToggle', QToggle)

const schema = [
  {
    id: 'name',
    label: 'Name',
    component: 'QInput',
    // component props:
    required: true,
  },
  {
    id: 'age',
    label: 'Age',
    component: 'QInput',
    parseInput: Number,
    rules: [(val) => val >= 18 || 'You must be over 18'],
    // component props:
    type: 'number',
  },
  {
    id: 'consent',
    label: 'Do you agree with our terms?',
    component: 'QToggle',
    rules: [(val) => val || 'You must accept our terms'],
    default: false,
  },
]

/**
EasyForms have validation enabled by default when clicking the save button or when executing `validate` on the EasyForm ref.
 */
export default {
  components: { EasyForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
