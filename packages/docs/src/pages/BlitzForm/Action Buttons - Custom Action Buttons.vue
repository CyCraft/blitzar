<template>
  <div>
    <BlitzForm
      :actionButtons="actionButtons"
      :schema="schema"
      v-model="formData"
      :columnCount="5"
    />
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

const schema = [
  {
    id: 'enableLogging',
    component: 'input',
    type: 'checkbox',
    label: 'Enable logging',
  },
  {
    id: 'name',
    component: 'input',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
    span: 2,
  },
  {
    id: 'powerOrigin',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    component: 'select',
    slot: [
      { component: 'option', value: '', slot: '' },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
    span: 2,
  },
]

/**
## Custom Action Buttons & Fields

You can also pass custom buttons & fields with a schema. The schema you provide works just like the BlitzForm schema.

Here is an example of adding a custom button to the `actionButtons`
```js
actionButtons: [{
  component: 'button',
  type: 'button',
  slot: 'log the data',
  showCondition: (_, {formData}) => formData.enableLogging,
  events: {
    click: (event, {formData}) => console.log(formData),
  },
}]
```

Being able to show/hide these button based on the `formData` can be very powerful.
Be sure to check out the [Evaluated Props](#evaluated-props) and [Events](#events) documentation.
 */
export default {
  components: { BlitzForm },
  data() {
    const actionButtons = [
      'cancel',
      'edit',
      'save',
      {
        component: 'button',
        type: 'button',
        slot: 'log the data (check console)',
        showCondition: (_, { formData }) => formData.enableLogging,
        events: {
          click: (event, { formData }) => console.log('formData →', formData),
        },
      },
    ]
    return { schema, formData: {}, actionButtons }
  },
}
</script>
