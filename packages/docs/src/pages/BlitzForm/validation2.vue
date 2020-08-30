<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="3" :key="resetFormCounter" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { BlitzForm, BlitzBtn, validateFormPerSchema } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput, QToggle, Notify } from 'quasar'
import Vue from 'vue'
Vue.component('BlitzBtn', BlitzBtn)
Vue.component('QInput', QInput)
Vue.component('QToggle', QToggle)

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
        component: 'BlitzBtn',
        btnLabel: 'validate Programmatically',
        events: {
          click: () => {
            const result = validateFormPerSchema(this.formData, this.schema)
            const errorsRemain = Object.values(result).some((r) => r !== true)
            Notify.create({
              message: errorsRemain ? 'Errors remain' : 'All good!',
              caption: JSON.stringify(result),
            })
            console.log('validateFormPerSchema(this.formData, this.schema) → \n', result)
          },
        },
      },
      {
        component: 'BlitzBtn',
        btnLabel: 'Set Form Data',
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
        component: 'BlitzBtn',
        btnLabel: 'Clear Form Data',
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
        component: 'QInput',
        required: true,
      },
      {
        id: 'age',
        label: 'Age',
        component: 'QInput',
        type: 'number',
        parseInput: Number,
        rules: [(val) => val >= 18 || 'You must be over 18'],
      },
      {
        id: 'consent',
        label: 'Do you agree with our terms?',
        component: 'QToggle',
        default: false,
        rules: [(val) => val || 'You must accept our terms'],
      },
    ]
    return { schema, formData, resetFormCounter: 0 }
  },
}
</script>
