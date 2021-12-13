---
editLink: true
---

# BlitzTable

## Basics

`<BlitzTable />` is a _**data table**_ component you can use with the same `schema` syntax of [BlitzForms](/blitz-form/) to define your columns.

A schema array describes the columns/fields for:

- the columns of the BlitzTable
- the fields per card when BlitzTable is in grid-view
- you can also show an editable BlitzForm in a dialog when clicking a row

Under the hood BlitzTable uses Quasar's QTable but applies custom logic to be able to use the BlitzForm `schema` syntax for columns and grid-cards.

### Basic Example

Here we see a basic example for a BlitzTable. Check out the _template_ and _script_ tabs below to see how easy it is to render a data table based on the schema.

<CodeBlockComponent :importFn="() => import('./Basics - Basic Example.vue')" :importFnRaw="() => import('./Basics - Basic Example.vue?raw')" />

### Advanced Example

This is a more advanced example with title field, search field and grid toggle. It also parses some of the data to show it differently in the table. All the concepts used here are explained one by one in the following chapters.

<CodeBlockComponent :importFn="() => import('./Basics - Advanced Example.vue')" :importFnRaw="() => import('./Basics - Advanced Example.vue?raw')" />

### Example using HTML5 Components

<!-- the whole idea is to .... blablablabla -->

<CodeBlockComponent :importFn="() => import('./Basics - Example HTML5 Components.vue')" :importFnRaw="() => import('./Basics - Example HTML5 Components.vue?raw')" />

### Using Custom Components

<!-- the whole idea is to .... blablablabla -->

## Grid View

<!-- <CodeBlockComponent :importFn="() => import('./Search and Filter.vue')" :importFnRaw="() => import('./Search and Filter.vue?raw')" /> -->

## Search and Filter Data

<!-- <CodeBlockComponent :importFn="() => import('./Search and Filter.vue')" :importFnRaw="() => import('./Search and Filter.vue?raw')" /> -->

## Sorting Rows

<!-- <CodeBlockComponent :importFn="() => import('./Search and Filter.vue')" :importFnRaw="() => import('./Search and Filter.vue?raw')" /> -->

## Column Features

Because every column is based on a BlitzForm field, there is quite some flexibility what you can do with a column. Below are some examples of this.

### Mutating Columns

<!-- <CodeBlockComponent :importFn="() => import('./Search and Filter.vue')" :importFnRaw="() => import('./Search and Filter.vue?raw')" /> -->

### Combining Columns

This is an example of a table with combined columns. A combined column is one that shows data based on other fields/columns.

In this example the "full name" is combined on the fly when showing the table and immidiately made "sortable" as well.

<!-- <CodeBlockComponent :importFn="() => import('./Computed Columns.vue')" :importFnRaw="() => import('./Computed Columns.vue?raw')" /> -->

## Editing

There are various ways to implement the ability to edit table data. Below I show case 4 ways to easily implement editing. Each time you can check the _template_ and _script_ tabs to check how it can be implemented.

### Edit on Button Click

Since a `<BlitzTable />` is based on the [BlitzForms](/blitz-form/) schema system, it's possible to easily implement stuff like inline editing; popup editing; or show an editable form on a row click.

<!-- <CodeBlockComponent :importFn="() => import('./Editing - On Button Click.vue')" :importFnRaw="() => import('./Editing - On Button Click.vue?raw')" /> -->

### Edit on Row Click

<!-- <CodeBlockComponent :importFn="() => import('./Editing - On Row Click.vue')" :importFnRaw="() => import('./Editing - On Row Click.vue?raw')" /> -->

### Edit Inline

<!-- <CodeBlockComponent :importFn="() => import('./Editing - Inline.vue')" :importFnRaw="() => import('./Editing - Inline.vue?raw')" /> -->

### Edit Inline on Cell Double-Click

<!-- <CodeBlockComponent :importFn="() => import('./Editing - Inline on Cell Double-Click.vue')" :importFnRaw="() => import('./Editing - Inline on Cell Double-Click.vue?raw')" /> -->

### Adding a New Record

<!-- <CodeBlockComponent :importFn="() => import('./Editing - Adding a New Record.vue')" :importFnRaw="() => import('./Editing - Adding a New Record.vue?raw')" /> -->

## Selection

By default selection is implemented for both table and grid view. Play around with the example below to see how it works.

Please note that every row NEEDS an 'id' prop in order for it to work.

<!-- <CodeBlockComponent :importFn="() => import('./Selection.vue')" :importFnRaw="() => import('./Selection.vue?raw')" /> -->

### Styling Selection

You can pass a custom checkbox component via `selectionComponentProps`, an object that represents a BlitzForm blueprint. Just like you would use in a schema. Eg.:

```html
<BlitzTable :selectionComponentProps="{ component: 'MyCheckbox', class: 'table-checkbox' }" />
```

The CSS for the selected rows or grid-items can also be overwritten by targeting these classes:

- `.blitz-table__row.selected`
- `.blitz-table__grid-item.selected`

<!-- <CodeBlockComponent :importFn="() => import('./Selection - Styling.vue')" :importFnRaw="() => import('./Selection - Styling.vue?raw')" /> -->

### Selection with search

Here is an example of selection together with search.

When clicking select all it will only select

<!-- <CodeBlockComponent :importFn="() => import('./Selection - Search.vue')" :importFnRaw="() => import('./Selection - Search.vue?raw')" /> -->

## Slots

You can use slots with BlitzTable.

### BlitzTable Specific Slots

- above-nav-row
- above-table

### Quasar's QTable Slots

You can use all Quasar slots "around" the table. However, BlitzTable uses these slots to generate its content: `body` for the rows, `item` for the cards in grid mode.

If you find yourself in a spot where you also want to use slots for the rows or items, you are probably better off using a regular QTable, perhaps in combination with a [BlitzForm](/blitz-form/). Feel free to look at my source code for how I built the BlitzTable component.

<!-- <CodeBlockComponent :importFn="() => import('./Slots.vue')" :importFnRaw="() => import('./Slots.vue?raw')" /> -->

## Styling

There are two ways you can style a BlitzTable: via CSS or via props.

I believe that styling should be done in CSS as much as possible. When doing styling via props you're basically mixing data with styling, and the more your app grows, the more annoying this becomes to work with in my experience.

### Styling with CSS (Recommended)

CSS classes to target:

- `.blitz-table` — the entire table component (or set your own class like so: `<BlitzTable class="my-table" />`)
- `.blitz-table--rows` — the table when its in "table mode"
- `.blitz-table--grid` — the table when its in "grid mode"
- `.blitz-table__top` — the top section which holds the title and "grid" button; excluding the table header
- `.blitz-table__title` — the title inside the top section
- `.blitz-table__action-button` — the grid button and others passed to the `actionButtons` prop in the top section
- `.blitz-table__header` — the header with just the column names
- `.blitz-table__footer` — the table footer with pagination etc.

In table mode:

- `tr` — targets rows (including the header row)
- `th` — targets header cells
- `td` — targets body cells

In grid mode:

- `.blitz-table__grid-item` — targets the grid card
- `.blitz-field__label` — targets the field label on a card
- `.blitz-field__component` — targets the field content

Check out this example's _**style tab**_ to see how styling is applied!

<!-- <CodeBlockComponent :importFn="() => import('./Styling - Via CSS.vue')" :importFnRaw="() => import('./Styling - Via CSS.vue?raw')" /> -->

#### Row Hover Color

As you can see in the example above, to modify the row hover color, you need to disable the default background on `td:before` and then set your color on `tr:hover` like so:

```css
td:before
  background: none !important
tr:hover
  background: var(--my-awesome-color)
```

### Reusable Complex Styling

Here is an example of complex styling. Above the table there is a manual implementation of a title and grid/rows toggle button.

It is still possible to make this re-usable throughout your app! You can create a _**wrapper component**_ that wraps `<BlitzTable />` and adds your custom style and title sections.

To make sure you can still use any BlitzTable props on your wrapper component, you can simply pass all `$attrs` to BlitzTable. Check the _script_ tab of this example to see how this is done.

<!-- <CodeBlockComponent :importFn="() => import('./Styling - Reusable Complex Styling.vue')" :importFnRaw="() => import('./Styling - Reusable Complex Styling.vue?raw')" /> -->

### Styling via Props

You can use these styling related props in your `schemaColumns` on a _per column_ basis:

- `classes`
- `style`
- `headerClasses`
- `headerStyle`
- `cellClasses` — can be an Evaluated Prop function that receives the `rowData`
- `cellStyle` — can be an Evaluated Prop function that receives the `rowData`

Props usable on the table:

- `rowStyle` — can be an Evaluated Prop function that receives the `rowData`
- `rowClasses` — can be an Evaluated Prop function that receives the `rowData`
- `cardClass` — can be an Evaluated Prop function that receives the `rowData`
- `cardStyle` — can be an Evaluated Prop function that receives the `rowData`

Other general styling props you can use:

- `tableClass`
- `tableStyle`
- `tableHeaderClass`
- `tableHeaderStyle`
- `cardContainerClass`
- `cardContainerStyle`
- `titleClass`

In the example below we use conditional rowStyle and cardStyle as Dynamic Props. Try changing the team colors!

<!-- <CodeBlockComponent :importFn="() => import('./Styling - Via Props.vue')" :importFnRaw="() => import('./Styling - Via Props.vue?raw')" /> -->
