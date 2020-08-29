<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" mode="view" :actionButtons="actionButtons" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { BlitzForm, BlitzBtn } from 'blitzar'
Vue.component('BlitzBtn', BlitzBtn)
// All components that are used in the form need to be globally registered.
import { QInput, QSelect } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)
Vue.component('QSelect', QSelect)

const schema = [
  {
    id: 'name',
    component: 'QInput',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
    outlined: true,
  },
  {
    id: 'powerOrigin',
    component: 'QSelect',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    options: [
      { label: 'Mutation', value: 'mutation' },
      { label: 'Self taught', value: 'self' },
      { label: 'Magic item', value: 'item' },
    ],
    outlined: true,
    emitValue: true,
    mapOptions: true,
  },
]

/**
Action buttons are buttons you would want to add to a form to do things like edit/save/delete etc... You can easily add action buttons like these on the top/bottom or sides of your BlitzForm.

Action buttons are set via the prop 'actionButtons'. You can use pre-made action buttons that emit events. You can also overwrite the look of these pre-made buttons. Finally you can also set custom buttons and fields.

## Pre-made action buttons

Pre-made buttons can be added to your form by just passing the string of the button you want:

`:action-buttons="['edit', 'cancel', 'save', 'delete', 'archive']"`

When added you will see the buttons like the preview below. They each have a functionality:

- `'edit'`: Adds a button that puts the form in "edit" mode
- `'cancel'`: Adds a button that puts the form back into "view" mode & reverts the content to its original state
- `'save'`: Adds a button that puts the form back into "view" mode & keeps the modified content
- `'delete'` & `'archive'`: Adds a button that emits a delete or archive event (you must implement your own logic)

The buttons above emits the events: `@edit`, `@cancel`, `@save`, `@delete`, `@archive`

You can listen for these events on the &#60;BlitzForm /&#62; to use do things like:
- saving data to a DB when "save" is clicked
- moving a popup when 'cancel' is clicked
- clear the form data (`value`) when 'delete' is clicked

The `@save` event receives a payload with the new and old form data.

- `@save="onSave"`

```js
{
  onSave ({newData, oldData}) {
    console.log(newData) // an object with only the updated fields
    console.log(oldData) // the original object with all the field values
    // if you need a combination of both:
    const newFormData = {...oldData, ...newData}
  }
}
```

## Overwriting pre-made buttons

You can overwrite how the pre-made buttons look by providing an object like so:

```js
{
  'edit': { icon: 'edit' },
  'save': { push: true },
  'delete': { color: 'secondary' }
}
```

## Providing custom buttons & fields

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
Be sure to check out the "Evaluated Props" and "Events" documentation.
 */
export default {
  components: { BlitzForm },
  data() {
    const actionButtons = [
      'delete',
      'archive',
      'cancel',
      'edit',
      'save',
      {
        component: 'BlitzBtn',
        btnLabel: 'log the data (check console)',
        push: true,
        events: {
          click: (event, { formData }) => console.log(formData),
        },
      },
    ]
    const actionButtonDefaults = {
      archive: { icon: 'archive', showCondition: (_, { mode }) => mode !== 'edit' },
      delete: { icon: 'delete', showCondition: (_, { mode }) => mode !== 'edit' },
      edit: { icon: 'edit', flat: false, outline: true },
      save: { icon: 'save' },
    }
    return { schema, formData: {}, actionButtons, actionButtonDefaults }
  },
}
</script>
