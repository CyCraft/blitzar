<script>
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

export default {
  data() {
    return { schema, formData: {} }
  },
  methods: {
    onSave({ newData, oldData, formData }) {
      showToast('@save `newData`', newData) // an object with only the updated fields
      showToast('@save `oldData`', oldData) // the original object with all the field values
      showToast('@save `formData`', formData) // the formData in its current state
      // do something...
    },
    onDelete() {
      showToast(`clicked 'delete'`)
    },
  },
}
</script>

<template>
  <div>
    <BlitzForm
      :actionButtons="['edit', 'cancel', 'save', 'delete']"
      :columnCount="2"
      :schema="schema"
      v-model="formData"
      @save="(payload) => onSave(payload)"
      @delete="() => onDelete()"
    />
  </div>
</template>
