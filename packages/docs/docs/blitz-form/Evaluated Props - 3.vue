<template>
  <div>
    <BlitzForm
      :schema="schema"
      v-model="formData"
      :actionButtons="['edit', 'save']"
      :columnCount="2"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
import { CodeBlock } from '@planetar/code-block'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'

const schema = [
  {
    id: 'car',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
    label: 'Do you have a car?',
  },
  {
    id: 'carType',
    component: 'input',
    label: 'What is the brand?',
    subLabel: 'This is only shown when the first question is `true`.',
    evaluatedProps: ['showCondition'],
    showCondition: (val, { formData }) => formData.car,
  },
  {
    id: 'carNrPlate',
    component: 'input',
    label: 'Enter your license plate brand?',
    subLabel: "This is hidden when the form is set to 'view' mode. Try clicking 'save'.",
    evaluatedProps: ['showCondition'],
    showCondition: (val, { formData, mode }) => formData.car && mode === 'edit',
  },
]

export default {
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
}
</script>
