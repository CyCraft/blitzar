<template>
  <div>
    <BlitzForm
      :actionButtons="actionButtons"
      :schema="schema"
      v-model="formData"
      :columnCount="5"
    />
  </div>
</template>



<script>
import { CodeBlock } from '@planetar/code-block'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'
import { showToast } from '../../../docs-0.x/src/helpers/toast'

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
      { component: 'option', value: '', slot: '' },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
    span: 2,
  },
]

export default {
  components: { BlitzForm, CodeBlock },
  data() {
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
    return { schema, formData: {}, actionButtons }
  },
}
</script>
