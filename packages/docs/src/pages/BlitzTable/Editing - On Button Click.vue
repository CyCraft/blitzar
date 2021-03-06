<template>
  <div>
    <BlitzTable
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="My Lessons"
      flat
      bordered
    />
    <!-- Blitzar does not come with a modal library
         The example below uses `vue-final-modal`
         However, you can use any modal library you want -->
    <vue-final-modal classes="form-modal" v-model="isShowingModal">
      <!-- show a BlitzForm in a modal -->
      <BlitzForm
        :schema="schemaColumns.slice(1)"
        :value="modalFormData"
        :actionButtons="['edit', 'cancel', 'save']"
        :columnCount="2"
        :key="remountCounter"
        @cancel="isShowingModal = false"
        @save="(payload) => saveModalFormData(payload)"
      />
    </vue-final-modal>
  </div>
</template>

<style lang="sass">
.form-modal
  display: flex
  justify-content: center
  align-items: center
  > *
    background: white
    padding: 1.5rem
</style>

<script>
import { BlitzTable, BlitzForm } from 'blitzar'

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
    created: '2020-12-06',
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
    created: '2020-12-06',
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

/**
## Edit on Button Click

Since a `<BlitzTable />` is based on the [BlitzForms](/docs/blitz-form) schema system, it's possible to easily implement stuff like inline editing; popup editing; or show an editable form on a row click.
 */
export default {
  components: { BlitzTable, BlitzForm },
  data() {
    return {
      rows,
      isShowingModal: false,
      modalFormData: null,
      remountCounter: 0,
    }
  },
  methods: {
    openModal(formData) {
      // set the new form data for the modal
      this.modalFormData = formData

      // increment the `remountCounter` to force the BlitzForm to remount to display the new form data
      this.remountCounter++

      // show the modal
      this.isShowingModal = true
    },
    saveModalFormData(saveEventPayload) {
      // the updated form data from the @save event of the BlitzForm
      const newData = saveEventPayload.newData

      // the row id that is being edited
      const rowId = this.modalFormData.id

      // find the row in the local state
      const rowToUpdate = this.rows.find((r) => r.id === rowId)

      // update the rows fields
      Object.entries(newData).forEach(([fieldId, value]) => {
        rowToUpdate[fieldId] = value
      })

      // hide the modal again
      this.isShowingModal = false
    },
  },
  computed: {
    schemaColumns() {
      const { openModal } = this

      return [
        {
          id: 'edit-btn',
          component: 'button',
          slot: 'Edit',
          mode: 'view',
          events: {
            click: (event, { formData }) => {
              openModal(formData)
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
          defaultValue: false,
        },
        {
          id: 'created',
          label: 'Created at',
          component: 'input',
          type: 'date',
        },
      ]
    },
  },
}
</script>
