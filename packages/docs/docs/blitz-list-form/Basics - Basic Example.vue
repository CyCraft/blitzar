<template>
  <div>
    <b>Student Names</b>
    <BlitzListForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzListForm } from 'blitzar'

const schema = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]

export default {
  components: { BlitzListForm },
  data() {
    return { schema, formData: [] }
  },
  methods: {},
}
</script>
