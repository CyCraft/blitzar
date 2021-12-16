---
editLink: true
---

# BlitzTable

## Basics

`<BlitzTable />` is a _**data table**_ component you can use with the same `schema` syntax of [BlitzForms](/blitz-form/) to define your columns.

With a single "schema" you can generate:

- the columns of the table
- the fields of the cards in grid-view
- an editable form in a dialog when clicking on a row

### Basic Example

Here we see a basic example for a BlitzTable. Check out the _template_ and _script_ tabs below to see how easy it is to render a data table based on the schema.

By default

- the table shows ALL the rows without pagination
- all the rows are sortable

<CodeBlockComponent :importFn="() => import('./Basics - Basic Example.vue')" :importFnRaw="() => import('./Basics - Basic Example.vue?raw')" />

### Advanced Example

This is a more advanced example that includes...

- a title
- a search input field
- a grid/table view toggle
- pagination features
- an image rendered with `<img />`
- dates are shown with `toLocaleDateString()`
- numbers are shown with `toLocaleString()`

<CodeBlockComponent :importFn="() => import('./Basics - Advanced Example.vue')" :importFnRaw="() => import('./Basics - Advanced Example.vue?raw')" />

### Using Custom Components

Here you see the example uses all HTML5 components to render all the fields surrounding the table.

The idea, as always with Blitzar, is that you BYOC (Bring Your Own Components).

<!-- the whole idea is to .... blablablabla -->

<CodeBlockComponent :importFn="() => import('./Basics - Example HTML5 Components.vue')" :importFnRaw="() => import('./Basics - Example HTML5 Components.vue?raw')" />

<!-- the whole idea is to .... blablablabla -->

## Column Features

Because every column is based on a BlitzForm field, there is quite some flexibility what you can do with a column. Below are some examples of this.

### Nested Data

Columns support "dot-notation" to access nested data in your rows array.

<!-- prettier-ignore-start -->
```js
const rows = [
  { name: { first: 'Luca', last: 'Ban' } }
]

const schemaColumns = [
  { id: 'name.first', label: 'First Name' },
  { id: 'name.last', label: 'Last Name' },
]
```
<!-- prettier-ignore-end -->

Full example:

<CodeBlockComponent :importFn="() => import('./Column Features - Nested Data.vue')" :importFnRaw="() => import('./Column Features - Nested Data.vue?raw')" />

### Mutating Columns

Columns can be "mutated" meaning data can be shown differently from the actual underlying data. To do so define a `parseValue` function.

```js
const schemaColumns = [
  { id: 'name', label: 'Name', parseValue: (val) => val.toUpperCase() },
  { id: 'date', label: 'Date', parseValue: (val) => val.toLocaleDateString() },
  { id: 'number', label: 'Balance', parseValue: (val) => val.toLocaleString() },
]
```

Full example:

<CodeBlockComponent :importFn="() => import('./Column Features - Mutating Columns.vue')" :importFnRaw="() => import('./Column Features - Mutating Columns.vue?raw')" />

### Combining Columns

Two table columns can be combined. A combined column is one that shows data based on multiple fields/columns.

```js
const schemaColumns = [
  // no 'id' required for the combined column
  { label: 'Full Name', (val, { formData }) => `${formData.firstName} ${formData.lastName}` },
]
```

In this example the _Full Name_ and _Initials_ are calculated on the fly when showing the table. You can even sort and search for data in these combined columns.

<CodeBlockComponent :importFn="() => import('./Column Features - Combining Columns.vue')" :importFnRaw="() => import('./Column Features - Combining Columns.vue?raw')" />

### Grid View

You can have a separate view for the table and grid views.

<CodeBlockComponent :importFn="() => import('./Column Features - Grid View.vue')" :importFnRaw="() => import('./Column Features - Grid View.vue?raw')" />

## Editing

There are various ways to implement the ability to edit table data. Below I show case 4 ways to easily implement editing. Each time you can check the _template_ and _script_ tabs to check how it can be implemented.

Any editing requires every object in your `rows` array to have an **`id` prop**.

### Edit Inline

This example simply toggles the "mode" of the table from "raw" to "edit". See [BlitzTable > Modes](/blitz-form/#edit-readonly-disabled-raw-modes) for more info.

To be able to show actual form components (like `<input />` or custom components) you need to make sure to add them to the `schemaColumns`.

```html
<BlitzTable mode="edit" :schemaColumns="schemaColumns" />
```

<!-- prettier-ignore-start -->
```js
const schemaColumns = [
  { id: 'name', label: 'Name', component: 'input' }
]
```
<!-- prettier-ignore-end -->

Full example:

<CodeBlockComponent :importFn="() => import('./Editing - Inline.vue')" :importFnRaw="() => import('./Editing - Inline.vue?raw')" />

### Edit on Cell Double-Click

Making a Cell editable on double-click is a bit more advanced and requires more setup. You need to make use of Dynamic Props to make it possible. (more info on Dynamic Props at [Advanced > Dynamic Props](/advanced/#dynamic-props))

Check the source code of the example below to see how it's implemented:

<CodeBlockComponent :importFn="() => import('./Editing - On Cell Double-Click.vue')" :importFnRaw="() => import('./Editing - On Cell Double-Click.vue?raw')" />

### Edit Modal on Row Click

It's possible to show a modal with a BlitzForm to edit data on row click. See the source code below to see how it's implemented:

<CodeBlockComponent :importFn="() => import('./Editing - Modal on Row Click.vue')" :importFnRaw="() => import('./Editing - Modal on Row Click.vue?raw')" />

### Edit Modal on Button Click

It's possible to show a modal with a BlitzForm to edit data on the click of a button. See the source code below to see how it's implemented:

<CodeBlockComponent :importFn="() => import('./Editing - Modal on Button Click.vue')" :importFnRaw="() => import('./Editing - Modal on Button Click.vue?raw')" />

### Adding a New Row

This is an example of how you could set up a button that shows a BlitzForm to add new data to the table.

<CodeBlockComponent :importFn="() => import('./Editing - Adding a New Row.vue')" :importFnRaw="() => import('./Editing - Adding a New Row.vue?raw')" />

## Selection

### Select by Checkbox

To be able to select rows with some sort of checkbox (please provide your own, or use the HTML5 input with type 'checkbox') you need to set a column ID to a special string imported from Blitzar:

Please note that every object in your `rows` array needs an **`id` prop** in order for the selection feature to work.

```js
import { RowSelectionId } from 'blitzar'

const schemaColumns = [
  {
    id: RowSelectionId, // or you can use the string 'BLITZ-TABLE-ROW-SELECTION'
    component: 'input',
    type: 'checkbox',
  },
]
```

For the actual selection checkbox, you can use any component that works with `v-model` and accepts a `boolean` for its `modelValue`. Please Bring Your Own Components. : )

<CodeBlockComponent :importFn="() => import('./Selection.vue')" :importFnRaw="() => import('./Selection.vue?raw')" />

When you search something and then click the _select all_ checkbox in the header, it will select all filtered rows based on your search results.

## Styling

TODO: Styling section will be re-written soon.
