<template>
  <div class="slots-demo">
    example:
    <select class="mb-md" v-model="chosenExample">
      <option value="0">v-slot:above-table</option>
      <option value="1">v-slot:top-right</option>
      <option value="2">all slots</option>
    </select>
    <!-- EXAMPLE: v-slot:above-table -->
    <BlitzTable
      v-if="chosenExample === '0'"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      flat
      bordered
      :filter="filter"
    >
      <template v-slot:above-table>
        <input
          v-model="filter"
          placeholder=" 🔍 Search for Lesson by title, topic, or subject"
          class="q-my-md"
        />
      </template>
    </BlitzTable>
    <!-- EXAMPLE: v-slot:top-right -->
    <BlitzTable
      v-if="chosenExample === '1'"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      flat
      bordered
      :filter="filter"
    >
      <template v-slot:top-right>
        <input
          v-model="filter"
          placeholder=" 🔍 Search for Lesson by title, topic, or subject"
          class="full-width"
        />
      </template>
    </BlitzTable>
    <!-- EXAMPLE: all slots -->
    <BlitzTable
      v-if="chosenExample === '2'"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      flat
      bordered
      :filter="filter"
    >
      <template v-slot:above-nav-row>
        <div class="_slot-preview">&lt;template v-slot:above-nav-row&gt;&lt;/template&gt;</div>
      </template>
      <template v-slot:top-left>
        <div class="_slot-preview">&lt;template v-slot:top-left&gt;&lt;/template&gt;</div>
      </template>
      <template v-slot:top-right>
        <div class="_slot-preview">&lt;template v-slot:top-right&gt;&lt;/template&gt;</div>
      </template>
      <template v-slot:above-table>
        <div class="_slot-preview">&lt;template v-slot:above-table&gt;&lt;/template&gt;</div>
      </template>
    </BlitzTable>
  </div>
</template>

<style lang="sass">
.slots-demo
  .blitz-field__label
    font-weight: 100
  ._slot-preview
    padding: 1rem
    border: thin solid goldenrod
</style>

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

export default {
  components: { BlitzTable },
  data() {
    return {
      chosenExample: '0',
      filter: '',
      schemaColumns,
      rows,
    }
  },
}
</script>
