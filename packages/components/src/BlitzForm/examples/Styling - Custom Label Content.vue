<script setup>
import BlitzForm from '../BlitzForm.vue'
import { ref } from 'vue'

const schema = [
  {
    id: 'example',
    component: 'input',
    label: 'Example of a label slot with extra text',
    slots: {
      label: {
        component: 'span',
        slot: '(extra text)',
        style: 'color: grey; padding-left: 0.5em',
      },
    },
  },
  {
    id: 'tooltip',
    component: 'input',
    label: 'Example of a label slot with a tooltip',
    slots: {
      label: {
        component: 'span',
        slot: {
          // Make sure to globally register the custom component!
          component: 'VueCustomTooltip',
          slot: 'ℹ️',
          label: `Hi! I'm a tooltip! Yiiiihaaaa`,
        },
      },
    },
  },
  {
    id: 'rainbows',
    component: 'input',
    label: 'Example of a label slot with multiple components',
    slots: {
      label: [
        { component: 'span', slot: 'double rainbow!!', style: 'color: grey; padding: 0 1em' },
        '🌈',
        { component: 'span', slot: '🌈', style: 'font-size: 2em' },
      ],
    },
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
