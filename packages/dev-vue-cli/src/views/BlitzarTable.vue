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

export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>