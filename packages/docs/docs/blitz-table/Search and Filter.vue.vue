<template>
  <div>
    <input placeholder="🔍" v-model="searchText" style="margin-bottom: 1rem" />
    
    <BlitzTable
      :filter="searchText"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="My Lessons"
      flat
      bordered
    />
  </div>
</template>

<script>
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

export default {
  data() {
    return {
      rows,
      schemaColumns,
      searchText: '',
    }
  },
}
</script>
