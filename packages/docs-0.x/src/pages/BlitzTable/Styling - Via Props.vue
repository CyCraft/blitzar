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
    @update-cell="inputCell"
    tableHeaderClass="bg-stone t-caption-semi-bold"
  />
</template>

<style lang="sass"></style>

<script>
import { BlitzTable } from 'blitzar'

const rows = [
  { id: 'e', nameFirst: 'Eleanor', nameLast: 'Shellstrop', teamColor: '' },
  { id: 'c', nameFirst: 'Chidi', nameLast: 'Anagonye', teamColor: '' },
]

const schemaColumns = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
  {
    id: 'teamColor',
    component: 'select',
    label: 'Team color',
    mode: 'edit',
    slot: [
      { component: 'option', value: '', slot: 'Select one', disabled: true },
      { component: 'option', value: 'slateblue', slot: 'Purple' },
      { component: 'option', value: 'salmon', slot: 'Pink' },
      { component: 'option', value: 'goldenrod', slot: 'Gold' },
    ],
  },
]

function applyTeamColor(rowData) {
  const color = rowData.teamColor
  return `background: ${color}`
}

/**
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
