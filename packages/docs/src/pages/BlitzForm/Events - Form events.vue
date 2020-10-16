<template>
  <div>
    <BlitzForm
      :schema="schema"
      v-model="formData"
      @field-input="logFieldInput"
      @input="logFormInput"
      :columnCount="2"
    />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
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
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
    ],
  },
]

/**
## Form events

For all possible events take a look at the [Api Card](#api-blitz-form).

You can listen to the `@input` event on a `<BlitzForm />` which will trigger each time the formData is changed. This makes BlitzForm usable with v-model.

There is also an `@field-input` event you can listen to which will trigger every time you type something in a specific field.

Try typing a little in the example below:
 */
export default {
  components: { BlitzForm },
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
