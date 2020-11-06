<template>
  <BlitzTable
    :rowStyle="rowStyle"
    :cardStyle="cardStyle"
    :schemaColumns="schemaColumns"
    :schemaGrid="schemaColumns"
    :rows="rows"
    title="Users"
    flat
    bordered
    @input-cell="inputCell"
    tableHeaderClass="bg-stone t-caption-semi-bold"
  />
</template>

<style lang="sass"></style>

<script>
import { BlitzTable } from 'blitzar'

const rows = [
  { id: 'e', nameFirst: 'Eleanor', nameLast: 'Shellstrop', team: '' },
  { id: 'c', nameFirst: 'Chidi', nameLast: 'Anagonye', team: '' },
]

const schemaColumns = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
  {
    id: 'team',
    component: 'select',
    label: 'Team color',
    mode: 'edit',
    slot: [
      { component: 'option', value: '', slot: '' },
      { component: 'option', value: 'slateblue', slot: 'Purple' },
      { component: 'option', value: 'salmon', slot: 'Pink' },
      { component: 'option', value: 'goldenrod', slot: 'Gold' },
    ],
  },
]

function applyTeamColor(rowData) {
  const color = rowData.team
  return `background: ${color}`
}

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

In the example below we use conditional rowStyle and cardStyle as evaluated props. Try changing the team colors!
 */
export default {
  components: { BlitzTable },
  data() {
    const rowStyle = applyTeamColor
    const cardStyle = applyTeamColor
    return { rows, schemaColumns, rowStyle, cardStyle }
  },
  methods: {
    inputCell({ rowId, colId, value, origin }) {
      const row = this.rows.find((r) => r.id === rowId)
      if (!row) return
      row[colId] = value
    },
  },
}
</script>
