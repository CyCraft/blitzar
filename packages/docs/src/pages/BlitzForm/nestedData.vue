<template>
  <div>
    <BlitzForm
      :schema="schema"
      :columnCount="3"
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
import { Notify, QInput } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)

const schema = [
  {
    id: 'size.width',
    label: 'Width',
    component: 'QInput',
    parseInput: Number,
    // component props:
    type: 'number',
    suffix: 'cm',
  },
  {
    id: 'size.depth',
    label: 'Depth',
    component: 'QInput',
    parseInput: Number,
    // component props:
    type: 'number',
    suffix: 'cm',
  },
  {
    id: 'size.height',
    label: 'Height',
    component: 'QInput',
    parseInput: Number,
    // component props:
    type: 'number',
    suffix: 'cm',
  },
]

/**
A &#60;BlitzForm /&#62; can use a nested data structure on a flat form schema. When you have a nested data structure you will need to appoint each field ID with dot notation.

Eg. a field with ID `size.width` points to `{size: {width}}` in your data.

Besides writing your field IDs with dot notation, nothing further needs to be done.

The only thing you need to be careful with is the `@field-input` event:
- Listening to the `@input` event will always return the full data nested
- Listening to the `@field-input` event will always have the field ID with dot-notation in its payload.

Try typing something in the example below:
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
