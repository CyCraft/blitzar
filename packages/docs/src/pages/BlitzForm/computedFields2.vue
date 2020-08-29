<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="3" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
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
    events: {
      input: (val, { formData, fieldInput }) => {
        const { lastName = '' } = formData
        const value = `${val} ${lastName}`.trim()
        fieldInput({ id: 'fullName', value })
      },
    },
  },
  {
    component: 'QInput',
    label: 'Last name',
    id: 'lastName',
    outlined: true,
    events: {
      input: (val, { formData, fieldInput }) => {
        const { firstName = '' } = formData
        const value = `${firstName} ${val}`.trim()
        fieldInput({ id: 'fullName', value })
      },
    },
  },
  {
    id: 'fullName',
    component: 'QInput',
    label: 'Full name (computed)',
    disable: true,
    outlined: true,
  },
]

/**
## Update via `fieldInput`

It can be handy to also save the calculated value in your database so you can filter/search/sort on this field. (This is required when using eg. an [BlitzTable](https://quasar-blitz-tables.web.app) or QTable.)

In this case we can use the method called `fieldInput()` which is accessible on the context and first explained on the [events documentation page](/events).

```js
{
  id: 'firstName',
  events: {
    input: (val, {formData, fieldInput}) => {
      const { lastName = '' } = formData
      const value = `${val} ${lastName}`.trim()
      fieldInput({id: 'fullName', value})
    }
  },
},
{
  id: 'lastName',
  events: {
    input: (val, {formData, fieldInput}) => {
      const { firstName = '' } = formData
      const value = `${firstName} ${val}`.trim()
      fieldInput({id: 'fullName', value})
    }
  },
}
```

This method has pro's and con's though:

- PRO: you don't need to include the Computed Field (`fullName`) on the form at all
- CON: this is quite verbose...
- CON: it cannot be used if you need a computed field _not_ based on other fields (eg. a timestamp returning `new Date()`)
- CON: you cannot use this method to add a new "caluculated field" at a later time, when your database already has some data

There is also a third way we can create a computed field (see the last tab).
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
