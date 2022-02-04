<script setup>
import BlitzForm from '../BlitzForm.vue'
import BlitzListForm from '../../BlitzListForm/BlitzListForm.vue'
import { markRaw, ref } from 'vue'

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

const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm v-model="formData" :schema="schema" />

    <pre><code>{{`// formData\n${JSON.stringify(formData, undefined, 2)}`}}</code></pre>
  </div>
</template>
