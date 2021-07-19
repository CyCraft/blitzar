<template>
  <div>
    <BlitzForm
      mode="view"
      :schema="schema"
      v-model="formData"
      :columnCount="2"
      :actionButtons="actionButtons"
    />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

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
## Resetting the Form

A BlitzForm automatically makes a backup of form data so you can "cancel an edit".

In the example below there is a form with data. Try clicking "edit", then modify some data, then click "cancel".
 */
export default {
  components: { BlitzForm },
  data() {
    return {
      schema,
      formData: {
        name: 'Thor Odinson',
        powerOrigin: 'self',
      },
      actionButtons: ['cancel', 'save', 'edit'],
    }
  },
}
</script>
