<script setup>
import { ref } from 'vue'
import { showToast } from '../../components/toasts'

const schema = [
  {
    id: 'enableLogging',
    component: 'input',
    type: 'checkbox',
    label: 'Enable logging',
    subLabel: 'shows hidden action button',
  },
  {
    id: 'name',
    component: 'input',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
    span: 2,
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
    span: 2,
  },
]

const actionButtons = [
  'cancel',
  'edit',
  'save',
  {
    component: 'button',
    type: 'button',
    slot: 'log the data',
    showCondition: (_, { formData }) => formData.enableLogging,
    events: {
      click: (event, { formData }) => showToast('formData', formData),
    },
  },
]
const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm
      v-model="formData"
      :actionButtons="actionButtons"
      :schema="schema"
      :columnCount="5"
    />
  </div>
</template>
