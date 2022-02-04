<script setup>
import BlitzForm from '../BlitzForm.vue'
import { ref } from 'vue'

const schema = [
  {
    id: 'myInput',
    label: 'Type something',
    component: 'input',
  },
  {
    label: 'a div showing the same content as the input',
    component: 'div',
    slot: (val, { formData }) => formData.myInput,
    dynamicProps: ['slot'],
    componentStyle: 'border: dashed thin goldenrod; padding: 2em',
  },
]

const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm :schema="schema" />
  </div>
</template>
