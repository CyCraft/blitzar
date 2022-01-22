<script setup>
import { ref } from 'vue'
const schema = [
  {
    id: 'color',
    span: true,
    component: 'select',
    label: 'What is your favorite color?',
    dynamicProps: ['subLabel'],
    subLabel: (val) =>
      val === 'red'
        ? 'like the sun'
        : val === 'blue'
        ? 'like the sky'
        : val === 'green'
        ? 'green is not a creative color'
        : val === 'other'
        ? 'oh, come on, just pick one'
        : 'pick a color!',
    // component props:
    slot: [
      { component: 'option', value: '', slot: 'Select one', disabled: true },
      { component: 'option', value: 'red', slot: 'red' },
      { component: 'option', value: 'blue', slot: 'blue' },
      { component: 'option', value: 'green', slot: 'green' },
      { component: 'option', value: 'other', slot: 'other' },
    ],
    spread: true,
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
