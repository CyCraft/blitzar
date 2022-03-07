<script setup>
import { markRaw, onMounted, ref } from 'vue'
import BlitzTable from '../BlitzTable.vue'
import BlitzInput from '../../BlitzInput/BlitzInput.vue'

const blitzInput = markRaw(BlitzInput)

const schemaColumns = [
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'company', label: 'Company' },
  { id: 'birthdate', label: 'Birthdate' },
  { id: 'balance', label: 'Balance', parseValue: (val) => val.toLocaleString() },
]

const rows = ref([
  {
    balance: 93683,
    birthdate: '1946-07-22',
    firstName: 'Harper',
    lastName: 'Nolan',
    company: 'Tortor At Risus LLC',
  },
])

function flipRows() {
  rows.value.reverse()
}

onMounted(async () => {
  rows.value = (await import('./users.json')).default.slice(0, 10)
})
</script>

<template>
  <BlitzTable
    class="my-table"
    :schemaColumns="schemaColumns"
    :rows="rows"
    :searchField="{
      component: blitzInput,
      placeholder: 'Search...',
      debounce: 300,
      clearable: true,
    }"
  >
    <div>Custom slot content! Let's render some buttons:</div>
    <button @click="() => flipRows()">flip rows ↕</button>
  </BlitzTable>
</template>
