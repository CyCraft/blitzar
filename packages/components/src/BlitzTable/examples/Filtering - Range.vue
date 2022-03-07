<script lang="ts" setup>
import { BlitzFilterOptions, BlitzColumn } from '@blitzar/types'
import { markRaw, onMounted, ref } from 'vue'
import BlitzTable from '../BlitzTable.vue'
import BlitzPagination from '../../BlitzPagination/BlitzPagination.vue'
import BlitzFilters from '../../BlitzFilters/BlitzFilters.vue'
import BlitzInput from '../../BlitzInput/BlitzInput.vue'

const blitzPagination = markRaw(BlitzPagination)
const blitzFilters = markRaw(BlitzFilters)
const blitzInput = markRaw(BlitzInput)

const schemaColumnsAndGrid: BlitzColumn[] = [
  {
    id: 'avatarUrl',
    label: 'Avatar',
    component: 'img',
    mode: 'edit',
    src: (val: any) => val,
    dynamicProps: ['src'],
  },
  { id: 'firstName', label: 'First Name' },
  {
    id: 'birthdate',
    label: 'Birthdate',
    parseValue: (val: any) =>
      new Date(val).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
  },
  { id: 'balance', label: 'Balance', parseValue: (val: any) => val.toLocaleString() },
  { id: 'isActive', label: 'Online', parseValue: (val: any) => (val ? '🟢' : '🔴') },
  {
    id: 'favoriteAnimal',
    label: 'Animal',
    style: 'font-size: 2.5em',
    parseValue: (val: any) => {
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

const filterOptions: BlitzFilterOptions = {
  balance: [
    { value: 60000, op: '>' },
    { value: 70000, op: '<' },
    {
      component: blitzInput,
      defaultValue: 60000,
      type: 'number',
      compareFn: (userInput, cellVal) => cellVal > userInput,
    },
    {
      label: '～',
      component: blitzInput,
      defaultValue: 70000,
      type: 'number',
      compareFn: (userInput, cellVal) => cellVal < userInput,
    },
  ],
  birthdate: [
    { value: new Date(1945, 0, 1), op: '>' },
    { value: new Date(1955, 11, 31), op: '<' },
    {
      component: blitzInput,
      defaultValue: new Date(1945, 0, 1),
      type: 'date',
      compareFn: (userInput, cellVal) => new Date(cellVal) > userInput,
    },
    {
      label: '～',
      component: blitzInput,
      defaultValue: new Date(1955, 11, 31),
      type: 'date',
      compareFn: (userInput, cellVal) => new Date(cellVal) < userInput,
    },
  ],
}

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
