<template>
  <BlitzTable
    :schemaColumns="schemaWithEditingLogic"
    :schemaGrid="schemaWithEditingLogic"
    :rows="rows"
    :gridToggleField="{ component: blitzGridToggle }"
    @updateCell="({ rowId, colId, value }) => onUpdateCell({ rowId, colId, value })"
    @cellDblclick="(mouseEvent, rowData, colId) => onCellDblclick(mouseEvent, rowData, colId)"
  />
</template>

<style scoped>
::v-deep(.blitz-table--grid-card) {
  border: thin solid #dfe2e5;
}
::v-deep(.blitz-table--grid-card input) {
  min-width: 0;
}
</style>

<script>
import { reactive, markRaw, computed } from 'vue'
import { BlitzGridToggle } from 'blitzar'

const blitzGridToggle = markRaw(BlitzGridToggle)

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
    parseInput: (inputString) => Number(inputString),
  },
]

const rows = [
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
]

function autoFocusInput(mouseEvent) {
  const cellEl = mouseEvent.srcElement.parentElement
  setTimeout(() => {
    const inputEl = cellEl.querySelector('input')
    if (inputEl) inputEl.focus()
  }, 0)
}

export default {
  setup() {
    const editInfo = reactive({ editingColId: '', editingRowId: '', lastEdit: null })

    function onUpdateCell({ rowId, colId, value }) {
      editInfo.lastEdit = { rowId, colId, value }
    }

    function onCellDblclick(mouseEvent, rowData, colId) {
      console.log(`@cellDblclick (mouseEvent, rowData, colId) → `, mouseEvent, rowData, colId)
      editInfo.editingColId = colId
      editInfo.editingRowId = rowData.id
      // auto focus logic:
      autoFocusInput(mouseEvent)
    }

    function stopEditing() {
      editInfo.editingRowId = ''
      editInfo.editingColId = ''
      editInfo.lastEdit = null
    }

    function saveLastEdit() {
      if (!editInfo.lastEdit) return stopEditing()

      const { rowId, colId, value } = editInfo.lastEdit

      const row = rows.find((r) => r.id === rowId)
      if (!row) return stopEditing()

      row[colId] = value
      stopEditing()
    }

    const schemaWithEditingLogic = computed(() => {
      // return the columns with the added logic to edit & save data
      return schemaColumnsAndGrid.map((blueprint) => {
        return {
          ...blueprint,
          /**
           * The editing logic for every schema blueprint is dynamically setting the "mode" of a cell.
           * It does this based on the colId and rowId which are being edited.
           */
          dynamicProps: ['mode'],
          mode: (val, { formData }) =>
            editInfo.editingColId === blueprint.id && editInfo.editingRowId === formData.id
              ? 'edit'
              : 'raw',
          events: {
            keydown: (event) => {
              if (event.code === 'Enter') saveLastEdit()
              if (event.code === 'Escape') stopEditing()
            },
            blur: () => saveLastEdit(),
          },
        }
      })
    })

    return {
      rows,
      schemaWithEditingLogic,
      onCellDblclick,
      onUpdateCell,
      blitzGridToggle,
    }
  },
}
</script>
