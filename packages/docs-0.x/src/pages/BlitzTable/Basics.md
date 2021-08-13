## Basics

`<BlitzTable />` is a _**data table**_ component you can use with the same `schema` syntax of [BlitzForms](/docs/blitz-form) to define your columns.

A schema array describes the columns/fields for:

- the columns of the BlitzTable
- the fields per card when BlitzTable is in grid-view
- you can also show an editable BlitzForm in a dialog when clicking a row

Under the hood BlitzTable uses Quasar's QTable but applies custom logic to be able to use the BlitzForm `schema` syntax for columns and grid-cards.
