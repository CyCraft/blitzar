# Basics

`<BlitzForm />` is a component that allows you to easily create forms by passing an object with a schema on how you want the form to look. By merely passing a schema array you can easily generate entire forms! No more writing clunky HTML forms! 🎉

## Schema

The schema of a BlitzForm is an array of objects that usually looks something like this:
Eg.:

```js
// you can use regular HTML5 tags or custom Vue components!
const schema = [
  { id: 'firstName', label: 'First Name', component: 'input' },
  { id: 'lastName', label: 'Last Name', component: 'input' },
]
```

Besides 'id', 'label' and 'component' there are many more props you can pass: subLabel; required; labelPosition; fieldClasses; componentClasses; parseValue; parseInput; events and many more.

## Value/Model

There are several ways to retrieve the data that a user fills in a BlitzForm.

1. You can pass an empty object as `v-model` (or `:value` & listen to `@input`).<br />In this case BlitzForms will populate an object with the field's `id` as key and the user input as value.
2. You can listen to the `@field-input` event which triggers every time a field's value changes. It's payload is an object that looks like: `{id, value}`.
3. You can listen to the `@save` event which is triggered when the form's save button is pressed. It's payload is an object that looks like: `{newData, oldData}`. For more info see the [Action Buttons documentation](#actionButtons).
