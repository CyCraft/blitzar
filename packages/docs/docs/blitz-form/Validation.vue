<template>
  <div>
    <BlitzForm
      :schema="schema"
      v-model="formData"
      :actionButtons="['cancel', 'edit', 'save']"
      :columnCount="3"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
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
    parseInput: Number,
    rules: [(val) => val >= 18 || 'You must be over 18'],
    type: 'number',
  },
  {
    id: 'consent',
    label: 'Do you agree with our terms?',
    component: 'input',
    type: 'checkbox',
    rules: [(val) => val || 'You must accept our terms'],
    defaultValue: false,
  },
]

export default {
  data() {
    return { schema, formData: {} }
  },
}
</script>
