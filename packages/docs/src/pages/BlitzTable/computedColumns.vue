<template>
  <div>
    <EasyTable
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
import { EasyTable } from 'blitzar'

const rows = [
  { nameFirst: 'Eleanor', nameLast: 'Shellstrop' },
  { nameFirst: 'Chidi', nameLast: 'Anagonye' },
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
This is an example of a table with computed columns. A computed column is when you want a column in your table that should show data which doesn't exist on your actual records.

In this example the "full name" is computed on the fly when showing the table and immidiately made "sortable" as well.
 */
export default {
  components: { EasyTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
