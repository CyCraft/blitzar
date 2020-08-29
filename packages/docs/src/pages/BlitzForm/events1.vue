<template>
  <div>
    <BlitzForm
      :schema="schema"
      v-model="formData"
      @field-input="logFieldInput"
      @input="logFormInput"
    />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput, Notify } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)

const schema = [
  {
    id: 'name',
    component: 'QInput',
    label: 'Superhero name',
    outlined: true,
  },
  {
    id: 'power',
    component: 'QInput',
    label: 'Superhero power',
    outlined: true,
  },
]

/**
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
      Notify.create({ message: '@field-input', caption: JSON.stringify(eventPayload) })
    },
    logFormInput(eventPayload) {
      Notify.create({ message: '@input', caption: JSON.stringify(eventPayload) })
    },
  },
}
</script>
