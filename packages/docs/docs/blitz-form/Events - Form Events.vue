<template>
  <div>
    <BlitzForm
      :schema="schema"
      v-model="formData"
      @field-input="logFieldInput"
      @input="logFormInput"
      :columnCount="2"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

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

export default {
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
  methods: {
    logFieldInput(eventPayload) {
      showToast('@field-input', eventPayload)
    },
    logFormInput(eventPayload, origin) {
      showToast('@input', eventPayload, origin)
    },
  },
}
</script>
