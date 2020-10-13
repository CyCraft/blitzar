<template>
  <div>
    <BlitzForm
      :actionButtons="['edit', 'cancel', 'save', 'delete']"
      :actionButtonDefaults="actionButtonDefaults"
      :columnCount="2"
      :schema="schema"
      v-model="formData"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
import { showToast } from '../../helpers/toast'

const schema = [
  {
    id: 'name',
    component: 'input',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
  },
  {
    id: 'powerOrigin',
    component: 'select',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    name: 'powerOrigin',
    slot: [
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
    ],
  },
]

/**
## Overwriting pre-made buttons

You can overwrite how the pre-made buttons look with the `actionButtonDefaults` prop, as seen in the example below:
 */
export default {
  components: { BlitzForm },
  data() {
    const actionButtonDefaults = {
      archive: { icon: 'archive', showCondition: (_, { mode }) => mode !== 'edit' },
      delete: { icon: 'delete', showCondition: (_, { mode }) => mode !== 'edit' },
      edit: { icon: 'edit', flat: false, outline: true },
      save: { icon: 'save', color: 'green' },
    }
    return { schema, formData: {}, actionButtonDefaults }
  },
  methods: {
    onSave({ newData, oldData }) {
      showToast('@save newData', newData) // an object with only the updated fields
      showToast('@save oldData', oldData) // the original object with all the field values
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
