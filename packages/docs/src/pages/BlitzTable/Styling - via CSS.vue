<template>
  <div class="q-gutter-lg">
    <BlitzTable
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Default table"
    />
    <BlitzTable
      :class="`styled-table ${grid ? 'mode-grid' : 'mode-rows'}`"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      :grid="grid"
      flat
      bordered
      title="Styled Table"
    />
  </div>
</template>

<style lang="sass">
@import '@planetar/styles/variables'

/** Styling for actual table */
.styled-table
  /** borders */
  border: thin solid $c-stone-dark
  border-radius: 12px
  .blitz-table__footer
    border-top: thin solid $c-stone-dark
  .blitz-table__header, th, td
    border-color: $c-stone-dark
  /** spacing */
  th
    padding: 12px 24px
  td
    padding: 18px 24px
  /** colors */
  .blitz-table__top,
  .blitz-table__header,
  .blitz-table__footer
    background: $c-stone-light
  .blitz-table__action-button > *
    color: $c-blue-ribbon
  /** hovering row color */
  td:before
    background: none !important
  tr:hover
    background: $c-stone-light
  /** typography - an example using sass mixins for typography styling */
  .blitz-table__title
    color: $c-blue-zodiac
    +t-h6()
  th
    +t-caption-semi-bold()
  td
    +t-body2()
  .blitz-table__footer span
    +t-caption()

/** grid mode tweaks */
.styled-table.blitz-table--grid
  background: $c-stone
  .blitz-table__top
    background: $c-stone
  .blitz-table__grid-item
    box-shadow: none
    border-radius: 12px
    border-color: $c-stone-dark
    .blitz-field__label
      +t-caption()
    .blitz-field__component
      +t-body2()
</style>

<script>
import { BlitzTable } from 'blitzar'

const rows = [
  { nameFirst: 'Eleanor', nameLast: 'Shellstrop' },
  { nameFirst: 'Chidi', nameLast: 'Anagonye' },
]

const schemaColumns = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]

/**
## Styling with CSS (recommended)

CSS classes to target:
- `.blitz-table` (or set your own class like so: `<BlitzTable class="my-table" />`)
- `.blitz-table--rows` the table when its in "table mode"
- `.blitz-table--grid` the table when its in "grid mode"
- `.blitz-table__header`
- `.blitz-table__footer`
- `.blitz-table__top` the top section which holds the title and "grid" button - excluding the table header
- `.blitz-table__title`
- `.blitz-table__action-button` the grid button and others passed to the `actionButtons` prop

In table mode:
- `tr` targets rows (including the header row)
- `th` targets header cells
- `td` targets body cells

In grid mode:
- `.blitz-table__grid-item` targets the grid card
- `.blitz-field__label` targets the field label on a card
- `.blitz-field__component` targets the field content

To modifying the row hover color, you need to disable the default background on `td:before` and then set your color on `tr:hover` like so:
```css
td:before
  background: none !important
tr:hover
  background: $c-stone-light
```

Check out this example's "style tab" to see how styling is applied!
 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns, grid: false }
  },
}
</script>
