---
editLink: true
---

# BlitzForm

## Installation & Usage

```
npm i blitzar
```

Blitzar only allows for local importing like the example below.

```js
// import what you need
import { BlitzTable, BlitzListForm, BlitzTable } from 'blitzar'

// add to local components where you use it:
export default {
  components: { BlitzTable, BlitzListForm, BlitzTable },
}
```

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

<CodeBlockComponent :importFn="() => import('./Basics - Basic Example.vue')" :importFnRaw="() => import('./Basics - Basic Example.vue?raw')" />

### Form Data / v-model

There are three ways to retrieve the data that a user fills in a BlitzForm.

1. You can pass an empty object as `v-model`<br />In this case BlitzForms will populate an object with the field's `id` as key and the user input as value.
2. You can listen to the `@update-field` event which triggers every time a field's value changes. It's payload is an object that looks like: `{id, value}`.
3. You can listen to the `@save` event which is triggered when the form's save button is pressed. It's payload is an object that looks like: `{newData, oldData}`. For more info see the [Action Buttons documentation](#action-buttons).

### Advanced Example

Here you can see an advanced form rendered with all **HTML5 form elements**.

If you look at the "script" you will see it's easy to use regular HTML5 elements. In reality however, you will probably use Blitzar with your custom Vue components. Which in explained in the [next chapter](#use-custom-components).

<CodeBlockComponent :importFn="() => import('./Basics - Advanced Example.vue')" :importFnRaw="() => import('./Basics - Advanced Example.vue?raw')" />

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

<CodeBlockComponent :importFn="() => import('./Basics - Custom Components - Basic.vue')" :importFnRaw="() => import('./Basics - Custom Components - Basic.vue?raw')" />

Here is another example of a simple login form:

<CodeBlockComponent :importFn="() => import('./Basics - Custom Components - Auth.vue')" :importFnRaw="() => import('./Basics - Custom Components - Auth.vue?raw')" />

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

<CodeBlockComponent :importFn="() => import('./Basics - HTML5 Elements.vue')" :importFnRaw="() => import('./Basics - HTML5 Elements.vue?raw')" />

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

- Quasar Framework _(example coming soon)_
- Vuetify _(example coming soon)_
- Nuxt _(example coming soon)_
- Tailwind _(example coming soon)_
- Bulma _(example coming soon)_

**All the frameworks above are compatible!** But the examples for these conflict with my documentation website. So creating live examples is a little bit of work! Coming soon!

## Modes

### Edit/Readonly/Disabled/Raw Modes

BlitzForm has five modes:

- `'edit'` — (default) show editable fields based on the schema
- `'readonly'` — show each field with `readonly: true`
- `'disabled'` — show each field with `disabled: true`
- `'raw'` — used to show raw data of your form (for select components, it will show the data label instead of its value)

The same schema to render a form can be re-used to just display form data as well. Your form schema is therefore very versatile!

Please note however, that in order for `'readonly'` mode to work, you will need to make sure that all components you use in your form, have proper handling when BlitzForm passes `readonly: true` to them.

With the HTML5 elements seen in the example below, the only field that understands `readonly: true` is the `input` component. Try switching the mode to `'readonly'` and you will see that all other fields are still editable; so you'll need to use Vue components that handle `readonly: true`, or write wrapper Vue components for these HTML5 elements.

`'disabled'` and `'raw'` mode on the other hand work out of the box with all these components.

<CodeBlockComponent :importFn="() => import('./Modes.vue')" :importFnRaw="() => import('./Modes.vue?raw')" />

### Disable Fields on Readonly Mode

It's also possible you just use the `disabled` prop for fields that don't handle `readonly`.

In this example below you can see how easy this is by using a Dynamic Prop for `disabled`. (Read more on Dynamic Props at [Advanced > Dynamic Props](/advanced/#dynamic-props))

However, in reality it's cleaner you just add the `readonly` prop to your Vue components, or if you use a component library, create a wrapper components for them.

<CodeBlockComponent :importFn="() => import('./Modes - Disable Fields on Readonly Mode.vue')" :importFnRaw="() => import('./Modes - Disable Fields on Readonly Mode.vue?raw')" />

## Action Buttons

Action buttons are buttons you would want to add to a form to do things like edit/save/delete etc... You can easily add action buttons like these on the top/bottom or sides of your BlitzForm.

Action buttons are set via the prop `actionButtons`. You can use pre-made action buttons that emit events. You can also overwrite the look of these pre-made buttons. Finally you can also set custom buttons and fields.

### Pre-Made Action Buttons

Pre-made buttons can be added to your form by just passing the string of the button you want:

`:action-buttons="['edit', 'cancel', 'save', 'delete', 'archive']"`

When added you will see the buttons like the preview below. They each have a functionality:

- `'edit'` — adds a button that puts the form in "edit" mode
- `'cancel'` — adds a button that puts the form back into "readonly" mode & reverts any changes to the form data
- `'save'` — adds a button that puts the form back into "readonly" mode & keeps the modified content
- `'delete'` `'archive'` — adds a button that emits a delete or archive event (you must implement your own logic)

The buttons that are added emit the events: `@edit` `@cancel` `@save` `@delete` `@archive`

You can listen for these events on the `<BlitzForm />` to use do things like:

- saving data to a DB when save is clicked
- moving a popup when cancel is clicked
- clear the form data (`value`) when delete is clicked

The `@save` event receives a payload with the new and old form data.

- `@save="onSave"`

Play with the pre-made action buttons below and see what happens:

<CodeBlockComponent :importFn="() => import('./Action Buttons - Pre-Made Action Buttons.vue')" :importFnRaw="() => import('./Action Buttons - Pre-Made Action Buttons.vue?raw')" />

### Overwriting Pre-Made Buttons

You can overwrite how the pre-made buttons look with the `actionButtonDefaults` prop.

In the example below you can see we are overwriting some properties of the HTML5 buttons. See the _**script tab**_.

However, most likely you will pass `component: 'MyButton'` and pass your own Vue button components.

<CodeBlockComponent :importFn="() => import('./Action Buttons - Overwriting Pre-Made Action Buttons.vue')" :importFnRaw="() => import('./Action Buttons - Overwriting Pre-Made Action Buttons.vue?raw')" />

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

<CodeBlockComponent :importFn="() => import('./Action Buttons - Custom Action Buttons.vue')" :importFnRaw="() => import('./Action Buttons - Custom Action Buttons.vue?raw')" />

> Be sure to check out the [Events](#events) documentation for explanation on those `events` in the schema.

## Form Data

### Clearing the Form

In order to _**clear**_ the form data _or_ to _**load new data**_ into the form, you will need to re-mount the form vue component!

BlitzForm copies the formData into its local state on mount, but it does not watch for all changes to `formData` (meaning the `v-model` or `value` prop). This is to achieve better performance.

Therefore you need to manually re-mount as seen in the example below. Watch what happens when clearing & loading data with and without remounting.

<CodeBlockComponent :importFn="() => import('./Form Data - Clearing the Form.vue')" :importFnRaw="() => import('./Form Data - Clearing the Form.vue?raw')" />

### Resetting the Form

A BlitzForm automatically makes a backup of form data so you can "cancel an edit".

In the example below there is a form with data. Try clicking "edit", then modify some data, then click "cancel".

<CodeBlockComponent :importFn="() => import('./Form Data - Resetting the Form.vue')" :importFnRaw="() => import('./Form Data - Resetting the Form.vue?raw')" />

### Nested Data

A `<BlitzForm />` can use a nested data structure on a flat form schema. When you have a nested data structure you will need to appoint each field ID with dot notation.

Eg. a field with ID `size.width` points to `{size: {width}}` in your data.

Besides writing your field IDs with dot notation, nothing further needs to be done.

The only thing you need to be careful with is the `@update-field` event:

- Listening to the `@update:modelValue` event will always return the full data nested
- Listening to the `@update-field` event will always have the field ID with dot-notation in its payload

Try typing something in the example below:

<CodeBlockComponent :importFn="() => import('./Form Data - Nested Data.vue')" :importFnRaw="() => import('./Form Data - Nested Data.vue?raw')" />

### List Forms

In some cases you might need a form that's actually a "list" users can fill in. Eg. Have a form where a teacher can write down names of students in a list.

For this I prepared a special kind of form called a **BlitzListForm** that offers these features:

- Auto populates the next empty field whenever there is user input
- Can be used as standalone component or inside a BlitzForm as a field
- Saves the data as an array

See it in action in the example down here! Write down some student names to see the `formData` update.

<CodeBlockComponent :importFn="() => import('./Form Data - List Forms.vue')" :importFnRaw="() => import('./Form Data - List Forms.vue?raw')" />

> For more info and examples on List Forms, check out the [dedicated BlitzListForm documentation](/blitz-list-form/)!

## Styling

Styling a BlitzForm field through CSS can be done by targeting these classes:

- `.blitz-field`
- `.blitz-field__label`
- `.blitz-field__sub-label`
- `.blitz-field__component`

### Left Labels

It's easy to position all labels on the left side! Just set `labelPosition="left"` on the BlitzForm.

When using left labels, by default, the label only takes up as much width as needed. It's really easy however to align all labels to be the same width. See the _**style tab**_ how this is done for the example below.

<CodeBlockComponent :importFn="() => import('./Styling - Left Labels.vue')" :importFnRaw="() => import('./Styling - Left Labels.vue?raw')" />

### Custom Label Positioning

It's easy to overwrite the positioning of the field label, sub-label & component with some CSS!

Look at the _**style tab**_ to see how to position the _**label on the right**_ and the sub-label on the bottom.

<CodeBlockComponent :importFn="() => import('./Styling - Custom Label Positioning.vue')" :importFnRaw="() => import('./Styling - Custom Label Positioning.vue?raw')" />

### Custom Label Content

You can use the `label` slot to pass extra content to a field's label.

In the example below we see usage of the label slot to add some extra content next to the title.

<CodeBlockComponent :importFn="() => import('./Styling - Custom Label Content.vue')" :importFnRaw="() => import('./Styling - Custom Label Content.vue?raw')" />

### Raw Form Styling

This example uses `mode="raw"` to show just the raw form data. Then CSS is used to style it. See the _**style tab**_.

<CodeBlockComponent :importFn="() => import('./Styling - Raw Form Styling.vue')" :importFnRaw="() => import('./Styling - Raw Form Styling.vue?raw')" />

## Events

There are both form and field events.

- _**Form events**_ — events to listen to directly on the BlitzForm
- _**Field events**_ — events you can listen to on a per-field basis; these are to be defined in your `schema`

### Form Events

A BlitzForm is usable with `v-model`. You can also listen to the `@update:modelValue` event that is triggered any time some `formData` changes.

There is also an event emitted called `@update-field`, every time you type something in a specific field.

Try typing a little in the example below.

<CodeBlockComponent :importFn="() => import('./Events - Form Events.vue')" :importFnRaw="() => import('./Events - Form Events.vue?raw')" />

<!-- > For more info on all possible events take a look at the [Api Card](#api-card) down below. -->

### Field Events

Each component in a form can have a prop called `events`. This prop will be applied to the field like so: `v-on="events"`.

An `events` prop would look like so:

```js
events: {
  'update:modelValue': ($event, context) => { },
  focus: ($event, context) => { },
  // etc...
}
```

When you look at the arrow function above, it will receive two arguments: `$event` and `context`.

- `$event` is whatever the event that's emitted receives as payload (eg. `MouseClickEvent`).
- `context` is the Vue component reference of the BlitzForm component, you can use this to access other properties/values
- `context` has useful props like `formData`, `mode`, and others.
- `context` has a special function called `updateField` which can be used to modify other fields programmatically
- If an event emits two or more arguments, you can access those _behind_ the `context` argument: `(arg1, context, arg2, ...otherArgs) => {}`

Phew. That was a bit of a lot of information all at once. 😅 Let's look at an example:

<CodeBlockComponent :importFn="() => import('./Events - Field Events.vue')" :importFnRaw="() => import('./Events - Field Events.vue?raw')" />

### Update Other Fields on Events

Here we see an example of one field updating the contents of another on the input event.

```js
events: {
  'update:modelValue': (val, { updateField }) => {
    // get only digits from input
    const value = !val ? '' : val.replace(/[^\d]/g, '').trim()

    // set field 'telClean' to this value
    updateField({ id: 'telClean', value })
  }
}
```

The `updateField` function can be used to update other fields inside your form. It receives a single parameter which should be an object that looks like `{id, value}` with the `id` of the field you want to update and a `value` you want to update it with.

<CodeBlockComponent :importFn="() => import('./Events - Update Other Fields on Events.vue')" :importFnRaw="() => import('./Events - Update Other Fields on Events.vue?raw')" />

## Validation

### Showing Errors

BlitzForm comes with lightweight built-in field validation.

Showing an "error" underneath a field can be done by setting a field's `error` to a Dynamic Prop:

```js
// Eg.
{
  id: 'age',
  component: 'input',
  dynamicProps: ['error'],
  error: (val) => Number(val) >= 18 ? null : 'You have to be over 18!'
}
```

- The function you provide will receive the field's `modelValue` as argument
- If the value is O.K., then you can return `null`
- If the value does not pass your validation, then you must **return the error you want to show** underneath the field

Be sure to also check out the documentation on [Dynamic Props](#dynamic-props) to see what other powerful things you can do with the `error` field.

### Validation on Every Keystroke

By default errors will get validated and shown on every keystroke.

Type something below to see the effect:

<CodeBlockComponent :importFn="() => import('./Validation - On Every Keystroke.vue')" :importFnRaw="() => import('./Validation - On Every Keystroke.vue?raw')" />

### Validation on Save

You can set `showErrorsOn: 'save'` on the BlitzForm to make sure that the errors only show when you click save. (The default is `showErrorsOn: 'interaction'`)

You can also use `showErrorsOn: 'save-focus'` to not only show the error but also automatically focus the field.

Typing below won't show errors, but try clicking **save** and see the errors show up, then play around with the different options for `showErrorsOn`:

<CodeBlockComponent :importFn="() => import('./Validation - On Save.vue')" :importFnRaw="() => import('./Validation - On Save.vue?raw')" />

:::tip Please note!
If you use `showErrorsOn: 'save-focus'` and custom components, you must make sure those components have a method called `focus`. (because focus is done by calling the `focus` method on the component ref)
:::

### Validate formData Programatically

You can also do programatic validation. BlitzForms provides a helper function which can be used without the need of rendering the form at all. It can be used like so:

```js
import { validateFormPerSchema } from 'blitzar'

validateFormPerSchema(formData, schema)
```

<CodeBlockComponent :importFn="() => import('./Validation - Programatically.vue')" :importFnRaw="() => import('./Validation - Programatically.vue?raw')" />

## Advanced

### Dynamic Props & Computed Field Values

See the advanced section for more cool features:

- [Dynamic Props](/advanced/#dynamic-props)
- [Computed Field Values](/advanced/#computed-field-values)
