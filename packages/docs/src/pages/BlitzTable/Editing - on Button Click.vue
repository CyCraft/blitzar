<template>
  <div>
    <BlitzTable
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="My Lessons"
      :flat="true"
    />
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import DialogWrapper from '../../components/DialogWrapper.vue'
import { BlitzTable, BlitzForm } from 'blitzar'
import { Dialog } from 'quasar'

const rows = [
  {
    title: 'Mathematica',
    topic: 'curriculum',
    subject: 'We will look at the curriculum of the Mathematica √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 90000,
    passing: true,
    created: '2020-12-06',
  },
  {
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
    title: 'Winds',
    topic: 'north',
    subject: 'We will look at the north of the Winds √/%^×-+÷',
    img:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 120000,
    passing: false,
    created: '2020-12-06',
  },
  {
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
    id: 'edit-btn',
    component: 'button',
    slot: 'Edit',
    mode: 'view',
    events: {
      click: (event, { formData }) => {
        Dialog.create({
          // tell Quasar's Dialog plugin to use DialogWrapper.vue
          component: DialogWrapper,
          parent: this,
          // tell DialogWrapper.vue to use a BlitzForm
          slotComponent: BlitzForm,
          // props bound to BlitzForm via v-bind="slotProps"
          slotProps: {
            actionButtons: ['edit', 'cancel', 'save'],
            value: formData,
            schema: schemaColumns,
            columnCount: 2,
            style: 'padding: 1.5rem',
            mode: 'edit',
          },
          // events bound to BlitzForm via v-on="slotEvents"
          slotEvents: ({ hide }) => ({
            cancel: hide,
            save: ({ newData }) => {
              const { id: rowId } = formData
              const rowToUpdate = rows.find((r) => r.id === rowId)
              Object.entries(newData).forEach(([fieldId, value]) => {
                rowToUpdate[fieldId] = value
              })
              hide()
            },
          }),
        })
      },
    },
  },
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
    default: false,
  },
  {
    id: 'created',
    label: 'Created at',
    component: 'input',
    type: 'date',
  },
]

/**
## Edit on Button Click

Since a `<BlitzTable />` is based on the [BlitzForms](/docs/BlitzForm) schema system, it's possible to easily implement stuff like inline editing; popup editing; or show an editable form on a row click.
 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
