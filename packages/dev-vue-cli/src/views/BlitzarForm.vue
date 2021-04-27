<template>
  <div>
    <BlitzForm
      :key="remountCount"
      :actionButtons="actionButtons"
      :columnCount="2"
      :schema="schema"
      @save="onSave"
    />
    <BlitzTable
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Title"
    />
  </div>
</template>

<script>
import { BlitzTable, BlitzForm } from 'blitzar'

const schema = [
  {
    id: 'title',
    label: 'Title',
    component: 'input',
    type: 'text',
    span: 1,
  },
  // {
  //   component: 'a',
  //   href: 'https://google.com',
  //   slot: 'google.com (<a> component)',
  //   componentStyle: 'color: blue',
  //   span: true,
  // },
  {
    id: 'isDone',
    label: 'Done?',
    component: 'input',
    type: 'checkbox',
    span: 1,
  },
]
const rows = [{ title: '', isDone: true }]
const schemaColumns = [
  { id: 'title', label: 'Title', component: 'input' },
  { id: 'isDone', label: 'Is Done', component: 'input' },
]

export default {
  name: 'BlitzarForm',
  components: { BlitzForm, BlitzTable },
  data() {
    const actionButtons = ['save', 'edit', 'cancel']
    const items = [
      { title: 'Now you see me', isDone: true },
      { title: "Now you don't", isDone: false },
    ]
    return { schema, items, actionButtons, remountCount: 0, rows, schemaColumns }
  },
  methods: {
    onSave({ newData }) {
      console.log(`newData → `, newData)
      this.items.push({ ...newData })
      console.log(`this.items updated → `, this.items)
      this.remountCount++
    },
  },
}
</script>

<style>
</style>
