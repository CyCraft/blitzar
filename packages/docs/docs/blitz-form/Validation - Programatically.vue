<template>
  <div>
    <div style="margin-bottom: 1rem">
      <button @click="validateProgrammatically">validate Programmatically</button>
      <button @click="setFormData">Set Form Data</button>
      <button @click="clearFormData">Clear Form Data</button>
    </div>

    <BlitzForm
      showErrorsOn="never"
      :schema="schema"
      v-model="formData"
      :columnCount="3"
      :key="resetFormCounter"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
import { validateFormPerSchema } from '@blitzar/form/src/components/validation'
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

export default {
  data() {
    const formData = {
      name: undefined,
      age: undefined,
      consent: undefined,
    }
    return { schema, formData, resetFormCounter: 0 }
  },
  methods: {
    validateProgrammatically() {
      const result = validateFormPerSchema(this.formData, this.schema)
      const allGood = Object.values(result).every((res) => res === null)

      showToast(allGood ? 'All good!' : 'Errors remain', result)
    },
    setFormData() {
      this.formData.name = 'Luca Ban'
      this.formData.age = 18
      this.formData.consent = true
      this.resetFormCounter++
    },
    clearFormData() {
      this.formData.name = undefined
      this.formData.age = undefined
      this.formData.consent = undefined
      this.resetFormCounter++
    },
  },
}
</script>
