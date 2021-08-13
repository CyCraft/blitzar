<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="2" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
import { CodeBlock } from '@planetar/code-block'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'

const schema = [
  {
    id: 'under18',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
    label: 'Are you under 18?',
  },
  {
    id: 'parentalConsent',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
    label: 'Do you have parental consent?',
    subLabel: 'Only applicable when under 18',
    evaluatedProps: ['disabled'],
    // component props:
    disabled: (val, { formData }) => !formData.under18,
  },
]

export default {
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
}
</script>
