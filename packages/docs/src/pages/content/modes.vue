<template>
  <div>
    <EasyForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData" :code="formData" />
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { EasyForm } from '@blitzar/form'
// All components that are used in the form need to be globally registered.
import { QInput, QSelect } from 'quasar'
import Vue from 'vue'
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
EasyForm has four modes:
- `'view'`: Show fields based on the schema; but make each field `readonly: true`.
- `'edit'`: Show editable fields based on the schema
- `'add'`: The same as 'edit'
- `'raw'`: Used to show raw data of your form. No fields are generated, just divs with the labels and values. This mode is powerful because it will automatically map values to the schema provided (eg. adding pre-/suffix; mapping to options of a select; etc.)

When in 'view' mode, EasyForm can be used to just show data. These buttons can also be disabled and by providing a custom mode you can keep the form in a certain mode forever.
 */
export default {
  components: { EasyForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
