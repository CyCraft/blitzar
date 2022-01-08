<script>
import { onMounted, ref } from 'vue'

const schemaColumnsAndGrid = [
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
    const rows = ref([
      {
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
      schemaColumnsAndGrid,
      rows,
    }
  },
}
</script>

<template>
  <div>
    <BlitzTable
      :schemaColumns="schemaColumnsAndGrid"
      :schemaGrid="schemaColumnsAndGrid"
      :rows="rows"
      :rowsPerPage="5"
      :titleField="{ component: 'h3', slot: 'Users' }"
      :searchField="{
        component: 'input',
        placeholder: 'Search...',
        debounce: 300,
        clearable: true,
      }"
      :gridToggleField="{ label: 'grid', component: 'input', type: 'checkbox' }"
      :paginationField="{
        label: 'Open page:',
        component: 'input',
        type: 'number',
      }"
      :rowsPerPageField="{
        label: 'Rows per page:',
        component: 'select',
        slot: [
          { component: 'option', slot: '5' },
          { component: 'option', slot: '10' },
          { component: 'option', slot: '20' },
          { component: 'option', slot: '50' },
          { component: 'option', slot: '100' },
        ],
      }"
      :shownRowsInfoField="{ component: 'div' }"
    />
  </div>
</template>
