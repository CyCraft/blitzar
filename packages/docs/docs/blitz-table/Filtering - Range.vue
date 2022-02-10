<script setup>
import { BlitzTable, BlitzPagination, BlitzFilters } from 'blitzar'
import { markRaw, onMounted, ref } from 'vue'
import users from './users.json'

const blitzPagination = markRaw(BlitzPagination)
const blitzFilters = markRaw(BlitzFilters)

/** @type {(import('blitzar').BlitzColumn)[]} */
const schemaColumnsAndGrid = [
  {
    id: 'avatarUrl',
    label: 'Avatar',
    component: 'img',
    mode: 'edit',
    src: (val) => val,
    dynamicProps: ['src'],
  },
  { id: 'firstName', label: 'First Name' },
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
  { id: 'isActive', label: 'Online', parseValue: (val) => (val ? '🟢' : '🔴') },
  {
    id: 'favoriteAnimal',
    label: 'Animal',
    style: 'font-size: 2.5em',
    parseValue: (val) => {
      if (val === 'cat') return '🐱'
      if (val === 'chicken') return '🐔'
      if (val === 'cow') return '🐮'
      if (val === 'dog') return '🐶'
      if (val === 'duck') return '🦆'
      if (val === 'horse') return '🐴'
      if (val === 'owl') return '🦉'
      if (val === 'pig') return '🐷'
      if (val === 'rabbit') return '🐰'
      return '??'
    },
  },
]
const rows = ref([
  {
    avatarUrl: 'https://gravatar.com/avatar/8aa5e7a6220f2a87684a9f4e6286e343?s=100&d=robohash&r=x',
    firstName: 'Harper',
    birthdate: '1946-07-22',
    balance: 93683,
    isActive: false,
    favoriteAnimal: 'owl',
  },
  // other rows loaded asynchronously
])

/** @type {import('blitzar').BlitzFilterOptions} */
const filterOptions = {
  balance: [
    { label: '', value: 60000, op: '>' },
    { label: '', value: 70000, op: '<' },
  ],
  birthdate: [
    { label: '', value: new Date(1945, 0, 1), op: '>' },
    { label: '', value: new Date(1955, 11, 31), op: '<' },
  ],
}

onMounted(async () => {
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
      :filtersField="{ component: blitzFilters, filterOptions }"
      :paginationField="{ component: blitzPagination }"
      :rowsPerPageField="{ label: 'Rows per page:', component: 'input', type: 'number' }"
      :shownRowsInfoField="{ component: 'div' }"
    />
  </div>
</template>

<style scoped>
:deep(.blitz-table--grid-card) {
  border: thin solid #dfe2e5;
}
</style>
