<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="3" :key="resetFormCounter" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
import { validateFormPerSchema } from '../../../form/src/helpers/validation'
import { showToast } from '../../../docs-0.x/src/helpers/toast'

export default {
  data() {
    const formData = {
      name: undefined,
      age: undefined,
      consent: undefined,
    }
    const schema = [
      // todo, convert this to a non-form button!!
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
      // todo, convert this to a non-form button!!
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
      // todo, convert this to a non-form button!!
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
        parseInput: (val) => Number(val),
        rules: [(val) => val >= 18 || 'You must be over 18'],
      },
      {
        id: 'consent',
        label: 'Do you agree with our terms?',
        component: 'input',
        type: 'checkbox',
        defaultValue: false,
        rules: [(val) => val || 'You must accept our terms'],
      },
    ]
    return { schema, formData, resetFormCounter: 0 }
  },
}
</script>
