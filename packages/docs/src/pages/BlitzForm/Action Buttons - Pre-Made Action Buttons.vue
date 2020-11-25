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

/**
## Pre-Made Action Buttons

Pre-made buttons can be added to your form by just passing the string of the button you want:

`:action-buttons="['edit', 'cancel', 'save', 'delete', 'archive']"`

When added you will see the buttons like the preview below. They each have a functionality:

- `'edit'` — adds a button that puts the form in "edit" mode
- `'cancel'` — adds a button that puts the form back into "view" mode & reverts any changes to the form data
- `'save'` — adds a button that puts the form back into "view" mode & keeps the modified content
- `'delete'` `'archive'` — adds a button that emits a delete or archive event (you must implement your own logic)

The buttons that are added emit the events: `@edit` `@cancel` `@save` `@delete` `@archive`

You can listen for these events on the `<BlitzForm />` to use do things like:
- saving data to a DB when save is clicked
- moving a popup when cancel is clicked
- clear the form data (`value`) when delete is clicked

The `@save` event receives a payload with the new and old form data.

- `@save="onSave"`

Play with the pre-made action buttons below and see what happens:
 */
export default {
  components: { BlitzForm },
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
