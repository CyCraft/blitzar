<template>
  <div>
    <select name="mode" id="mode" v-model="mode" class="q-mb-md">
      <option value="edit">edit</option>
      <option value="view">view</option>
      <option value="raw">raw</option>
      <option value="add">add</option>
    </select>
    <BlitzForm :schema="schema" v-model="formData" :mode="mode" />
    <PreviewCode comment="formData" :code="formData" />
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm, BlitzDiv } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput, QSelect } from 'quasar'
import Vue from 'vue'
Vue.component('BlitzDiv', BlitzDiv)
Vue.component('QInput', QInput)
Vue.component('QSelect', QSelect)

const schema = [
  {
    id: 'name',
    component: 'QInput',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
    outlined: true,
  },
  {
    id: 'powerOrigin',
    component: 'QSelect',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    options: [
      { label: 'Mutation', value: 'mutation' },
      { label: 'Self taught', value: 'self' },
      { label: 'Magic item', value: 'item' },
    ],
    outlined: true,
    emitValue: true,
    mapOptions: true,
  },
]

/**
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
