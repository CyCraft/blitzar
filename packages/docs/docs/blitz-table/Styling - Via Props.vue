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

<script>
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

export default {
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
