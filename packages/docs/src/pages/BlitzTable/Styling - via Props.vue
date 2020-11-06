<template>
  <BlitzTable
    :schemaColumns="schemaColumns"
    :schemaGrid="schemaColumns"
    :rows="rows"
    title="Users"
    flat
    bordered
    tableHeaderClass="bg-stone t-caption-semi-bold"
  />
</template>

<style lang="sass"></style>

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
## Styling via Props

You can use the "styling" related props from [Quasar's QTable](https://quasar.dev/vue-components/table#QTable-API), because all props not used by BlitzTable are passed to QTable.

Props usable on the columns schema:
- classes
- style
- headerClasses
- headerStyle
- cellClasses (can be an evaluated prop function that receives the `rowData`)
- cellStyle (can be an evaluated prop function that receives the `rowData`)

Props usable on the table:
- rowStyle (can be an evaluated prop function that receives the `rowData`)
- rowClasses (can be an evaluated prop function that receives the `rowData`)
- cardClass (can be an evaluated prop function that receives the `rowData`)
- cardStyle (can be an evaluated prop function that receives the `rowData`)

Other props inherited from QTable:
- tableClass
- tableStyle
- tableHeaderClass
- tableHeaderStyle
- cardContainerClass
- cardContainerStyle
- titleClass

 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
