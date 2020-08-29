<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" />
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
    id: 'focusMe',
    component: 'QInput',
    label: 'Focus me',
    events: {
      focus: (val, { id, label }) =>
        Notify.create({ message: `focussed: 「${label}」`, caption: ` (field id: ${id})` }),
    },
  },
  {
    id: 'typeInMe',
    component: 'QInput',
    label: 'Type something',
    events: {
      input: (val, { $q }) => Notify.create(JSON.stringify(val)),
    },
  },
]

/**
## Form component events

Each form component can have a prop called `events`. This prop will be applied to the field like so: `v-on="events"`.

An `events` prop would look like so:
```js
events: {
  input: ($event, context) => { },
  focus: ($event, context) => { },
  // etc...
}
```

The benefits of passing your event listeners via the `events` prop are:
- Besides the typical `$event` parameter they receive as first parameter, they will receive a second `context` parameter.
- `context` is the Vue component reference of the form component, you can deconstruct this to access any other properties/values.
- `context` has useful props like: `$store`, `$router`, `formData`, `formDataFlat`, `mode`, `formId`, ... All of these are explained in the *"Evaluated Props" documentation*, so be sure to check that.
- `context` has a special function called `fieldInput` which can be used to modify other fields programatically.
- And all this can be set from inside a `<BlitzForm />`'s `schema` so you don't need add anything manually inside your templates.

Phew. That was a bit of a lot of information all at once. 😅 Let's look at an example:
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
