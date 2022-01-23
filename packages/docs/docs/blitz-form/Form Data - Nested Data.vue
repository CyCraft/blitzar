<script setup>
import { ref } from 'vue'
import { showToast } from '../../components/toasts'

const schema = [
  {
    id: 'size.width',
    label: 'Width',
    component: 'input',
    parseInput: (val) => Number(val),
    // component props:
    type: 'number',
  },
  {
    id: 'size.depth',
    label: 'Depth',
    component: 'input',
    parseInput: (val) => Number(val),
    // component props:
    type: 'number',
  },
  {
    id: 'size.height',
    label: 'Height',
    component: 'input',
    parseInput: (val) => Number(val),
    // component props:
    type: 'number',
  },
]

function logupdateField(eventPayload) {
  showToast('@updateField', eventPayload)
}
function logFormInput(eventPayload, origin) {
  showToast('@update:modelValue', eventPayload, origin)
}

const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm
      v-model="formData"
      :schema="schema"
      :columnCount="3"
      @updateField="logupdateField"
      @update:modelValue="logFormInput"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
