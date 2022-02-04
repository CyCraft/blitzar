<script setup>
import { ref } from 'vue'

const schema = [
  {
    id: 'name',
    label: 'Name',
    component: 'input',
    required: true,
  },
  {
    id: 'age',
    label: 'Age',
    component: 'input',
    type: 'number',
    parseInput: (val) => Number(val),
    dynamicProps: ['error'],
    error: (val) => (Number(val) >= 18 ? null : 'You have to be over 18!'),
  },
  {
    id: 'consent',
    label: 'Do you agree with our terms?',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
    dynamicProps: ['error'],
    error: (val) => (val === true ? null : 'You must accept our terms'),
  },
]

const showErrorsOn = ref('save')
const formData = ref({})
</script>

<template>
  <div>
    showErrorsOn:
    <select
      id="showErrorsOn"
      v-model="showErrorsOn"
      name="showErrorsOn"
      style="margin-bottom: 1rem"
    >
      <option value="interaction">interaction</option>
      <option value="save">save</option>
      <option value="save-focus">save-focus</option>
      <option value="never">never</option>
      <option value="always">always</option>
    </select>

    <BlitzForm
      v-model="formData"
      :showErrorsOn="showErrorsOn"
      :schema="schema"
      :actionButtons="['cancel', 'edit', 'save']"
      :columnCount="3"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
