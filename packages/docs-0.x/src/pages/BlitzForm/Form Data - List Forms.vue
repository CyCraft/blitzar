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
## List Forms

In some cases you might need a form that's actually a "list" users can fill in. Eg. Have a form where a teacher can write down names of students in a list.

For this I prepared a special kind of form called a **BlitzListForm** that offers these features:
- Auto populates the next empty field whenever there is user input
- Can be used as standalone component or inside a BlitzForm as a field
- Saves the data as an array

See it in action in the example down here! Write down some student names to see the `formData` update.

(for more examples check out the [dedicated documentation](/docs/blitz-list-form) on BlitzListForm)
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
  methods: {},
}
</script>
