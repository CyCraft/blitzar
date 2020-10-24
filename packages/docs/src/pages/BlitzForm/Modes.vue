<template>
  <div>
    Mode:
    <select name="mode" id="mode" v-model="mode" class="q-mb-md">
      <option value="edit">edit</option>
      <option value="view">view</option>
      <option value="disabled">disabled</option>
      <option value="raw">raw</option>
      <option value="add">add</option>
    </select>
    <BlitzForm :schema="schema" v-model="formData" :mode="mode" :columnCount="2" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

import Vue from 'vue'

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
    component: 'select',
    slot: [
      { component: 'option', value: '', slot: '' },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
  },
  {
    id: 'stamina',
    component: 'input',
    type: 'range',
    label: 'Stamina',
    parseInput: Number,
    default: 50,
    min: 0,
    max: 100,
  },
  {
    id: 'consent',
    component: 'input',
    type: 'checkbox',
    label: 'Do you agree with our terms?',
    default: false,
  },
]

/**
# Modes

BlitzForm has five modes:
- `'edit'`: (default) Show editable fields based on the schema
- `'view'`: Show each field with `readonly: true`.
- `'disabled'`: Show each field with `disabled: true`.
- `'raw'`: Used to show raw data of your form. No fields are generated, just divs with the labels and values. This mode is powerful because it will automatically map values to the schema provided (eg. adding pre-/suffix; mapping to options of a select; etc.)
- `'add'`: The same as 'edit'

The same schema to render a form can be re-used to just display form data as well. Your form schema is therefore very versatile!

Please note however, that in order for 'view' mode to work, you will need to make sure that all components you use in your form, have proper handling when BlitzForm passes `readonly: true` to them.

With the HTML5 elements seen in the example below, _only_ the input element understands `readonly: true`. Try switching the mode to 'view' and you will see that all other fields are still editable; so you'll need to use Vue components that handle `readonly: true`, or write wrapper Vue components for these HTML5 elements.
 */
export default {
  components: { BlitzForm },
  data() {
    return {
      schema,
      mode: 'view',
      formData: {
        name: 'Johnny Silverhand',
        powerOrigin: 'self',
      },
    }
  },
}
</script>
