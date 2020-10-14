<template>
  <div>
    <select name="mode" id="mode" v-model="mode" class="q-mb-md">
      <option value="edit">edit</option>
      <option value="view">view</option>
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
# Modes

BlitzForm has four modes:
- `'edit'`: (default) Show editable fields based on the schemai
- `'view'`: Show fields based on the schema; but make each field `readonly: true`.
- `'raw'`: Used to show raw data of your form. No fields are generated, just divs with the labels and values. This mode is powerful because it will automatically map values to the schema provided (eg. adding pre-/suffix; mapping to options of a select; etc.)
- `'add'`: The same as 'edit'

When in 'view' or 'raw' mode, BlitzForm can be used to just show data.

Please note that for 'raw' mode you will need to register an extra component. Please check the "script" tab.
 */
export default {
  components: { BlitzForm },
  data() {
    return {
      schema,
      mode: 'edit',
      formData: {
        name: 'Johnny Silverhand',
        powerOrigin: 'self',
      },
    }
  },
}
</script>
