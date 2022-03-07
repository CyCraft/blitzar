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
  {
    // you need to add a column `id` even if it doesn't have/need one
    //   just to make the column searchable
    id: 'fullName',
    label: 'Full Name',
    parseValue: (val, { formData }) => `${formData.firstName} ${formData.lastName}`,
  },
  {
    // you need to add a column `id` even if it doesn't have/need one
    //   just to make the column searchable
    id: 'initials',
    label: 'Initials',
    parseValue: (val, { formData }) => `${formData.firstName[0]}.${formData.lastName[0]}.`,
  },
]

const rows = ref([
  {
    firstName: 'Harper',
    lastName: 'Nolan',
  },
  // other rows loaded asynchronously
])

onMounted(async () => {
  rows.value = (await import('./users.json')).default
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
