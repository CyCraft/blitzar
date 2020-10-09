<template>
  <div class="q-gutter-lg">
    <BlitzTable
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Default table"
    />
    <div :class="`my-styled-table ${grid ? '_grid' : '_rows'}`">
      <div class="_above-table">
        <h6>Styled table</h6>
        <div @click="grid = true" :class="['_view-toggle', { _active: grid === true }]">
          <!-- prettier-ignore -->
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 2C2.44772 2 2 2.44772 2 3V10C2 10.5523 2.44772 11 3 11H10C10.5523 11 11 10.5523 11 10V3C11 2.44772 10.5523 2 10 2H3ZM4 9V4H9V9H4ZM14 2C13.4477 2 13 2.44772 13 3V10C13 10.5523 13.4477 11 14 11H21C21.5523 11 22 10.5523 22 10V3C22 2.44772 21.5523 2 21 2H14ZM15 9V4H20V9H15ZM13 14C13 13.4477 13.4477 13 14 13H21C21.5523 13 22 13.4477 22 14V21C22 21.5523 21.5523 22 21 22H14C13.4477 22 13 21.5523 13 21V14ZM15 15V20H20V15H15ZM3 13C2.44772 13 2 13.4477 2 14V21C2 21.5523 2.44772 22 3 22H10C10.5523 22 11 21.5523 11 21V14C11 13.4477 10.5523 13 10 13H3ZM4 20V15H9V20H4Z" /></svg>
        </div>
        <div @click="grid = false" :class="['_view-toggle', { _active: grid === false }]">
          <!-- prettier-ignore -->
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 5C2.44772 5 2 5.44772 2 6C2 6.55228 2.44772 7 3 7H3.01C3.56228 7 4.01 6.55228 4.01 6C4.01 5.44772 3.56228 5 3.01 5H3ZM8 5C7.44772 5 7 5.44772 7 6C7 6.55228 7.44772 7 8 7H21C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5H8ZM8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H8ZM7 18C7 17.4477 7.44772 17 8 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H8C7.44772 19 7 18.5523 7 18ZM2 12C2 11.4477 2.44772 11 3 11H3.01C3.56228 11 4.01 11.4477 4.01 12C4.01 12.5523 3.56228 13 3.01 13H3C2.44772 13 2 12.5523 2 12ZM3 17C2.44772 17 2 17.4477 2 18C2 18.5523 2.44772 19 3 19H3.01C3.56228 19 4.01 18.5523 4.01 18C4.01 17.4477 3.56228 17 3.01 17H3Z" /></svg>
        </div>
      </div>
      <BlitzTable
        class="_table"
        :schemaColumns="schemaColumns"
        :schemaGrid="schemaColumns"
        :rows="rows"
        :grid="grid"
        flat
        bordered
        :actionButtons="[]"
      />
    </div>
  </div>
</template>

<style lang="sass">
// @import '@planetar/styles/variables'
$c-stone: #EFF3F9
$c-stone-light: #F6F9FC
$c-stone-dark: #D9E2F1
$c-science: rgba(#0E2348, 0.72)
$c-blue-ribbon: #0563ED

@import url("https://fonts.googleapis.com/css2?family=Open+Sans&family=Poppins:wght@400;500;600;700&display=swap")
=header-globals()
  font-family: 'Poppins', sans-serif
  +C(color, blue-zodiac)
=body-globals()
  font-family: 'Open Sans', sans-serif
  +C(color, blue-zodiac)

=t-body2()
  +body-globals()
  font-weight: $regular
  font-size: 14px
  line-height: 20px
  letter-spacing: 0.01em
=t-caption()
  +header-globals()
  font-weight: $regular
  font-size: 12px
  line-height: 16px
  letter-spacing: 0.02em
=t-caption-semi-bold()
  +header-globals()
  font-weight: $semi-bold
  font-size: 12px
  line-height: 16px
  letter-spacing: 0.02em

.my-styled-table
  /** spacing & layout */
  th
    padding: 12px 24px
  td
    padding: 18px 24px
  ._above-table
    display: flex
    align-items: flex-end
    padding: 0.5rem
    > *:first-child
      margin-right: auto
    ._view-toggle
      margin-left: 0.5rem
      height: 24px
      cursor: pointer
  /** colours */
  thead,
  .q-table__bottom // https://github.com/quasarframework/quasar/issues/7723
    background: $c-stone-light
  ._above-table
    ._view-toggle path
      fill: $c-science
      opacity: 0.7
    ._view-toggle._active path
      fill: $c-blue-ribbon
      opacity: 1
  &._grid
    ._table
      background: $c-stone
    .blitz-table__grid-item
      box-shadow: none
      border-radius: 12px
  /** hovering row color */
  td:before
    background: none !important // todo: prevent this line from being necessary in BlitzTable
  tr:hover
    background: $c-stone-light
  /** borders */
  ._table
    border: thin solid $c-stone-dark
    border-radius: 12px
  .q-table__bottom
    border-top: thin solid $c-stone-dark
  thead, tr, th,td
    border-color: $c-stone-dark
  /** typography */
  th
    +t-caption-semi-bold()
  td
    +t-body2()
  .q-table__bottom,
  .q-table__bottom span
    +t-caption()
  &._grid
    .blitz-field__component
      +t-body2()
    .blitz-field__label
      +t-caption()
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
# Styling via CSS

There are two ways you can style a BlitzTable: via css or via props.

I believe that styling should be done in CSS as much as possible. When doing styling via props you're basically mixing data with styling, and the more your app grows, the more annoying this becomes to work with in my experience.

## Styling with props

That said, if you really want, you can still use the "styling" related props from [Quasar's QTable](https://quasar.dev/vue-components/table#QTable-API), because all props not used by BlitzTable are passed to the QTable it's wrapping.

## Styling with CSS (recommended)

Check out this example's "style" tab to see how styling is applied!

> Please note that the classes that you _should_ target with CSS, are currently still rough.
> Improvement of which classes to target is still a WIP while we're in BETA.
 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns, grid: false }
  },
}
</script>
