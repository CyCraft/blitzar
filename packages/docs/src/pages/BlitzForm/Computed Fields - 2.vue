<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="3" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

const schema = [
  {
    id: 'firstName',
    label: 'First name',
    component: 'input',
    events: {
      input: (val, { formData, fieldInput }) => {
        const { lastName = '' } = formData
        const value = `${val} ${lastName}`.trim()
        fieldInput({ id: 'fullName', value })
      },
    },
  },
  {
    id: 'lastName',
    label: 'Last name',
    component: 'input',
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
    label: 'Full name (computed)',
    component: 'input',
    disabled: true,
  },
]

/**
## Update via `fieldInput`

It can be handy to also save the calculated value in your database so you can filter/search/sort on this field.

In this case we can use the method called `fieldInput()` which is accessible on the context and first explained on the [events documentation page](#events).

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
- CON: when your database already has data, you cannot use this without manually updating what's already in your database
- CON: if you want to save the computed field to your database, you have to include this computed field in all forms the user can edit this data
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
/**
There is also a third way we can create a computed field.
 */
</script>
