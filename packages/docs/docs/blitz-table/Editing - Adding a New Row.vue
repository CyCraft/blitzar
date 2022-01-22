<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { ref, reactive, markRaw } from 'vue'
import { BlitzGridToggle } from 'blitzar'
import 'blitzar/dist/style.css'

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
])

const addInfo = reactive({
  isShowingModal: false,
  remountCounter: 0,
})

function openAddModal() {
  // increment the `remountCounter` to force the BlitzForm to remount to display an empty form
  addInfo.remountCounter++

  // show the modal
  addInfo.isShowingModal = true
}

function addNewRow(saveEventPayload) {
  // the updated form data from the @save event of the BlitzForm
  const newData = saveEventPayload.newData

  // add a random ID
  newData.id = Math.random().toString()

  // push the new row into the rows array
  rows.value.push(newData)

  // hide the modal again
  addInfo.isShowingModal = false
}

const schemaColumnsAndGrid = [
  { id: 'firstName', label: 'First Name', component: 'input' },
  { id: 'lastName', label: 'Last Name', component: 'input' },
  { id: 'company', label: 'Company', component: 'input' },
  { id: 'birthdate', label: 'Birthdate', component: 'input' },
  {
    id: 'balance',
    label: 'Balance',
    component: 'input',
    type: 'number',
    defaultValue: 0,
    parseValue: (val, { mode }) => (mode === 'raw' ? (val || 0).toLocaleString() : val),
    parseInput: (inputString) => Number(inputString),
  },
]
</script>

<template>
  <button @click="openAddModal">Add New Row</button>

  <BlitzTable
    :schemaColumns="schemaColumnsAndGrid"
    :schemaGrid="schemaColumnsAndGrid"
    :rows="rows"
    :gridToggleField="{ component: blitzGridToggle }"
  />

  <!-- Blitzar does not come with a modal library
    The example below uses `vue-final-modal`
    However, you can use any modal library you want -->
  <VueFinalModal v-model="addInfo.isShowingModal" classes="form-modal">
    <!-- show a BlitzForm in a modal -->
    <BlitzForm
      :key="addInfo.remountCounter"
      :schema="schemaColumnsAndGrid"
      :actionButtons="['edit', 'cancel', 'save']"
      :columnCount="2"
      @cancel="addInfo.isShowingModal = false"
      @save="(payload) => addNewRow(payload)"
    />
  </VueFinalModal>
</template>

<style scoped>
:deep(.blitz-table--grid-card) {
  border: thin solid #dfe2e5;
}
:deep(.blitz-table--grid-card input) {
  min-width: 0;
}
:deep(.form-modal) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.form-modal > *) {
  background: white;
  padding: 1.5rem;
}
</style>
