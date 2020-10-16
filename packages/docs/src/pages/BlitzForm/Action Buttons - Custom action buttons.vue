<template>
  <div>
    <BlitzForm
      :actionButtons="actionButtons"
      :schema="schema"
      v-model="formData"
      :columnCount="2"
    />
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm, BlitzBtn } from 'blitzar'

const schema = [
  {
    id: 'name',
    component: 'input',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
  },
  {
    id: 'powerOrigin',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    component: 'select',
    slot: [
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
    ],
  },
]

/**
## Custom action buttons & fields

You can also pass custom buttons & fields with a schema. The schema you provide works just like the BlitzForm schema.

An example of a custom button could be:
```js
actionButtons: [{
  component: 'BlitzBtn',
  btnLabel: 'log the data',
  showCondition: (_, {formData}) => formData.enableLogging,
  events: {
    click: (event, {formData}) => console.log(formData),
  },
}]
```

Being able to show/hide these button based on the `formData` can be very powerful.
Be sure to check out the [evaluated props](#evaluated-props) and [events](#events) documentation.
 */
export default {
  components: { BlitzForm },
  data() {
    const actionButtons = [
      'cancel',
      'edit',
      'save',
      {
        component: 'BlitzBtn',
        btnLabel: 'log the data (check console)',
        push: true,
        events: {
          click: (event, { formData }) => console.log('formData →', formData),
        },
      },
    ]
    return { schema, formData: {}, actionButtons }
  },
}
</script>
