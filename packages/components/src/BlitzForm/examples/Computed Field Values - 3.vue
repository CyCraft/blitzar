<script setup>
import BlitzForm from '../BlitzForm.vue'
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
    parseValue: (val, { formData, updateField }) => {
      const value = `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
      if (val !== value) updateField({ id: 'fullName', value })
      return value
    },
  },
]

const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm v-model="formData" :schema="schema" :columnCount="3" />

    <pre><code>{{`// formData\n${JSON.stringify(formData, undefined, 2)}`}}</code></pre>
  </div>
</template>
