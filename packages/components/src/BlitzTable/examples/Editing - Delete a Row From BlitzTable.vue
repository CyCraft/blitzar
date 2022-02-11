<script setup>
import BlitzTable from '../BlitzTable.vue'
import { markRaw, ref } from 'vue'
import BlitzGridToggle from '../../BlitzGridToggle/BlitzGridToggle.vue'

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
  { id: 'id05232596295403691', balance: 53509, birthdate: '1977-06-21', firstName: 'Harrison', lastName: 'Miller', company: 'Enim Etiam Imperdiet Industries' }, // prettier-ignore
  { id: 'id23809333906635666', balance: 93450, birthdate: '2017-11-27', firstName: 'Wendy', lastName: 'Strong', company: 'Ac PC' }, // prettier-ignore
  { id: 'id7894530275645739', balance: 64590, birthdate: '1975-12-10', firstName: 'Kyla', lastName: 'Dalton', company: 'Urna Nec Luctus PC' }, // prettier-ignore
  { id: 'id9425069129254229', balance: 72444, birthdate: '2001-07-31', firstName: 'Aimee', lastName: 'Stephens', company: 'Tempus Incorporated' }, // prettier-ignore
  { id: 'id5539749518518775', balance: 99856, birthdate: '1972-01-28', firstName: 'Phelan', lastName: 'Jennings', company: 'Consectetuer Adipiscing Elit LLP' }, // prettier-ignore
  { id: 'id9413108287279646', balance: 83325, birthdate: '1966-11-17', firstName: 'Xena', lastName: 'Emerson', company: 'Mollis Foundation' }, // prettier-ignore
  { id: 'id8560871658852105', balance: 50981, birthdate: '1995-07-26', firstName: 'Althea', lastName: 'Mcdaniel', company: 'Non Foundation' }, // prettier-ignore
  { id: 'id04508174972460055', balance: 97869, birthdate: '1945-10-01', firstName: 'Shad', lastName: 'Beard', company: 'Mollis Incorporated' }, // prettier-ignore
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
        // you can use the `deleteRow` function available on formContext:
        formContext.deleteRow()

        // but make sure to use v-model on rows!! (see template)
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
    v-model:rows="rows"
    :schemaColumns="schemaWithDeleteLogic"
    :schemaGrid="schemaWithDeleteLogic"
    :gridToggleField="{ component: blitzGridToggle }"
    @updateCell="({ rowId, colId, value }) => onUpdateCell({ rowId, colId, value })"
    @cellDblclick="(mouseEvent, rowData, colId) => onCellDblclick(mouseEvent, rowData, colId)"
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
