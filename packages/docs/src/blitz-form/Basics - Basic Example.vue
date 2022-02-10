<script setup>
import { ref } from 'vue'

const schema = [
  {
    id: 'name',
    component: 'input',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
  },
  {
    id: 'powerOrigin',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    component: 'select',
    slot: [
      { component: 'option', value: '', slot: 'Select one', disabled: true },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
  },
]
const formData = ref({})
</script>

<template>
  <div>
    <blitz-form v-model="formData" :schema="schema" :columnCount="2" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<style>
/* This example has no styling */
</style>
