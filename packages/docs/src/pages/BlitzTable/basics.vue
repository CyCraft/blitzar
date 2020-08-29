<template>
  <div>
    <BlitzTable
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      :flat="true"
    />
  </div>
</template>

<style lang="stylus" scoped></style>

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
`<BlitzTable />` is Quasar's QTable but with the allows you to define columns & grid-cards via the schema syntax of [BlitzForms](/docs/blitz-form).

A single schema object describing the fields in your data can be used for:
- defining the columns of a BlitzTable
- defining the fields to show on each card for the grid-view of the BlitzTable
- a BlitzForm to be show in a pop-up on eg. clicking a row

Of course you can also use all of Quasar's QTable props on <BlitzTable /> and they will be passed to <QTable />.

See below the interactive demo. You can check the source code, as well as _edit_ any prop and see its effect immidiately!
 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
