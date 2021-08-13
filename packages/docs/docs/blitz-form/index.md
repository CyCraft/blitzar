---
editLink: true
---

<script setup>
  import CodeBlockComponent from '../../components/CodeBlockComponent.vue'
</script>

# Blitz Form

## Basics

`<BlitzForm />` is a Vue component that allows you to easily create forms by passing a _**schema**_. Based on this schema the form is generated for you. No more writing clunky HTML forms! 🎉

:::tip Did you know?
BlitzForm is a BYOC form generator! (Bring Your Own Components)
:::

### Schema

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

### Basic Example

Check out the template; script; style below to see how simple the code looks to render this form.

The form below uses regular HTML `input` and `select` fields. You can change the look of the fields with CSS or, even better, you can simply use your own Vue components for the fields.

<CodeBlockComponent filename="blitz-form/Basics - Basic Example" />

### Form Data / v-model

There are three ways to retrieve the data that a user fills in a BlitzForm.

1. You can pass an empty object as `v-model`<br />In this case BlitzForms will populate an object with the field's `id` as key and the user input as value.
2. You can listen to the `@field-input` event which triggers every time a field's value changes. It's payload is an object that looks like: `{id, value}`.
3. You can listen to the `@save` event which is triggered when the form's save button is pressed. It's payload is an object that looks like: `{newData, oldData}`. For more info see the [Action Buttons documentation](#action-buttons).

### Advanced Example

Here you can see an advanced form rendered with all HTML5 form elements.

If you look at the "script" you will see it's easy to use regular HTML5 elements. In reality however, you will probably use Blitzar with your custom Vue components. Which in explained in the _next_ chapter.

<CodeBlockComponent filename="blitz-form/Basics - Advanced Example" />

### Use Custom Components

Todo

## Frameworks

Blitzar is framework-agnostic. Blitzar is merely a wrapper around your own form components.

In the Vue ecosystem there are many component frameworks, and they're all compatible with Blitzar!

Click on your favorite framework to see an example:

- [Quasar Framework](#quasar-framework)
- [Vuetify](#vuetify)
- _Nuxt (coming soon)_
- _Tailwind (coming soon)_
- _Bulma (coming soon)_
