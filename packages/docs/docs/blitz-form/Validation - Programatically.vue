<script setup>
import { ref } from 'vue'
import { validateFormPerSchema } from 'blitzar'
import 'blitzar/dist/style.css'
import { showToast } from '../../components/toasts'

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

const formData = ref({
  name: undefined,
  age: undefined,
  consent: undefined,
})
const resetFormCounter = ref(0)

function validateProgrammatically() {
  const result = validateFormPerSchema(formData.value, schema)
  const allGood = Object.values(result).every((res) => res === null)

  showToast(allGood ? 'All good!' : 'Errors remain', result)
}
function setFormData() {
  formData.value.name = 'Luca Ban'
  formData.value.age = 18
  formData.value.consent = true
  resetFormCounter.value++
}
function clearFormData() {
  formData.value.name = undefined
  formData.value.age = undefined
  formData.value.consent = undefined
  resetFormCounter.value++
}
</script>

<template>
  <div>
    <div style="margin-bottom: 1rem">
      <button @click="validateProgrammatically">validate Programmatically</button>
      <button @click="setFormData">Set Form Data</button>
      <button @click="clearFormData">Clear Form Data</button>
    </div>

    <BlitzForm
      :key="resetFormCounter"
      v-model="formData"
      showErrorsOn="never"
      :schema="schema"
      :columnCount="3"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
