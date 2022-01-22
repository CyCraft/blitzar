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

function onSave({ newData, oldData, formData }) {
  showToast('@save `newData`', newData) // an object with only the updated fields
  showToast('@save `oldData`', oldData) // the original object with all the field values
  showToast('@save `formData`', formData) // the formData in its current state
  // do something...
}
function onDelete() {
  showToast(`clicked 'delete'`)
}
const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm
      v-model="formData"
      :actionButtons="['edit', 'cancel', 'save', 'delete']"
      :columnCount="2"
      :schema="schema"
      @save="(payload) => onSave(payload)"
      @delete="() => onDelete()"
    />
  </div>
</template>
