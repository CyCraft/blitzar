<template>
  <div>
    <BlitzForm
      :schema="schema"
      v-model="formData"
      :actionButtons="['edit', 'save']"
      :columnCount="2"
    />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

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

/**
## Dynamic "conditional rendering" of a field

Eg. `showCondition: (val, {formData}) => formData.car`

`showCondition` is a special prop that can only be used inside the schema of a BlitzForm.
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
