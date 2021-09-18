<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="3" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
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

export default {
  data() {
    return { schema, formData: {} }
  },
}
</script>
