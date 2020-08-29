<template>
  <div>
    <EasyTable :schemaColumns="schemaColumns" :rows="rows" title="My Lessons" :flat="true" />
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { EasyTable } from '@blitzar/table'
// All components that are used in the form need to be globally registered.
import { QInput } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)

const rows = [
  { firstName: 'Taylor', lastName: 'Roach' },
  { firstName: 'Corey', lastName: 'Carson' },
  { firstName: 'Alden', lastName: 'Cantrell' },
  { firstName: 'Ezequiel', lastName: 'Davenport' },
  { firstName: 'Kendrick', lastName: 'Schultz' },
  { firstName: 'Bradyn', lastName: 'Arroyo' },
  { firstName: 'Kade', lastName: 'Craig' },
  { firstName: 'Carissa', lastName: 'Atkinson' },
  { firstName: 'Zaire', lastName: 'Lambert' },
  { firstName: 'Alec', lastName: 'Villanueva' },
  { firstName: 'Sheldon', lastName: 'Rogers' },
  { firstName: 'Celeste', lastName: 'Trujillo' },
]

const schemaColumns = [
  {
    id: 'fullName',
    label: 'Full name',
    component: 'QInput',
    parseValue: (val, { formData, fieldInput }) => {
      const value = `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
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
