<script setup>
import BlitzListForm from '../BlitzListForm.vue'
import { ref } from 'vue'

const schema = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]
const formData = ref([])
</script>

<template>
  <div>
    <strong>Student Names</strong><br /><br />

    <BlitzListForm v-model="formData" :schema="schema" />

    <pre><code>{{`// formData\n${JSON.stringify(formData, undefined, 2)}`}}</code></pre>
  </div>
</template>
