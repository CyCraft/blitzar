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
    component: 'input',
    label: 'First name',
  },
  {
    id: 'lastName',
    component: 'input',
    label: 'Last name',
  },
  {
    id: 'fullName',
    component: 'input',
    label: 'Full name (computed)',
    disabled: true,
    parseValue: (val, { formData }) =>
      `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
  },
]

/**
## The `parseValue` prop

```js
{
  id: 'fullName',
  component: 'input',
  parseValue: (val, {formData}) => `${formData.firstName || ''} ${formData.lastName || ''}`
}
```

So even though the field `fullName` has no `value` at all, it will always stay in sync with the current `formData`.

When implementing a computed field this way however, `fullName` will never have that computed value emitted. This means that it won't be included in the BlitzForm events: `@input`, `@field-input` and `@save`. So it's difficult to capture and save this calculated value alongside your other data. See the next tab for another method.
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
