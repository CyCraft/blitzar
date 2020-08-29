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
    parseValue: (val, { formData, fieldInput }) => {
      const value = `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
      if (val !== value) fieldInput({ id: 'fullName', value })
      return value
    },
  },
]

/**
## Combine `parseValue` & `fieldInput`

The third way to create a computed field is this:

```js
{
  id: 'fullName',
  component: 'QInput', // or any other component
  parseValue: (val, {formData, fieldInput}) => {
    const value = `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
    if (val !== value) fieldInput({id: 'fullName', value})
    return value
  },
  // If you want to hide the computed field you can set:
  // showCondition: false
}
```

Basically you write your logic inside the `parseValue` prop of your computed field, and also trigger a `fieldInput` action from within here.

However, as the more experienced developers will notice...
:::
This is the same as introducing a side-effect to a computed property! By design this is discouraged, so isn't this bad?
:::

I say "nay". The reason it is discouraged is because side-effects to computed properties that modify data are impossible to track. In a few months if you don't know why a certain value is being modified, you'll have a hard time finding eventually it was the side-effect from a computed property.

If we understand this reason, then in our case, it is perfectly valid to do so, because we are only modifying the data of the field we are describing right there. We are simply doing something equivalent to triggering a `emit('input', val)` on a component manually, nothing wrong with that.

However, keep in mind that also this method has its own pro's and con's:
- PRO: it can be used as stand-alone, without relying on other fields & without the need to render other fields
- PRO: because it just uses `parseValue` it's less verbose (opposed to listening to input events of other fields)
- PRO: the logic for this field is contained in its own options object
- PRO: even if your database already has data, a computed field like this can be added at a later date
- CON: you have to include this "Computed Field" in all forms the user can edit the related fields (and probably with `showCondition: false`)
 */
export default {
  components: { EasyForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
