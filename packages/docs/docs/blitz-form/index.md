---
editLink: true
---

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

Check out the template/script/style below to see how simple the code looks to render this form.

The form below uses regular HTML `input` and `select` fields. You can change the look of the fields with CSS or, even better, you can simply [use your own Vue components](#use-custom-components) for the fields.

<CodeBlockComponent filename="blitz-form/Basics - Basic Example" />

### Form Data / v-model

There are three ways to retrieve the data that a user fills in a BlitzForm.

1. You can pass an empty object as `v-model`<br />In this case BlitzForms will populate an object with the field's `id` as key and the user input as value.
2. You can listen to the `@field-input` event which triggers every time a field's value changes. It's payload is an object that looks like: `{id, value}`.
3. You can listen to the `@save` event which is triggered when the form's save button is pressed. It's payload is an object that looks like: `{newData, oldData}`. For more info see the [Action Buttons documentation](#action-buttons).

### Advanced Example

Here you can see an advanced form rendered with all **HTML5 form elements**.

If you look at the "script" you will see it's easy to use regular HTML5 elements. In reality however, you will probably use Blitzar with your custom Vue components. Which in explained in the [next chapter](#use-custom-components).

<CodeBlockComponent filename="blitz-form/Basics - Advanced Example" />

### Use Custom Components

The main use case of BlitzForm will be where you use your own Vue components. In this example below we see how you can simply refer to a custom component name:

```js
const schema = [
  {
    id: 'name',
    label: 'Name',
    component: 'BaseInput',
  },
]
```

In the example below we actually render a form using our custom component `BaseInput`. If you are interested in the source code of BaseInput, [you can find it here](https://github.com/CyCraft/blitzar/tree/production/packages/docs/components/BaseInput.vue).

<CodeBlockComponent filename="blitz-form/Basics - Custom Components - Basic" />

Here is another example of a simple login form:

<CodeBlockComponent filename="blitz-form/Basics - Custom Components - Auth" />

:::tip Please note!
Components you want to use in BlitzForm must be registered Globally! (See the [official Vue documentation](https://v3.vuejs.org/guide/component-registration.html) for more info)

If you need to use locally registered components, see [Advanced > Using Locally Registered Components](/advanced/#using-locally-registered-components)
:::

### Use HTML5 Elements

In the [Advanced Example](#advanced-example) we have shown how to use HTML5 form elements, like `input`, `select` etc.

It's possible to use other HTML5 elements as well like `a`, `p`, `div`, `ol`, `ul`, etc. For these elements you need to use the prop called `slot` to pass content:

```js
{
  component: 'p',
  slot: 'It can be anything!',
}
```

In this example we use a `p` paragraph to add more context in our form:

```js
// Eg.
const schema = [
  {
    label: `What's your nickname?`,
    id: 'name',
    component: 'input',
  },
  {
    component: 'p',
    slot: 'It can be anything!',
  },
]
```

Here are more examples of how you can use HTML5 elements you can use in Blitz Forms:

<CodeBlockComponent filename="blitz-form/Basics - HTML5 Elements" />

:::tip When to use HTML5 elements in the form schema.
This can be useful if you have form schemas saved in a Database and the user wants to display some simple HTML or an image in their form.
:::

:::tip When to **NOT** use HTML5 elements in the form schema.
When you know what the form schema will be, adding extra flair to that form can easily be done _outside_ of the `<BlitzForm />` tag. You will have a lot more freedom.
:::

## Frameworks

Blitzar is framework-agnostic. Blitzar is merely a wrapper around your own form components.

In the Vue ecosystem there are many component frameworks, and they're all compatible with Blitzar!

Click on your favorite framework to see an example:

- [Quasar Framework](#quasar-framework)
- [Vuetify](#vuetify)
- _Nuxt (coming soon)_
- _Tailwind (coming soon)_
- _Bulma (coming soon)_

### Quasar Framework

All fields used in this example are Quasar components.

Please note that Quasar cannot auto-detect the use of Quasar components in Blitzar. So you need to register them as global Vue components in `quasar.conf.js` OR manually like so:

```js
import { QInput } from 'quasar'

Vue.component('QInput', QInput)
```

<!-- <CodeBlockComponent filename="blitz-form/Frameworks - Quasar Framework" /> -->

### Vuetify

All fields used in this example are Vuetify components.

Please note that Vuetify cannot auto-detect the use of Vuetify components in Blitzar. So you need to register them as global Vue components like so:

```js
import { VTextField } from 'vuetify/lib'

Vue.component('VTextField', VTextField)
```

<!-- <CodeBlockComponent filename="blitz-form/Frameworks - Vuetify" /> -->

## Modes

### Edit/View/disabled/raw modes

BlitzForm has five modes:

- `'edit'` — (default) show editable fields based on the schema
- `'view'` — show each field with `readonly: true`
- `'disabled'` — show each field with `disabled: true`
- `'raw'` — used to show raw data of your form (for select components, it will show the data label instead of its value)
- `'add'` — the same as `'edit'`

The same schema to render a form can be re-used to just display form data as well. Your form schema is therefore very versatile!

Please note however, that in order for `'view'` mode to work, you will need to make sure that all components you use in your form, have proper handling when BlitzForm passes `readonly: true` to them.

With the HTML5 elements seen in the example below, the only field that understands `readonly: true` is the `input` component. Try switching the mode to `'view'` and you will see that all other fields are still editable; so you'll need to use Vue components that handle `readonly: true`, or write wrapper Vue components for these HTML5 elements.

`'disabled'` and `'raw'` mode on the other hand work out of the box with all these components.

<!-- <CodeBlockComponent filename="blitz-form/Modes" /> -->

### Disable Fields on View Mode

It's also possible you just use the `disabled` prop for fields that don't handle `readonly`.

In this example below you can see how easy this is by using an Evaluated Prop for `disabled`. (Read more on [Evaluated Props](#evaluated-props) down below)

However, in reality it's cleaner you just add the `readonly` prop to your Vue components, or if you use a component library, create a wrapper components for them.

<!-- <CodeBlockComponent filename="blitz-form/Modes - Disable Fields on View Mode" /> -->

## Action Buttons

Action buttons are buttons you would want to add to a form to do things like edit/save/delete etc... You can easily add action buttons like these on the top/bottom or sides of your BlitzForm.

Action buttons are set via the prop `actionButtons`. You can use pre-made action buttons that emit events. You can also overwrite the look of these pre-made buttons. Finally you can also set custom buttons and fields.

### Pre-Made Action Buttons

Pre-made buttons can be added to your form by just passing the string of the button you want:

`:action-buttons="['edit', 'cancel', 'save', 'delete', 'archive']"`

When added you will see the buttons like the preview below. They each have a functionality:

- `'edit'` — adds a button that puts the form in "edit" mode
- `'cancel'` — adds a button that puts the form back into "view" mode & reverts any changes to the form data
- `'save'` — adds a button that puts the form back into "view" mode & keeps the modified content
- `'delete'` `'archive'` — adds a button that emits a delete or archive event (you must implement your own logic)

The buttons that are added emit the events: `@edit` `@cancel` `@save` `@delete` `@archive`

You can listen for these events on the `<BlitzForm />` to use do things like:

- saving data to a DB when save is clicked
- moving a popup when cancel is clicked
- clear the form data (`value`) when delete is clicked

The `@save` event receives a payload with the new and old form data.

- `@save="onSave"`

Play with the pre-made action buttons below and see what happens:

<!-- <CodeBlockComponent filename="blitz-form/Action Buttons - Pre-Made Action Buttons" /> -->

### Overwriting Pre-Made Buttons

You can overwrite how the pre-made buttons look with the `actionButtonDefaults` prop.

In the example below you can see we are overwriting some properties of the HTML5 buttons. See the _**script tab**_.

However, most likely you will pass `component: 'MyButton'` and pass your own Vue button components.

<!-- <CodeBlockComponent filename="blitz-form/Action Buttons - Overwriting Pre-Made Action Buttons" /> -->

### Custom Action Buttons & Fields

You can also pass custom buttons & fields with a schema. The schema you provide works just like the BlitzForm schema.

Here is an example of adding a custom button to the `actionButtons`

```js
actionButtons: [
  {
    component: 'button',
    type: 'button',
    slot: 'log the data',
    showCondition: (_, { formData }) => formData.enableLogging,
    events: {
      click: (event, { formData }) => console.log(formData),
    },
  },
]
```

Being able to show/hide these button based on the `formData` can be very powerful.
Be sure to check out the [Evaluated Props](#evaluated-props) and [Events](#events) documentation.

<!-- <CodeBlockComponent filename="blitz-form/Action Buttons - Custom Action Buttons" /> -->

## Form Data

### Clearing the Form

In order to _**clear**_ the form data _or_ to _**load new data**_ into the form, you will need to re-mount the form vue component!

BlitzForm copies the formData into its local state on mount, but it does not watch for all changes to `formData` (meaning the `v-model` or `value` prop). This is to achieve better performance.

Therefore you need to manually re-mount as seen in the example below. Watch what happens when clearing & loading data with and without remounting.

<!-- <CodeBlockComponent filename="blitz-form/Form Data - Clearing the Form" /> -->

### Resetting the Form

A BlitzForm automatically makes a backup of form data so you can "cancel an edit".

In the example below there is a form with data. Try clicking "edit", then modify some data, then click "cancel".

<!-- <CodeBlockComponent filename="blitz-form/Form Data - Resetting the Form" /> -->

### Nested Data

A `<BlitzForm />` can use a nested data structure on a flat form schema. When you have a nested data structure you will need to appoint each field ID with dot notation.

Eg. a field with ID `size.width` points to `{size: {width}}` in your data.

Besides writing your field IDs with dot notation, nothing further needs to be done.

The only thing you need to be careful with is the `@field-input` event:

- Listening to the `@input` event will always return the full data nested
- Listening to the `@field-input` event will always have the field ID with dot-notation in its payload

Try typing something in the example below:

<!-- <CodeBlockComponent filename="blitz-form/Form Data - Nested Data" /> -->

### List Forms

In some cases you might need a form that's actually a "list" users can fill in. Eg. Have a form where a teacher can write down names of students in a list.

For this I prepared a special kind of form called a **BlitzListForm** that offers these features:

- Auto populates the next empty field whenever there is user input
- Can be used as standalone component or inside a BlitzForm as a field
- Saves the data as an array

See it in action in the example down here! Write down some student names to see the `formData` update.

(for more examples check out the [dedicated documentation](/docs/blitz-list-form) on BlitzListForm)

<!-- <CodeBlockComponent filename="blitz-form/Form Data - List Forms" /> -->

## Styling

Styling a BlitzForm field through CSS can be done by targeting these classes:

- `.blitz-field`
- `.blitz-field__label`
- `.blitz-field__sub-label`
- `.blitz-field__component`

### Left Labels

It's easy to position all labels on the left side! Just set `labelPosition="left"` on the BlitzForm.

When using left labels, by default, the label only takes up as much width as needed. It's really easy however to align all labels to be the same width. See the _**style tab**_ how this is done for the example below.

<!-- <CodeBlockComponent filename="blitz-form/Styling - Left Labels" /> -->

### Custom Label Positioning

It's easy to overwrite the positioning of the field label, sub-label & component with some CSS!

Look at the _**style tab**_ to see how to position the _**label on the right**_ and the sub-label on the bottom.

<!-- <CodeBlockComponent filename="blitz-form/Styling - Custom Label Positioning" /> -->

### Custom Label Content

You can use the `label` slot to pass extra content to a field's label.

In the example below we see usage of the label slot to add some extra content next to the title.

<!-- <CodeBlockComponent filename="blitz-form/Styling - Custom Label Content" /> -->

### Raw Form Styling

This example uses `mode="raw"` to show just the raw form data. Then CSS is used to style it. See the _**style tab**_.

<!-- <CodeBlockComponent filename="blitz-form/Styling - Raw Form Styling" /> -->

## Events

There are both form and field events.

- _**Form events**_ — events to listen to directly on the BlitzForm
- _**Field events**_ — events you can listen to on a per-field basis; these are to be defined in your `schema`

### Form Events

You can listen to the `@input` event on a `<BlitzForm />` which will trigger each time the `formData` is changed. This makes BlitzForm usable with `v-model`.

There is also an `@field-input` event you can listen to which will trigger every time you type something in a specific field.

(For more info on all possible events take a look at the [Api Card](#api-card) down below.)

Try typing a little in the example below.

<!-- <CodeBlockComponent filename="blitz-form/Events - Form Events" /> -->

### Field Events

Each component in a form can have a prop called `events`. This prop will be applied to the field like so: `v-on="events"`.

An `events` prop would look like so:

```js
events: {
  input: ($event, context) => { },
  focus: ($event, context) => { },
  // etc...
}
```

Please note these things about events you set in your schema:

- Besides the typical `$event` parameter events receive (like `MouseClickEvent`), they will receive a second `context` parameter
- `context` is the Vue component reference of the BlitzForm component, you can use this to access other properties/values
- `context` has useful props like: `formData`, `formDataFlat`, `mode`, `formId`, ... All of these are explained in the [Evaluated Props documentation](#evaluated-props), so be sure to check that
- `context` has a special function called `fieldInput` which can be used to modify other fields programmatically

Phew. That was a bit of a lot of information all at once. 😅 Let's look at an example:

<!-- <CodeBlockComponent filename="blitz-form/Events - Field Events" /> -->

### Update Other Fields on Events

Here we see an example of one field updating the contents of another on the input event.

```js
events: {
  input: (val, { fieldInput }) => {
    // get only digits from input
    const value = !val ? '' : val.replace(/[^\d]/g, '').trim()

    // set field 'telClean' to this value
    fieldInput({ id: 'telClean', value })
  }
}
```

The `fieldInput` function can be used to update other fields inside your form. It receives a single parameter which should be an object that looks like `{id, value}` with the `id` of the field you want to update and a `value` you want to update it with.

Be sure to also check the documentation on [Computed Fields](#computed-fields) as well.

<!-- <CodeBlockComponent filename="blitz-form/Events - Update Other Fields on Events" /> -->

## Evaluated Props

### Evaluated Props — What/When

As you know, BlitzForm needs a `schema` with information on each field you want to show. Each field in your schema can have props like `label` `component` and any prop the component itself might need.

However, your fields can also have _**dynamic props**_, for example based on the data of the form! Such dynamic props are called Evaluated Props.

To use this you need to set the prop to a function. This function will be executed any time the data of any field changes.

Your form could have a disabled field by setting `disabled: true` to that field. But you can make a field be disabled based on wether or not a checkbox in your form is checked. In this case set the `disabled` prop to `(val, context) => !!context.formData.myCheckBox`. Now that field is disabled when `myCheckBox` is true.

The function you use for Evaluated Props receive 2 params `(val, context)`.

- `val` — this is the current value of the field
- `context` — this is the Vue component reference of the BlitzField, you can use this to access any other properties/values

The most important props you can access on `context`:

- `formData` — this is the _**nested**_ data of all the fields inside a BlitzForm
- `formDataFlat` — this is the **_flattened_** data of all the fields inside a BlitzForm
- `mode` — the current mode of the BlitzForm. Can be `'view'` | `'edit'` | `'add'` | `'raw'` | `'disabled'`

Try to refrain from accessing props other than the ones listed above, because these are mainly used internal and could have behaviour changes that could break your app.

### Dynamic Prop Based on the Value of the Field

Eg. `subLabel: val => val === 'purple' ? 'nice!' : 'choose a color'`

<!-- <CodeBlockComponent filename="blitz-form/Evaluated Props - 1" /> -->

### Dynamic Prop Based on the Value of "Another" Field

Eg. `disabled: (val, {formData}) => !formData.under18`

<!-- <CodeBlockComponent filename="blitz-form/Evaluated Props - 2" /> -->

### Show or Hide a Field Based on Another Field

Eg. `showCondition: (val, {formData}) => formData.car`

`showCondition` is a special prop that can only be used inside the schema of a BlitzForm.

<!-- <CodeBlockComponent filename="blitz-form/Evaluated Props - 3" /> -->

### Dynamic "Options" of a Select-Field

<!-- <CodeBlockComponent filename="blitz-form/Evaluated Props - 4" /> -->

### Evaluated Slots

<!-- <CodeBlockComponent filename="blitz-form/Evaluated Props - 5" /> -->

## Computed Fields

### Computed Fields — What/When

Computed Fields are when you need to add a field in your form that have a _**calculated value**_ based on the form data or some other fields.

Do not confuse this concept with <span style="opacity: 0.5">#</span>[Evaluated Props](#evaluated-props).

- Evaluated Props: a calculated _**prop of**_ a field
- Computed Fields: a field with a calculated _**value**_

An example of a Computed Field could be a full name of a person which exists of `${formData.firstName} ${formData.lastName}`

There are three ways we could create such a field:

### The `parseValue` Prop

```js
{
  id: 'fullName',
  component: 'input',
  parseValue: (val, {formData}) => `${formData.firstName || ''} ${formData.lastName || ''}`
}
```

So even though the field `fullName` has no `value` at all, it will always stay in sync with the current `formData`.

When implementing a computed field this way however, `fullName` will never have that computed value emitted. This means that it won't be included in the BlitzForm events: `@input`, `@field-input` and `@save`. So it's difficult to capture and save this calculated value alongside your other data. See the next tab for another method.

<!-- <CodeBlockComponent filename="blitz-form/Computed Fields - 1" /> -->

### Update via `fieldInput`

It can be handy to also save the calculated value in your database so you can filter/search/sort on this field.

In this case we can use the method called `fieldInput()` which is accessible on the context and first explained on the [events documentation page](#events).

```js
{
  id: 'firstName',
  events: {
    input: (val, {formData, fieldInput}) => {
      const { lastName = '' } = formData
      const value = `${val} ${lastName}`.trim()
      fieldInput({id: 'fullName', value})
    }
  },
},
{
  id: 'lastName',
  events: {
    input: (val, {formData, fieldInput}) => {
      const { firstName = '' } = formData
      const value = `${firstName} ${val}`.trim()
      fieldInput({id: 'fullName', value})
    }
  },
}
```

This method has pro's and con's though:

- PRO: you don't need to include the Computed Field (`fullName`) on the form at all
- CON: this is quite verbose...
- CON: it cannot be used if you need a computed field _not_ based on other fields (eg. a timestamp returning `new Date()`)
- CON: when your database already has data, you cannot use this without manually updating what's already in your database
- CON: if you want to save the computed field to your database, you have to include this computed field in all forms the user can edit this data

<!-- <CodeBlockComponent filename="blitz-form/Computed Fields - 2" /> -->

### Combine `parseValue` & `fieldInput`

The third way to create a computed field is this:

```js
{
  id: 'fullName',
  component: 'input',
  parseValue: (val, {formData, fieldInput}) => {
    const value = `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
    if (val !== value) fieldInput({id: 'fullName', value})
    return value
  },
  // If you want to hide the computed field you can set:
  // showCondition: false
}
```

Basically you write your logic inside the `parseValue` prop of your computed field, and also trigger a `fieldInput` action from within here.

However, as the more experienced developers will notice...

> This is the same as introducing a side-effect to a computed property! By design this is discouraged, so isn't this bad?

I say "nay". The reason it is discouraged is because side-effects to computed properties that modify data are impossible to track. In a few months if you don't know why a certain value is being modified, you'll have a hard time finding eventually it was the side-effect from a computed property.

If we understand this reason, then in our case, it is perfectly valid to do so, because we are only modifying the data of the field we are describing right there. We are simply doing something equivalent to triggering `emit('input', val)` on a component manually, nothing wrong with that.

However, keep in mind that also this method has its own pro's and con's:

- PRO: it can be used as stand-alone, without relying on other fields & without the need to render other fields
- PRO: because it just uses `parseValue` it's less verbose (opposed to listening to input events of other fields)
- PRO: the logic for this field is contained in its own options object
- PRO: even if your database already has data, a computed field like this can be added at a later date
- CON: if you want to save the computed field to your database, you have to include this computed field in all forms the user can edit this data

Hint: add `showCondition: false` if you want to hide the field but still have it save its content in the formData.

<!-- <CodeBlockComponent filename="blitz-form/Computed Fields - 3" /> -->

## Validation

BlitzForms have validation enabled by default when clicking the save button or when executing `validate` on the BlitzForm ref.

<!-- <CodeBlockComponent filename="blitz-form/Validation" /> -->

There is also the possibility to do programatic validation. BlitzForms provides a helper function which can be used without the need of rendering the form at all. It can be used like so:

```js
import { validateFormPerSchema } from 'blitzar'

validateFormPerSchema(formData, schema)
```

<!-- <CodeBlockComponent filename="blitz-form/Validation - 2" /> -->
