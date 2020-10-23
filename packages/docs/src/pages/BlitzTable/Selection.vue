<template>
  <div>
    <BlitzTable
      selection="multiple"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      flat
      bordered
    />
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzTable } from 'blitzar'

const rows = [
  { nameFirst: 'Eleanor', nameLast: 'Shellstrop', id: 'nkbiu4LA9yZx' },
  { nameFirst: 'Chidi', nameLast: 'Anagonye', id: 'S6XPiAO6IhLi' },
]

const schemaColumns = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]

/**
# Selection

By default selection is implemented for both table and grid view, however, every row NEEDS an 'id' prop in order for it to work.

CSS can be overwritten with these classes:
- `.blitz-table__grid-item.selected`
- `.blitz-table__row.selected`
 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
