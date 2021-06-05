<template>
  <div>
    <BlitzTable
      :schemaColumns="schemaColumnsWithEditLogic"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="My Lessons"
      flat
      bordered
      @cell-dblclick="cellDblclick"
      @input-cell="inputCell"
    />
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzTable } from 'blitzar'

const rows = [
  {
    id: 'Lorem',
    title: 'Mathematica',
    topic: 'curriculum',
    subject: 'We will look at the curriculum of the Mathematica √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 90000,
    passing: true,
    created: '1990-06-22',
  },
  {
    id: 'ipsum',
    title: 'Films',
    topic: 'split',
    subject: 'We will look at the split of the Films √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 80000,
    passing: false,
    created: '2020-01-01',
  },
  {
    id: 'dolor',
    title: 'Winds',
    topic: 'north',
    subject: 'We will look at the north of the Winds √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 120000,
    passing: false,
    created: '1990-06-22',
  },
  {
    id: 'sit',
    title: 'Apps',
    topic: 'hotdog',
    subject: 'We will look at the hotdog of the Apps √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 25,
    passing: true,
    created: '1990-01-01',
  },
  {
    id: 'amet',
    title: 'Computers',
    topic: 'hardware',
    subject: 'We will look at the hardware of the Computers √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 0,
    passing: false,
    created: '1990-06-22',
  },
]

const schemaColumns = [
  {
    id: 'title',
    label: 'Lesson Title',
    component: 'input',
    span: 2,
  },
  {
    id: 'topic',
    label: 'Topic',
    component: 'input',
  },
  {
    id: 'subject',
    label: 'Subject',
    component: 'input',
  },
  {
    id: 'img',
    label: 'Image',
    component: 'img',
    evaluatedProps: ['src'],
    src: (val) => val,
    mode: 'view',
  },
  {
    id: 'grade',
    label: 'Grade',
    component: 'input',
    type: 'number',
  },
  {
    id: 'passing',
    label: 'Passing',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    id: 'created',
    label: 'Created at',
    component: 'input',
    type: 'date',
  },
]

/**
 * The editing logic for every schema blueprint is dynamically setting the "mode" of a cell.
 * It does this based on the colId and rowId which are being edited.
 */
const editingLogic = (blueprintId, { editingColId, editingRowId, saveLastEdit, stopEditing }) => ({
  // mode is an Evaluated Prop. See BlitzForm documentation for more info:
  evaluatedProps: ['mode'],
  mode: (val, { formData }) =>
    editingColId === blueprintId && formData.id === editingRowId ? 'edit' : 'raw',
  events: {
    keydown: (event) => {
      if (event.code === 'Enter') saveLastEdit()
      if (event.code === 'Escape') stopEditing()
    },
    blur: saveLastEdit,
  },
})

/**
## Edit Inline on Cell Double-Click
 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns, editingColId: '', editingRowId: '', lastEdit: null }
  },
  computed: {
    schemaColumnsWithEditLogic() {
      const { editingColId, editingRowId, saveLastEdit, stopEditing } = this
      const editingLogicContext = { editingColId, editingRowId, saveLastEdit, stopEditing }
      // return the columns with the added logic to edit & save data
      return schemaColumns.map((blueprint) => {
        if (blueprint.id === 'img') return blueprint
        return {
          ...blueprint,
          ...editingLogic(blueprint.id, editingLogicContext),
        }
      })
    },
  },
  methods: {
    saveLastEdit() {
      if (!this.lastEdit) return this.stopEditing()
      const { rowId, colId, value } = this.lastEdit
      const row = this.rows.find((r) => r.id === rowId)
      row[colId] = value
      this.stopEditing()
    },
    stopEditing() {
      this.editingColId = ''
      this.lastEdit = null
    },
    cellDblclick(mouseEvent, rowData, colId) {
      this.editingColId = colId
      this.editingRowId = rowData.id
      // auto focus logic:
      const cellEl = mouseEvent.srcElement.parentElement
      this.$nextTick(() => {
        const inputEl = cellEl.querySelector('input')
        if (inputEl) inputEl.focus()
      })
    },
    inputCell({ rowId, colId, value, origin }) {
      this.lastEdit = { rowId, colId, value }
    },
  },
}
</script>
