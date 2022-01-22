<script setup>
import { ref } from 'vue'
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
    dynamicProps: ['disabled'],
    // component props:
    disabled: (val, { formData }) => !formData.under18,
  },
]

const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm v-model="formData" :schema="schema" :columnCount="2" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
