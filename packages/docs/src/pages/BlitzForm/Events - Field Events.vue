<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="2" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
import { showToast } from '../../helpers/toast'

const schema = [
  {
    id: 'focusMe',
    component: 'input',
    label: 'Focus me',
    events: {
      focus: (val, { id, label }) => showToast(`focussed: 「${label}」`, ` (field id: ${id})`),
    },
  },
  {
    id: 'typeInMe',
    component: 'input',
    label: 'Type something',
    events: {
      input: (val) => showToast('Typed:', val),
    },
  },
]

/**
## Field Events

Each component in a form can have a prop called `events`. This prop will be applied to the field like so: `v-on="events"`.

An `events` prop would look like so:
```js
events: {
  input: ($event, context) => { },
  focus: ($event, context) => { },
  // etc...
}
```

Please note these things about events you set in your schema:
- Besides the typical `$event` parameter events receive (like `MouseClickEvent`), they will receive a second `context` parameter
- `context` is the Vue component reference of the BlitzForm component, you can use this to access other properties/values
- `context` has useful props like: `formData`, `formDataFlat`, `mode`, `formId`, ... All of these are explained in the [Evaluated Props documentation](#evaluated-props), so be sure to check that
- `context` has a special function called `fieldInput` which can be used to modify other fields programatically

Phew. That was a bit of a lot of information all at once. 😅 Let's look at an example:
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
