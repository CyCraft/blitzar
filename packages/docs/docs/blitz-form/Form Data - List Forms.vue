<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
import { CodeBlock } from '@planetar/code-block'
import { markRaw } from 'vue'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'
import BlitzListForm from '../../../form/src/components/BlitzListForm.vue'

const schema = [
  {
    id: 'classroomName',
    label: 'Classroom Name',
    component: 'input',
  },
  {
    id: 'students',
    label: 'Student Names',
    component: markRaw(BlitzListForm),
    schema: [
      { id: 'nameFirst', label: 'First Name', component: 'input' },
      { id: 'nameLast', label: 'Last Name', component: 'input' },
    ],
  },
]

export default {
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
  methods: {},
}
</script>
