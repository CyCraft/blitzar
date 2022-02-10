<script setup>
import { ref } from 'vue'
import { showToast } from '../.vitepress/theme/toasts'

const schema = [
  {
    id: 'focusMe',
    component: 'input',
    label: 'Focus me',
    events: {
      focus: (val, { id, label }) => showToast(`focussed: 「${label}」`, ` (field id: ${id})`),
    },
  },
  {
    id: 'typeInMe',
    component: 'input',
    label: 'Type something',
    events: {
      'update:modelValue': (val) => showToast('Typed:', val),
    },
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
