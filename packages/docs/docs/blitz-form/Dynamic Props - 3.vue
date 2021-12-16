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
    dynamicProps: ['showCondition'],
    showCondition: (val, { formData }) => formData.car,
  },
  {
    id: 'carNrPlate',
    component: 'input',
    label: 'Enter your license plate',
    subLabel: "This is hidden when the form is set to 'view' mode. Try clicking 'save'.",
    dynamicProps: ['showCondition'],
    showCondition: (val, { formData, mode }) => formData.car && mode === 'edit',
  },
]

export default {
  data() {
    return { schema, formData: {} }
  },
}
</script>
