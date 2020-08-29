<template>
  <div>
    <BlitzTable
      @row-click="rowClick"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="My Lessons"
      :flat="true"
    />
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import DialogWrapper from '../../components/DialogWrapper.vue'
import { BlitzTable, BlitzForm } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput, QSelect, QImg, QToggle, date, Dialog } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)
Vue.component('QSelect', QSelect)
Vue.component('QImg', QImg)
Vue.component('QToggle', QToggle)
Vue.component('BlitzForm', BlitzForm)
Vue.component('DialogWrapper', DialogWrapper)

const rows = [
  {
    title: 'Mathematica',
    topic: 'curriculum',
    subject: 'We will look at the curriculum of the Mathematica √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=160',
    grade: 90000,
    passing: true,
    created: new Date(),
    classes: [{ label: 'One', value: '1' }],
  },
  {
    title: 'Films',
    topic: 'split',
    subject: 'We will look at the split of the Films √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=160',
    grade: 80000,
    passing: false,
    created: new Date('2020/01/01'),
    classes: [{ label: 'One', value: '1' }],
  },
  {
    title: 'Winds',
    topic: 'north',
    subject: 'We will look at the north of the Winds √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=160',
    grade: 120000,
    passing: false,
    created: new Date(),
    classes: [{ label: 'Two', value: '2' }],
  },
  {
    title: 'Apps',
    topic: 'hotdog',
    subject: 'We will look at the hotdog of the Apps √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=160',
    grade: 25,
    passing: true,
    created: new Date('1990-01-01'),
    classes: [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
    ],
  },
  {
    title: 'Computers',
    topic: 'hardware',
    subject: 'We will look at the hardware of the Computers √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=160',
    grade: 0,
    passing: false,
    created: new Date(),
    classes: [{ label: 'One', value: '1' }],
  },
]

const schemaColumns = [
  {
    id: 'title',
    label: 'Lesson Title',
    component: 'QInput',
  },
  {
    id: 'topic',
    label: 'Topic',
    component: 'QInput',
  },
  {
    id: 'subject',
    label: 'Subject',
    component: 'QInput',
  },
  {
    id: 'img',
    label: 'Image',
    component: 'QImg',
    mode: 'view',
    evaluatedProps: ['src'],
    internalErrors: true,
    // component props:
    src: (val) => val,
  },
  {
    id: 'grade',
    label: 'Grade',
    component: 'QInput',
    // component props:
    type: 'number',
  },
  {
    id: 'passing',
    label: 'Passing',
    component: 'QToggle',
    default: false,
  },
  {
    id: 'created',
    label: 'Created at',
    component: 'QInput',
    parseInput: (val) => new Date(val),
    parseValue: (val) => date.formatDate(val, 'YYYY/MM/DD'),
    // component props:
    mask: '####/##/##',
    placeholder: 'YYYY/MM/DD',
  },
  {
    id: 'classes',
    label: 'Classes',
    component: 'QSelect',
    // component props:
    multiple: true,
    options: [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
      { label: 'Three', value: '3' },
    ],
  },
]

export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
  methods: {
    rowClick(event, rowData) {
      const _rows = this.rows
      Dialog.create({
        // tell Quasar's Dialog plugin to use DialogWrapper.vue
        component: 'DialogWrapper',
        // tell DialogWrapper.vue to use a BlitzForm
        slotComponent: 'BlitzForm',
        // props bound to BlitzForm via v-bind="slotProps"
        slotProps: {
          actionButtons: ['edit', 'cancel', 'save'],
          value: rowData,
          schema: schemaColumns,
          class: 'q-pa-lg',
        },
        // events bound to BlitzForm via v-on="slotEvents"
        slotEvents: ({ hide }) => ({
          cancel: hide,
          save: ({ newData }) => {
            const { id: rowId } = rowData
            const rowToUpdate = _rows.find((r) => r.id === rowId)
            Object.entries(newData).forEach(([fieldId, value]) => {
              rowToUpdate[fieldId] = value
            })
            hide()
          },
        }),
      })
    },
  },
}
</script>
