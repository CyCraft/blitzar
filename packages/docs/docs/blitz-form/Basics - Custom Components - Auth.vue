<script setup>
import { ref } from 'vue'
const schema = [
  {
    id: 'username',
    component: 'BaseInput',
    label: 'Email',
    // component props:
    placeholder: 'you@email.com',
    autocomplete: 'username',
  },
  {
    id: 'password',
    component: 'BaseInput',
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

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
