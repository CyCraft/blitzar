<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm, BlitzListForm } from 'blitzar'

const schema = [
  {
    id: 'classroomName',
    label: 'Classroom Name',
    component: 'input',
  },
  {
    id: 'students',
    label: 'Student Names',
    component: BlitzListForm,
    schema: [
      { id: 'nameFirst', label: 'First Name', component: 'input' },
      { id: 'nameLast', label: 'Last Name', component: 'input' },
    ],
  },
]

/**
# BlitzForm Example

You can use the BlitzListForm inside a BlitzForm. See how that's done in this example:
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
  methods: {},
}
</script>
