---
editLink: true
---

<script setup>
import ComponentCodeBlock from '../../components/ComponentCodeBlock.vue'
</script>

# Basics

`<BlitzForm />` is a Vue component that allows you to easily create forms by passing a _**schema**_. Based on this schema the form is generated for you. No more writing clunky HTML forms! 🎉

:::tip Did you know?
BlitzForm is a BYOC form generator! (Bring Your Own Components)
:::

## Schema

The schema of a BlitzForm is an array of objects that usually looks something like this:

```js
// you can use regular HTML5 tags or custom Vue components!
const schema = [
  { id: 'firstName', label: 'First Name', component: 'input' },
  { id: 'lastName', label: 'Last Name', component: 'input' },
]
```

The "component" of a field in your schema can be any Vue component you have globally registered or any HTML5 tag.

Besides `id`, `label` and `component` there are many more props you can pass: `subLabel` `required` `labelPosition` `fieldClasses` `componentClasses` `parseValue` `parseInput` `events` and many more.

<ComponentCodeBlock filename="blitz-form/Basics - Basic Example" />

## Value/Model

There are several ways to retrieve the data that a user fills in a BlitzForm.

1. You can pass an empty object as `v-model`<br />In this case BlitzForms will populate an object with the field's `id` as key and the user input as value.
2. You can listen to the `@field-input` event which triggers every time a field's value changes. It's payload is an object that looks like: `{id, value}`.
3. You can listen to the `@save` event which is triggered when the form's save button is pressed. It's payload is an object that looks like: `{newData, oldData}`. For more info see the [Action Buttons documentation](#action-buttons).
