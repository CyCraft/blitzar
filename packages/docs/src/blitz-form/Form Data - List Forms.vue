<script setup>
import { ref } from 'vue'

const schema = [
  {
    id: 'classroomName',
    label: 'Classroom Name',
    component: 'input',
  },
  {
    id: 'students',
    label: 'Student Names',
    component: 'BlitzListForm',
    schema: [
      { id: 'nameFirst', label: 'First Name', component: 'input' },
      { id: 'nameLast', label: 'Last Name', component: 'input' },
    ],
  },
]

const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm v-model="formData" :schema="schema" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
