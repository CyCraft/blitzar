<template>
  <div>
    <EasyForm :schema="schema" v-model="formData" :columnCount="3" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { EasyForm } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)

const schema = [
  {
    id: 'firstName',
    component: 'QInput',
    label: 'First name',
    outlined: true,
  },
  {
    id: 'lastName',
    component: 'QInput',
    label: 'Last name',
    outlined: true,
  },
  {
    id: 'fullName',
    component: 'QInput',
    label: 'Full name (computed)',
    disable: true,
    outlined: true,
    parseValue: (val, { formData }) =>
      `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
  },
]

/**
Computed fields are fields that can represent data which doesn't neccesarily exist in your data. They have a "caluculated value" based on the form data.

Do not confuse this concept with "Evaluated Props".
- Evaluated Props: a calculated prop of a field
- Computed Fields: a field with a calculated value

An example of a Computed Field could be a full name of a person which exists of `${formData.firstName} ${formData.lastName}`

There are three ways we could create such a field:

## The `parseValue` prop

```js
{
  id: 'fullName',
  component: 'QInput', // or any other component
  parseValue: (val, {formData}) => `${formData.firstName || ''} ${formData.lastName || ''}`
}
```

So even though the field `fullName` has no `value` at all, it will always stay in sync with the current `formData`.

When implementing a computed field this way however, `fullName` will never have that computed value emitted. This means that it won't be included in the EasyForm events: `@input`, `@field-input` and `@save`. So it's difficult to capture and save this calculated value alongside your other data. See the next tab for another method.
 */
export default {
  components: { EasyForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
