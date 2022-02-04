<script setup>
import { ref } from 'vue'

const schema = [
  {
    id: 'name',
    component: 'BaseInput',
    label: 'Nickname',
    // component props:
    icon: 'person',
  },
  {
    id: 'height',
    component: 'BaseInput',
    label: 'Height',
    // component props:
    suffix: 'cm',
    type: 'number',
  },
  {
    id: 'description',
    component: 'BaseInput',
    label: 'Write something about yourself',
    span: 2,
    // component props:
    type: 'textarea',
    autogrow: true,
    icon: 'identification',
    clearable: true,
  },
]

const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm v-model="formData" :schema="schema" :columnCount="2" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
