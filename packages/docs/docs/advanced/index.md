---
editLink: true
---

Be sure to first read the BlitzForm [basics](/blitz-form/).

# Advanced

## Dynamic Props

### Dynamic Props — What/When

As you know, BlitzForm needs a `schema` with information on each field you want to show. Each field in your schema can have props like `label` `component` and any prop the component itself might need.

However, your fields can also have _**dynamic props**_, for example based on the data of the form! Such dynamic props are called Dynamic Props.

To use this you need to set the prop to a function. This function will be executed any time the data of any field changes.

Your form could have a disabled field by setting `disabled: true` to that field. But you can make a field be disabled based on wether or not a checkbox in your form is checked. In this case set the `disabled` prop to `(val, context) => !!context.formData.myCheckBox`. Now that field is disabled when `myCheckBox` is true.

The function you use for Dynamic Props receive 2 params `(val, context)`.

- `val` — this is the current value of the field
- `context` — this is the Vue component reference of the BlitzField, you can use this to access any other properties/values

The most important props you can access on `context`:

- `formData` — this is the _**nested**_ data of all the fields inside a BlitzForm
- `formDataFlat` — this is the **_flattened_** data of all the fields inside a BlitzForm
- `mode` — the current mode of the BlitzForm. Can be `'view'` | `'edit'` | `'raw'` | `'disabled'`

Try to refrain from accessing props other than the ones listed above, because these are mainly used internal and could have behaviour changes that could break your app.

### A Prop Based on the modelValue of the Field

Here we show how to make the props you pass to a field conditional — based on the `modelValue` of that field.

```js
dynamicProps: ['subLabel'],
subLabel: val => val === 'purple' ? 'nice!' : 'choose a color'
```

<CodeBlockComponent filename="blitz-form/Dynamic Props - 1" />

### A Prop Based on the modelValue of "Another" Field

Here we show how to make the props you pass to a field conditional — based on the `modelValue` of _**another field**_.

```js
dynamicProps: ['disabled'],
disabled: (val, { formData }) => !formData.under18
```

<CodeBlockComponent filename="blitz-form/Dynamic Props - 2" />

### Show or Hide a Field Based on Another Field

Here we show how to conditionally hide or show a field. `showCondition` is a special prop you can for this, defined inside your BlitzForm schema.

```js
dynamicProps: ['showCondition'],
showCondition: (val, { formData }) => formData.car
```

Try checking the checkbox and see what happens.

<CodeBlockComponent filename="blitz-form/Dynamic Props - 3" />

### Calculated "Options" of a Select-Field

Here we show how to automatically render select options based on data from a database.

We then also conditionally show different select options based on the `modelValue` of the _**other selected fields**_.

<CodeBlockComponent filename="blitz-form/Dynamic Props - 4" />

### Show Content Based on Another Field

Here we show how to show the `modelValue` of one field as the `slot` content of another.

```js
dynamicProps: ['slot'],
slot: (val, { formData }) => formData.myInput
```

<CodeBlockComponent filename="blitz-form/Dynamic Props - 5" />

## Computed Field Values

### Computed Field Values — What/When

Computed Field Values are when you need to add a field in your form that have a _**calculated value**_ based on the form data or some other fields.

Do not confuse this concept with [Dynamic Props](#dynamic-props).

- Dynamic Props: a calculated _**prop of**_ a field
- Computed Field Values: a field with a calculated _**value**_

An example of a Computed Field Value could be a full name of a person which exists of `${formData.firstName} ${formData.lastName}`

There are three ways we could create such a field:

### The `parseValue` Prop

```js
{
  id: 'fullName',
  component: 'input',
  parseValue: (val, { formData }) => `${formData.firstName || ''} ${formData.lastName || ''}`
}
```

So even though the field `fullName` has no `value` at all, it will always stay in sync with the current `formData`.

When implementing a Computed Field Value this way however, `fullName` will never have that computed value emitted. This means that it won't be included in the BlitzForm events: `@update:modelValue`, `@update-field` and `@save`. So it's difficult to capture and save this calculated value alongside your other data. See the next section for another method.

<CodeBlockComponent filename="blitz-form/Computed Field Values - 1" />

### Update via `updateField`

It can be handy to also save the calculated value in your database so you can filter/search/sort on this field.

In this case we can use the method called `updateField()` which is accessible on the context and first explained on the [events documentation page](#events).

```js
{
  id: 'firstName',
  events: {
    'update:modelValue': (val, {formData, updateField}) => {
      const { lastName = '' } = formData
      const value = `${val} ${lastName}`.trim()
      updateField({ id: 'fullName', value })
    }
  },
},
{
  id: 'lastName',
  events: {
    'update:modelValue': (val, {formData, updateField}) => {
      const { firstName = '' } = formData
      const value = `${firstName} ${val}`.trim()
      updateField({ id: 'fullName', value })
    }
  },
}
```

This method has pro's and con's though:

- PRO: you don't need to include the Computed Field Value (`fullName`) on the form at all
- CON: this is quite verbose...
- CON: it cannot be used if you need a Computed Field Value _not_ based on other fields (eg. a timestamp returning `new Date()`)
- CON: when your database already has data, you cannot use this without manually updating what's already in your database
- CON: if you want to save the Computed Field Value to your database, you have to include this Computed Field Value in all forms the user can edit this data

<CodeBlockComponent filename="blitz-form/Computed Field Values - 2" />

### Combine `parseValue` & `updateField`

The third way to create a Computed Field Value is this:

```js
{
  id: 'fullName',
  component: 'input',
  parseValue: (val, {formData, updateField}) => {
    const newValue = `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
    if (val !== newValue) updateField({ id: 'fullName', value: newValue })
    return newValue
  },
  // If you want to hide the Computed Field Value you can set:
  // showCondition: false
}
```

Basically you write your logic inside the `parseValue` prop of your Computed Field Value, and also trigger a `updateField` action from within here.

However, as the more experienced developers will notice...

> This is the same as introducing a side-effect to a computed property! By design this is discouraged, so isn't this bad?

I say "nay". The reason it is discouraged is because side-effects to computed properties that modify data are impossible to track. In a few months if you don't know why a certain value is being modified, you'll have a hard time finding eventually it was the side-effect from a computed property.

If we understand this reason, then in our case, it is perfectly valid to do so, because we are only modifying the data of the field we are describing right there. We are simply doing something equivalent to triggering `emit('update:modelValue', val)` on a component manually, nothing wrong with that.

However, keep in mind that also this method has its own pro's and con's:

- PRO: it can be used as stand-alone, without relying on other fields & without the need to render other fields
- PRO: because it just uses `parseValue` it's less verbose (opposed to listening to `update:modelValue` events of other fields)
- PRO: the logic for this field is contained in its own options object
- PRO: even if your database already has data, a Computed Field Value like this can be added at a later date
- CON: if you want to save the Computed Field Value to your database, you have to include this Computed Field Value in all forms the user can edit this data

Hint: add `showCondition: false` if you want to hide the field but still have it save its content in the formData.

<CodeBlockComponent filename="blitz-form/Computed Field Values - 3" />

## Using Locally Registered Components

Using a custom component in `BlitzForm` requires it to be registered globally. The idea is that a BlitzForm schema is saved in a Database, so we want to avoid using component instances etc.

However, if you still prefer to use locally registered components you can do so by simply passing the instance directly and wrapping it in `markRaw`.

```js
import { markRaw } from 'vue'
import BaseInput from './BaseInput.vue'

const schema = [
  {
    id: 'name',
    label: 'Name',
    component: markRaw(BaseInput),
  },
]
```

The example below uses this method:

<CodeBlockComponent filename="advanced/Using Locally Registered Components" />
