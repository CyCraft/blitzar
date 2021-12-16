<template>
  <div>
    <BlitzForm
      :schema="schema"
      v-model="formData"
      @update-field="logupdateField"
      @update:modelValue="logFormInput"
      :columnCount="2"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
import { showToast } from '../../components/toasts'

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
      { component: 'option', value: '', slot: 'Select one', disabled: true },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
  },
]

export default {
  data() {
    return { schema, formData: {} }
  },
  methods: {
    logupdateField(eventPayload) {
      showToast('@update-field', eventPayload)
    },
    logFormInput(eventPayload, origin) {
      showToast('@update:modelValue', eventPayload, origin)
    },
  },
}
</script>
