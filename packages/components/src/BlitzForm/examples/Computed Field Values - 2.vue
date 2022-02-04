<script setup>
import BlitzForm from '../BlitzForm.vue'
import { ref } from 'vue'

const schema = [
  {
    id: 'firstName',
    label: 'First name',
    component: 'input',
    events: {
      'update:modelValue': (val, { formData, updateField }) => {
        const { lastName = '' } = formData
        const value = `${val} ${lastName}`.trim()
        updateField({ id: 'fullName', value })
      },
    },
  },
  {
    id: 'lastName',
    label: 'Last name',
    component: 'input',
    events: {
      'update:modelValue': (val, { formData, updateField }) => {
        const { firstName = '' } = formData
        const value = `${firstName} ${val}`.trim()
        updateField({ id: 'fullName', value })
      },
    },
  },
  {
    id: 'fullName',
    label: 'Full name (computed)',
    component: 'input',
    disabled: true,
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
