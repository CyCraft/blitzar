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
    return { schema, formData: {} }
  },
}
</script>

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
