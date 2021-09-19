---
editLink: true
---

# BlitzListForm

## Basics

In some cases you might need a form that's actually a _**list**_ users can fill in. Eg. Have a form where a teacher can write down names of students in a list.

For this I prepared a special kind of form called a `<BlitzListForm />` that offers these features:

- Auto populates the next empty row whenever there is user input
- Rows can have multiple input fields defined by the same schema syntax as BlitzForm
- Can be used as standalone component or inside a BlitzForm between other fields
- Saves the data as an array

### Basic Example

See it in action in the example down here! Write down some student names to see the formData update.

<CodeBlockComponent filename="blitz-list-form/Basics - Basic Example" />

### Advanced Example

When you check the _**script tab**_ of this more advanced example, you'll notice we are using some new props available on our context of the Dynamic Props. (Be sure to check out the documentation at [Advanced > Dynamic Props](/advanced/#dynamic-props))

There are 4 _extra_ props available on the context when using BlitzListForm:

- `rowInput` (function)
- `deleteRow` (function)
- `rowIndex` (number)
- `rowData` (object or array)
- (all other context props as the BlitzForm documentation also available)

This example uses `deleteRow` and `rowIndex` to create a list form where you can delete rows from:

<CodeBlockComponent filename="blitz-list-form/Basics - Advanced Example" />

### Multi-Row Example

When you need each row to be multiple rows, you can do so with some CSS tweaking.

See the _**style tab**_ how this is done for the example below.

<CodeBlockComponent filename="blitz-list-form/Basics - Multi-Row Example" />

## BlitzForm Example

You can use the BlitzListForm inside a BlitzForm. See how that's done in this example:

<CodeBlockComponent filename="blitz-list-form/BlitzForm Example" />
