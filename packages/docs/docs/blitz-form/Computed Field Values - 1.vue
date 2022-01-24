<script setup>
import { ref } from 'vue'

const schema = [
  {
    id: 'firstName',
    component: 'input',
    label: 'First name',
  },
  {
    id: 'lastName',
    component: 'input',
    label: 'Last name',
  },
  {
    id: 'fullName',
    component: 'input',
    label: 'Full name (computed)',
    disabled: true,
    parseValue: (val, { formData }) =>
      `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
  },
]

const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm v-model="formData" :schema="schema" :columnCount="3" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
