<template>
  <div>
    <strong>Student Names</strong><br /><br />

    <BlitzListForm :schema="schema" v-model="formData" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
const schema = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]

export default {
  data() {
    return { schema, formData: [] }
  },
  methods: {},
}
</script>
