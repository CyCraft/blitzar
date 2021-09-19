<template>
  <div>
    <!-- Our wrapper component makes use of a fully custom top title section -->
    <div :class="`title-section-above-table`">
      <h6>{{ title }}</h6>
      <!-- prettier-ignore -->
      <svg @click="grid = true" :class="['_grid-rows-toggle', { _active: grid === true }]" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M3 2C2.44772 2 2 2.44772 2 3V10C2 10.5523 2.44772 11 3 11H10C10.5523 11 11 10.5523 11 10V3C11 2.44772 10.5523 2 10 2H3ZM4 9V4H9V9H4ZM14 2C13.4477 2 13 2.44772 13 3V10C13 10.5523 13.4477 11 14 11H21C21.5523 11 22 10.5523 22 10V3C22 2.44772 21.5523 2 21 2H14ZM15 9V4H20V9H15ZM13 14C13 13.4477 13.4477 13 14 13H21C21.5523 13 22 13.4477 22 14V21C22 21.5523 21.5523 22 21 22H14C13.4477 22 13 21.5523 13 21V14ZM15 15V20H20V15H15ZM3 13C2.44772 13 2 13.4477 2 14V21C2 21.5523 2.44772 22 3 22H10C10.5523 22 11 21.5523 11 21V14C11 13.4477 10.5523 13 10 13H3ZM4 20V15H9V20H4Z" />
      </svg>
      <!-- prettier-ignore -->
      <svg @click="grid = false" :class="['_grid-rows-toggle', { _active: grid === false }]" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M3 5C2.44772 5 2 5.44772 2 6C2 6.55228 2.44772 7 3 7H3.01C3.56228 7 4.01 6.55228 4.01 6C4.01 5.44772 3.56228 5 3.01 5H3ZM8 5C7.44772 5 7 5.44772 7 6C7 6.55228 7.44772 7 8 7H21C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5H8ZM8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H8ZM7 18C7 17.4477 7.44772 17 8 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H8C7.44772 19 7 18.5523 7 18ZM2 12C2 11.4477 2.44772 11 3 11H3.01C3.56228 11 4.01 11.4477 4.01 12C4.01 12.5523 3.56228 13 3.01 13H3C2.44772 13 2 12.5523 2 12ZM3 17C2.44772 17 2 17.4477 2 18C2 18.5523 2.44772 19 3 19H3.01C3.56228 19 4.01 18.5523 4.01 18C4.01 17.4477 3.56228 17 3.01 17H3Z" />
      </svg>
    </div>
    
    <!-- Then we embed BlitzTable and pass any other props with `v-bind="propsToPass"` -->
    <BlitzTable
      v-bind="propsToPass"
      :class="`complex-table ${grid ? 'mode-grid' : 'mode-rows'}`"
      :grid="grid"
    />
  </div>
</template>

<style lang="sass">
/**
 * All the styling you need for your table is defined just once
 * in this wrapper component! So your actual app stays very DRY!
 */

/** For the sake of the example we import some sass helpers from another library */
@import '@planetar/styles/variables'

/** Styling for table title and grid toggle */
.title-section-above-table
  /** spacing & layout */
  display: flex
  align-items: flex-end
  padding: 0.5rem
  > *:first-child
    margin-right: auto
  ._grid-rows-toggle
    margin-left: 0.5rem
    height: 24px
    cursor: pointer
  /** typography */
  h6
    color: $c-blue-zodiac
  /** colors */
  ._grid-rows-toggle
    color: $c-science
    opacity: 0.7
  ._grid-rows-toggle._active
    color: $c-blue-ribbon
    opacity: 1

/** Styling for actual table */
.complex-table
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
  .blitz-table__header,
  .blitz-table__footer
    background: $c-stone-light
  /** hovering row color */
  td:before
    background: none !important
  tr:hover
    background: $c-stone-light
  /** typography - an example using sass mixins for typography styling */
  th
    +t-caption-semi-bold()
  td
    +t-body2()
  .blitz-table__footer span
    +t-caption()

/** grid mode tweaks */
.complex-table.blitz-table--grid
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
const rows = [
  { nameFirst: 'Eleanor', nameLast: 'Shellstrop' },
  { nameFirst: 'Chidi', nameLast: 'Anagonye' },
  { nameFirst: 'Jason', nameLast: 'Mendoza' },
  { nameFirst: 'Tahani', nameLast: 'Al-Jamil' },
  { nameFirst: 'Janet', nameLast: 'Della-Denunzio' },
  { nameFirst: 'Michael', nameLast: 'Of the bad place' },
  { nameFirst: 'Shawn', nameLast: 'Of the bad place' },
  { nameFirst: 'Simone', nameLast: 'Garnett' },
  { nameFirst: 'Derek', nameLast: 'Hofstetler' },
  { nameFirst: 'John', nameLast: 'Wheaton' },
  { nameFirst: 'Brent', nameLast: 'Norwalk' },
  { nameFirst: 'Mindy', nameLast: 'St. Claire' },
]

// the columns schema is just for the sake of the example
const schemaColumns = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]

export default {
  // This is the code for our example wrapper component
  props: {
    rows: { type: Array, default: () => [...rows] },
    schemaColumns: { type: Array, default: () => [...schemaColumns] },
    schemaGrid: { type: Array, default: () => [...schemaColumns] },
    title: { type: String, default: 'My Styled Table' },
  },
  data() {
    return { grid: false }
  },
  computed: {
    // the `propsToPass` object is passed in the template with `v-bind="propsToPass"`
    propsToPass() {
      const defaults = {
        flat: true,
        bordered: true,
      }
      return {
        ...defaults,
        // Any props we are trying to set that we didn't define in the props of this wrapper component
        // are available on `this.$attrs`!
        ...this.$attrs,
        rows: this.rows,
        schemaColumns: this.schemaColumns,
        schemaGrid: this.schemaGrid,
        actionButtons: [],
      }
    },
  },
}
</script>
