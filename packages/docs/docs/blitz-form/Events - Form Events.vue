<script setup>
import { ref } from 'vue'
import { showToast } from '../../components/toasts'

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
      :columnCount="2"
      :schema="schema"
      @updateField="logupdateField"
      @update:modelValue="logFormInput"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
