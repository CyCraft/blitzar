<template>
  <div>
    <BlitzForm
      :actionButtons="['edit', 'cancel', 'save', 'delete']"
      :columnCount="2"
      :schema="schema"
      v-model="formData"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import { CodeBlock } from '@planetar/code-block'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'
import { showToast } from '../../../docs-0.x/src/helpers/toast'

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
      { component: 'option', value: '', slot: '' },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
  },
]

export default {
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
  methods: {
    onSave({ newData, oldData }) {
      showToast('@save', { newData, oldData })
      // if you need a combination of both:
      const newFormData = { ...oldData, ...newData }
      // do something with newFormData...
    },
    onDelete() {
      showToast(`clicked 'delete'`)
    },
  },
}
</script>
