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
- filters
- a search input field
- a grid/table view toggle
- pagination features
- an image rendered with `<img />`
- dates are shown with `toLocaleDateString()`
- numbers are shown with `toLocaleString()`
- Online and Animal columns show text data as emoji

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

Adding a new object to your rows array will be detected by BlitzTable.

- `.unshift()` an object to your rows array & it will appear as the first row.
- `.push()` an object to your rows array & it will appear as the last row.

<CodeBlockComponent :importFn="() => import('./Editing - Adding a New Row.vue')" :importFnRaw="() => import('./Editing - Adding a New Row.vue?raw')" />

### Deleting From Parent

There are a couple ways you can add _delete row_ logic. No way in particular is the _"best"_ way, so check the code of these examples and feel free to use any method.

Here we show an example where the delete logic is handled directly from the parent where you define the `schemaColumns` logic.

<CodeBlockComponent :importFn="() => import('./Editing - Delete a Row From Parent.vue')" :importFnRaw="() => import('./Editing - Delete a Row From Parent.vue?raw')" />

### Deleting via `@rowDeleted`

This example uses the `@rowDeleted` event to then remove the row via index from the rows array.

<CodeBlockComponent :importFn="() => import('./Editing - Delete via row-deleted.vue')" :importFnRaw="() => import('./Editing - Delete via row-deleted.vue?raw')" />

### Deleting via `v-model:rows`

This example uses `v-model:rows` to keep rows in sync when deleting a row.

<CodeBlockComponent :importFn="() => import('./Editing - Delete via update-rows.vue')" :importFnRaw="() => import('./Editing - Delete via update-rows.vue?raw')" />

## Filters

### Filters that Auto-Detect Values

<CodeBlockComponent :importFn="() => import('./Filtering - Auto Detect Filter Values.vue')" :importFnRaw="() => import('./Filtering - Auto Detect Filter Values.vue?raw')" />

### Advanced Filters

It's also possible to completely control how rows get filtered via advanced filters. Here is an example where we provide a `compareFn` which parses a certain field as a `Date` and then compares the year/month and compare that to the user input in the filter field.

With advanced filters besides the `compareFn` you can just pass a `SchemaField` like you can with schemas in blitzar.

<CodeBlockComponent :importFn="() => import('./Filtering - Advanced.vue')" :importFnRaw="() => import('./Filtering - Advanced.vue?raw')" />

## Selection

### Select by Checkbox

To be able to select rows with some sort of checkbox (please provide your own, or use the HTML5 input with type 'checkbox') you need to set a column ID to a special string imported from Blitzar:

Please note that every object in your `rows` array needs an **`id` prop** in order for the selection feature to work.

```js
import { ROW_SELECTION_ID } from 'blitzar'
import 'blitzar/dist/style.css'

const schemaColumns = [
  {
    id: ROW_SELECTION_ID, // or you can use the string 'BLITZ-TABLE-ROW-SELECTION'
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

### Show Row Numbers

This example uses [`parseValue`](/blitz-form/#parsevalue-parseinput) to show row numbers.

<CodeBlockComponent :importFn="() => import('./Styling - Show Row Numbers.vue')" :importFnRaw="() => import('./Styling - Show Row Numbers.vue?raw')" />
