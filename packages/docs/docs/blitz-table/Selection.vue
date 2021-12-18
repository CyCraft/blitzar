<template>
  <div>
    <details>
      <summary>Selected rows ({{ selectedRows.length }})</summary>
      <pre class="_preview">{{ selectedRows }}</pre>
    </details>
    <!-- <pre>{{ selectedRows.length }}</pre> -->

    <BlitzTable
      v-model:selectedRows="selectedRows"
      :schemaColumns="schemaColumnsAndGrid"
      :schemaGrid="schemaColumnsAndGrid"
      :rows="rows"
      :rowsPerPage="5"
      :titleField="{ component: 'h3', slot: 'Users' }"
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
::v-deep(.blitz-table--grid-card) {
  border: thin solid #dfe2e5;
}

._preview {
  max-height: 500px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.9);
  color: white;
}
</style>

<script>
import { markRaw, onMounted, ref } from 'vue'
import { ROW_SELECTION_ID } from 'blitzar'
import 'blitzar/dist/style.css'
import { BlitzInput, BlitzGridToggle, BlitzPagination } from 'blitzar'
import 'blitzar/dist/style.css'

const blitzInput = markRaw(BlitzInput)
const blitzGridToggle = markRaw(BlitzGridToggle)
const blitzPagination = markRaw(BlitzPagination)

const schemaColumnsAndGrid = [
  { id: ROW_SELECTION_ID, label: 'Select', component: 'input', type: 'checkbox' },
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'company', label: 'Company' },
  {
    id: 'birthdate',
    label: 'Birthdate',
    parseValue: (val) =>
      new Date(val).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
  },
  { id: 'balance', label: 'Balance', parseValue: (val) => val.toLocaleString() },
]

export default {
  setup() {
    const selectedRows = ref([])

    const rows = ref([
      {
        id: 'EA265B20-45F2-953C-C534-3E2A7862059C',
        balance: 93683,
        birthdate: '1946-07-22',
        firstName: 'Harper',
        lastName: 'Nolan',
        company: 'Tortor At Risus LLC',
      },
      // other rows loaded asynchronously
    ])

    onMounted(async () => {
      const _module = await import('./users.json')
      const users = _module.default
      rows.value = users
    })

    return {
      selectedRows,
      blitzInput,
      blitzGridToggle,
      blitzPagination,
      schemaColumnsAndGrid,
      rows,
    }
  },
}
</script>
