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
## Pre-made action buttons

Pre-made buttons can be added to your form by just passing the string of the button you want:

`:action-buttons="['edit', 'cancel', 'save', 'delete', 'archive']"`

When added you will see the buttons like the preview below. They each have a functionality:

- `'edit'`: Adds a button that puts the form in "edit" mode
- `'cancel'`: Adds a button that puts the form back into "view" mode & reverts the content to its original state
- `'save'`: Adds a button that puts the form back into "view" mode & keeps the modified content
- `'delete'` & `'archive'`: Adds a button that emits a delete or archive event (you must implement your own logic)

The buttons above emits the events: `@edit`, `@cancel`, `@save`, `@delete`, `@archive`

You can listen for these events on the `<BlitzForm />` to use do things like:
- saving data to a DB when "save" is clicked
- moving a popup when 'cancel' is clicked
- clear the form data (`value`) when 'delete' is clicked

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
