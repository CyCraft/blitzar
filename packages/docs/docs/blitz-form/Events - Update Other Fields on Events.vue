<script setup>
import { ref } from 'vue'
const schema = [
  {
    id: 'tel',
    component: 'input',
    label: 'Phone nr (hyphenated)',
    subLabel: 'Type any number with `-` or `(  )`',
    events: {
      'update:modelValue': (val, { updateField }) =>
        updateField({ id: 'telClean', value: !val ? '' : val.replace(/[^\d]/g, '').trim() }),
    },
  },
  {
    id: 'telClean',
    component: 'input',
    label: 'Phone nr (only numbers)',
    subLabel: 'This field is automatically updated when you type in a phone nr on the left.',
    // component props:
    disabled: true,
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
