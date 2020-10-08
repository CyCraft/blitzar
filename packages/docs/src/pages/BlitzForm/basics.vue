<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
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
# Basics

`&#60;BlitzForm /&#62;` is a component that allows you to easily create forms by passing an object with a schema on how you want the form to look. By merely passing a schema array you can easily generate entire forms! No more writing clunky HTML forms! 🎉

## Schema

The schema of a BlitzForm is an array of objects that usually looks something like this:
Eg.:
```js
[
  // you can use custom Vue components
  { id: 'myField', label: 'My Field', component: 'MyFieldVueComponent' },

  // you can use quasar components
  { id: 'name', label: 'Name', component: 'QInput' },
]
```

Besides 'id', 'label' and 'component' there are many more props you can pass: subLabel; required; labelPosition; fieldClasses; componentClasses; parseValue; parseInput; events and many more.

## Value/Model

There are several ways to work with the data of a BlitzForm.

1. You can pass an empty object as `v-model` (or `:value` & listen to `@input`).<br />In this case BlitzForms will populate an object with the field's `id` as key and the user input as value.
2. You can listen to the `@field-input` event which triggers every time a field's value changes. It's payload is an object that looks like: `{id, value}`.
3. You can listen to the `@save` event which is triggered when the form's save button is pressed. It's payload is an object that looks like: `{newData, oldData}`. For more info see the [Action Buttons documentation](#actionButtons).
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
