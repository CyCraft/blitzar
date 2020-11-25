<template>
  <div>
    <BlitzTable
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
  { nameFirst: 'Eleanor', nameLast: 'Shellstrop' },
  { nameFirst: 'Chidi', nameLast: 'Anagonye' },
  { nameFirst: 'Jason', nameLast: 'Mendoza' },
  { nameFirst: 'Tahani', nameLast: 'Al-Jamil' },
]

const schemaColumns = [
  {
    id: 'fullName',
    label: 'Full name',
    component: 'input',
    parseValue: (val, { formData, fieldInput }) => {
      const value = `${formData.nameFirst || ''} ${formData.nameLast || ''}`.trim()
      fieldInput({ id: 'fullName', value })
      return value
    },
  },
]

/**
# Computed Columns

This is an example of a table with computed columns. A computed column is one that shows data based on other fields/columns.

In this example the "full name" is computed on the fly when showing the table and immidiately made "sortable" as well.
 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
