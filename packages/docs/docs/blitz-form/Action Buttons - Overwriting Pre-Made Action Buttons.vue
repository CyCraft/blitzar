<template>
  <div class="example-action-buttons-overwrite-style">
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

<style lang="sass">
.example-action-buttons-overwrite-style
  .my-button-class
    border: none
    background: none
    font-weight: 700
</style>

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

const actionButtonDefaults = {
  // you can pass a class to adjust the look of the button:
  edit: { slot: `✏️ Edit`, componentClasses: 'my-button-class' },
  // you can also directly adjust the style:
  cancel: { componentStyle: 'background: none; border: none;' },
  save: {
    slot: `💾 Save`,
    componentStyle: 'background: none; border: thin solid green; color: green',
  },
  delete: {
    componentStyle: 'background: none; border: none; color: crimson',
    showCondition: (_, { mode }) => mode !== 'edit',
  },
}

export default {
  components: { BlitzForm, CodeBlock },
  data() {
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
