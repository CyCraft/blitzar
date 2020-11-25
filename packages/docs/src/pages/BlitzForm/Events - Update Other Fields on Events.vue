<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="2" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

const schema = [
  {
    id: 'tel',
    component: 'input',
    label: 'Phone nr (hyphenated)',
    subLabel: 'Type any number with `-` or `(  )`',
    events: {
      input: (val, { fieldInput }) =>
        fieldInput({ id: 'telClean', value: !val ? '' : val.replace(/[^\d]/g, '').trim() }),
    },
  },
  {
    id: 'telClean',
    component: 'input',
    label: 'Phone nr (only numbers)',
    subLabel: 'This field is automatically updated when you type in a phone nr on the left.',
    // component props:
    disabled: true,
  },
]

/**
## Update Other Fields on Events

Here we see an example of one field updating the contents of another on the input event.
```js
events: {
  input: (val, {fieldInput}) => {
    // get only digits from input
    const value = !val ? '' : val.replace(/[^\d]/g, '').trim()

    // set field 'telClean' to this value
    fieldInput({id: 'telClean', value})
  }
}
```

The `fieldInput` function can be used to update other fields inside your form. It receives a single parameter which should be an object that looks like `{id, value}` with the `id` of the field you want to update and a `value` you want to update it with.

Be sure to also check the documentation on [Computed Fields](#computed-fields) as well.
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
