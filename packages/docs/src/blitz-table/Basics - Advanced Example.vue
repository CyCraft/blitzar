<script setup>
import { markRaw, onMounted, ref } from 'vue'
import { BlitzInput, BlitzGridToggle, BlitzPagination, BlitzFilters } from 'blitzar'
import 'blitzar/dist/style.css'

const blitzInput = markRaw(BlitzInput)
const blitzGridToggle = markRaw(BlitzGridToggle)
const blitzPagination = markRaw(BlitzPagination)
const blitzFilters = markRaw(BlitzFilters)

const schemaColumnsAndGrid = [
  {
    id: 'avatarUrl',
    label: 'Avatar',
    component: 'img',
    mode: 'edit',
    src: (val) => val,
    dynamicProps: ['src'],
    style: 'min-height: 50px; min-width: 50px', // to prevent UI bounce before images are loaded
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
    avatarUrl: 'https://gravatar.com/avatar/8aa5e7a6220f2a87684a9f4e6286e343?s=50&d=robohash&r=x',
    firstName: 'Harper',
    birthdate: '1946-07-22',
    balance: 93683,
    isActive: false,
    favoriteAnimal: 'owl',
  },
  // other rows loaded asynchronously
])

const filterOptions = {
  isActive: [
    { label: '🟢', value: true },
    { label: '🔴', value: false },
  ],
  favoriteAnimal: [
    { label: 'Cat', value: 'cat' },
    { label: 'Chicken', value: 'chicken' },
    { label: 'Cow', value: 'cow' },
    { label: 'Dog', value: 'dog' },
    { label: 'Duck', value: 'duck' },
    { label: 'Horse', value: 'horse' },
    { label: 'Owl', value: 'owl' },
    { label: 'Pig', value: 'pig' },
    { label: 'Rabbit', value: 'rabbit' },
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
      :titleField="{ component: 'h3', slot: 'Users' }"
      :filtersField="{ component: blitzFilters, filterOptions }"
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
