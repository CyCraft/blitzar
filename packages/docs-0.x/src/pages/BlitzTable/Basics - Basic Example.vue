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
  { nameFirst: 'Janet', nameLast: 'Della-Denunzio' },
  { nameFirst: 'Michael', nameLast: 'Of the bad place' },
  { nameFirst: 'Shawn', nameLast: 'Of the bad place' },
  { nameFirst: 'Simone', nameLast: 'Garnett' },
  { nameFirst: 'Derek', nameLast: 'Hofstetler' },
  { nameFirst: 'John', nameLast: 'Wheaton' },
  { nameFirst: 'Brent', nameLast: 'Norwalk' },
  { nameFirst: 'Mindy', nameLast: 'St. Claire' },
]

const schemaColumns = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]

/**
### Basic Example

Here we see a basic example for a BlitzTable. Check out the _template_ and _script_ tabs below to see how easy it is to render a data table based on the schema.
 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
