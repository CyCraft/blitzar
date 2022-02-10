<script setup>
import { markRaw, ref } from 'vue'
import { BlitzInput } from 'blitzar'

const schema = [
  {
    id: 'name',
    component: markRaw(BlitzInput),
    label: 'Nickname',
    // component props:
    icon: 'person',
  },
  {
    id: 'height',
    component: markRaw(BlitzInput),
    label: 'Height',
    // component props:
    suffix: 'cm',
    type: 'number',
  },
  {
    id: 'description',
    component: markRaw(BlitzInput),
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
