<script setup>
import BlitzTable from '../BlitzTable.vue'
import { markRaw, onMounted, ref } from 'vue'
import BlitzInput from '../../BlitzInput/BlitzInput.vue'
import BlitzGridToggle from '../../BlitzGridToggle/BlitzGridToggle.vue'
import BlitzPagination from '../../BlitzPagination/BlitzPagination.vue'

const blitzInput = markRaw(BlitzInput)
const blitzGridToggle = markRaw(BlitzGridToggle)
const blitzPagination = markRaw(BlitzPagination)

const schemaColumnsAndGrid = [
  { id: 'name.first', label: 'First Name' },
  { id: 'name.last', label: 'Last Name' },
]

const rows = ref([
  { name: { first: 'Harper', last: 'Nolan' } },
  // other rows loaded asynchronously
])

onMounted(async () => {
  const _module = await import('./users-nested.json')
  const users = _module.default
  rows.value = users
})
</script>

<template>
  <div>
    <BlitzTable
      :schemaColumns="schemaColumnsAndGrid"
      :schemaGrid="schemaColumnsAndGrid"
      :rows="rows"
      :rowsPerPage="5"
      :searchField="{
        component: blitzInput,
        placeholder: 'Search...',
        debounce: 300,
        clearable: true,
      }"
      :gridToggleField="{ component: blitzGridToggle }"
      :paginationField="{ component: blitzPagination }"
      :rowsPerPageField="{
        label: 'Rows per page:',
        component: blitzInput,
        type: 'select',
        options: [
          { value: 5, label: '5' },
          { value: 10, label: '10' },
          { value: 20, label: '20' },
          { value: 50, label: '50' },
          { value: 100, label: '100' },
        ],
      }"
      :shownRowsInfoField="{ component: 'div' }"
    />
  </div>
</template>

<style scoped>
:deep(.blitz-table--grid-card) {
  border: thin solid #dfe2e5;
}
</style>
