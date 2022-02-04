<script setup>
import BlitzForm from '../BlitzForm.vue'
import { markRaw, ref } from 'vue'
import BlitzInput from '../../BlitzInput/BlitzInput.vue'

const schema = [
  {
    id: 'username',
    component: markRaw(BlitzInput),
    label: 'Email',
    // component props:
    placeholder: 'you@email.com',
    autocomplete: 'username',
  },
  {
    id: 'password',
    component: markRaw(BlitzInput),
    label: 'Password',
    // component props:
    type: 'password',
    autocomplete: 'new-password',
  },
]

const formData = ref({})
</script>

<template>
  <div>
    <form>
      <BlitzForm v-model="formData" :schema="schema" :columnCount="2" />
    </form>

    <pre><code>{{`// formData\n${JSON.stringify(formData, undefined, 2)}`}}</code></pre>
  </div>
</template>
