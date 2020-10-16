<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="3" :key="resetFormCounter" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm, validateFormPerSchema } from 'blitzar'
import { showToast } from '../../helpers/toast'

/**
There is also the possibility to do programatic validation. BlitzForms provides a helper function which can be used without the need of rendering the form at all. It can be used like so:
```js
import { validateFormPerSchema } from 'blitzar'

validateFormPerSchema(formData, schema)
```
 */
export default {
  components: { BlitzForm },
  data() {
    const formData = {
      name: undefined,
      age: undefined,
      consent: undefined,
    }
    const schema = [
      {
        component: 'button',
        type: 'button',
        slot: 'validate Programmatically',
        events: {
          click: () => {
            const result = validateFormPerSchema(this.formData, this.schema)
            const errorsRemain = Object.values(result).some((r) => r !== true)
            showToast(errorsRemain ? 'Errors remain' : 'All good!', result)
            console.log('validateFormPerSchema(this.formData, this.schema) → \n', result)
          },
        },
      },
      {
        component: 'button',
        type: 'button',
        slot: 'Set Form Data',
        events: {
          click: () => {
            this.formData.name = 'Luca Ban'
            this.formData.age = 18
            this.formData.consent = true
            this.resetFormCounter++
          },
        },
      },
      {
        component: 'button',
        type: 'button',
        slot: 'Clear Form Data',
        events: {
          click: (e) => {
            this.formData.name = undefined
            this.formData.age = undefined
            this.formData.consent = undefined
            this.resetFormCounter++
          },
        },
      },
      {
        id: 'name',
        label: 'Name',
        component: 'input',
        required: true,
      },
      {
        id: 'age',
        label: 'Age',
        component: 'input',
        type: 'number',
        parseInput: Number,
        rules: [(val) => val >= 18 || 'You must be over 18'],
      },
      {
        id: 'consent',
        label: 'Do you agree with our terms?',
        component: 'input',
        type: 'checkbox',
        default: false,
        rules: [(val) => val || 'You must accept our terms'],
      },
    ]
    return { schema, formData, resetFormCounter: 0 }
  },
}
</script>
