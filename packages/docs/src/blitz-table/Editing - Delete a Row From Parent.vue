<script setup>
import { BlitzTable, BlitzGridToggle } from 'blitzar'
import { markRaw, ref } from 'vue'

const blitzGridToggle = markRaw(BlitzGridToggle)

const rows = ref([
  {
    id: 'id8269187329780852',
    balance: 93683,
    birthdate: '1946-07-22',
    firstName: 'Harper',
    lastName: 'Nolan',
    company: 'Tortor At Risus LLC',
  },
  { id: 'id44304518826349204', balance: 69632, birthdate: '1945-11-27', firstName: 'Whoopi', lastName: 'David', company: 'Ipsum Institute' }, // prettier-ignore
  { id: 'id5068577691466047', balance: 75903, birthdate: '1955-10-01', firstName: 'Peter', lastName: 'Mendez', company: 'Curabitur Dictum LLC' }, // prettier-ignore
])

const schemaWithDeleteLogic = [
  {
    mode: 'edit',
    component: 'button',
    slot: '⛔️',
    events: {
      /**
       * @param {PointerEvent} pointerEvent
       * @param {import('blitzar').FormContext} formContext
       */
      click: (pointerEvent, formContext) => {
        // you can use the row ID to filter out the row:
        const idToDelete = formContext.rowData.id
        rows.value = rows.value.filter((r) => r.id !== idToDelete)

        // you could also use the rowIndex to delete the row like so:
        /**
        const indexToDelete = formContext.rowIndex
        rows.value.splice(indexToDelete, 1)
        */
      },
    },
  },
  { id: 'firstName', label: 'First Name', component: 'input' },
  { id: 'lastName', label: 'Last Name', component: 'input' },
  { id: 'company', label: 'Company', component: 'input' },
  { id: 'birthdate', label: 'Birthdate', component: 'input' },
  {
    id: 'balance',
    label: 'Balance',
    component: 'input',
    type: 'number',
    parseInput: (inputString) => Number(inputString),
  },
]
</script>

<template>
  <BlitzTable
    :schemaColumns="schemaWithDeleteLogic"
    :schemaGrid="schemaWithDeleteLogic"
    :rows="rows"
    :gridToggleField="{ component: blitzGridToggle }"
  />
</template>

<style scoped>
:deep(.blitz-table--grid-card) {
  border: thin solid #dfe2e5;
}
:deep(.blitz-table--grid-card input) {
  min-width: 0;
}
</style>
