<template>
  <BlitzTable
    :schemaColumns="schemaColumnsAndGrid"
    :schemaGrid="schemaColumnsAndGrid"
    :rows="rows"
    :gridToggleField="{ component: blitzGridToggle }"
  />

  <!-- Blitzar does not come with a modal library
    The example below uses `vue-final-modal`
    However, you can use any modal library you want -->
  <VueFinalModal classes="form-modal" v-model="editInfo.isShowingModal">
    <!-- show a BlitzForm in a modal -->
    <BlitzForm
      :schema="schemaColumnsAndGrid.slice(1)"
      :modelValue="editInfo.editingRowData"
      :actionButtons="['delete', 'edit', 'cancel', 'save']"
      :columnCount="2"
      :key="editInfo.remountCounter"
      @cancel="editInfo.isShowingModal = false"
      @save="(payload) => saveEdits(payload)"
      @delete="() => deleteEditingRow()"
    />
  </VueFinalModal>
</template>

<style scoped>
::v-deep(.blitz-table--grid-card) {
  border: thin solid #dfe2e5;
}
::v-deep(.blitz-table--grid-card input) {
  min-width: 0;
}
::v-deep(.form-modal) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.form-modal > *) {
  background: white;
  padding: 1.5rem;
}
</style>

<script>
import { VueFinalModal } from 'vue-final-modal'
import { ref, reactive, markRaw } from 'vue'
import { BlitzGridToggle } from 'blitzar'
import 'blitzar/dist/style.css'

const blitzGridToggle = markRaw(BlitzGridToggle)

export default {
  components: { VueFinalModal },
  setup() {
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

    const editInfo = reactive({
      isShowingModal: false,
      editingRowData: null,
      remountCounter: 0,
    })

    function openEditModal(rowData) {
      // set the new form data for the modal
      editInfo.editingRowData = rowData

      // increment the `remountCounter` to force the BlitzForm to remount to display the new form data
      editInfo.remountCounter++

      // show the modal
      editInfo.isShowingModal = true
    }

    function saveEdits(saveEventPayload) {
      // the updated form data from the @save event of the BlitzForm
      const newData = saveEventPayload.newData

      // the row id that is being edited
      const rowId = editInfo.editingRowData.id

      // find the row in the local state
      const rowToUpdate = rows.value.find((r) => r.id === rowId)

      // update the row fields
      Object.assign(rowToUpdate, newData)

      // hide the modal again
      editInfo.isShowingModal = false
    }

    function deleteEditingRow() {
      // the row id that is being edited
      const rowId = editInfo.editingRowData.id

      // find the row index in the local state
      const rowIndexToDelete = rows.value.findIndex((r) => r.id === rowId)

      // splice out the row
      rows.value.splice(rowIndexToDelete, 1)

      // hide the modal again
      editInfo.isShowingModal = false
    }

    const schemaColumnsAndGrid = [
      {
        component: 'button',
        slot: 'Edit',
        mode: 'edit',
        events: {
          click: (event, { formData }) => {
            openEditModal(formData)
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
        parseValue: (val, { mode }) => (mode === 'raw' ? val.toLocaleString() : val),
        parseInput: (inputString) => Number(inputString),
      },
    ]

    return {
      rows,
      schemaColumnsAndGrid,
      editInfo,
      openEditModal,
      saveEdits,
      deleteEditingRow,
      blitzGridToggle,
    }
  },
}
</script>
