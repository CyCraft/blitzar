<template>
  <div>
    <b>Expenses</b><br />
    <BlitzListForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass">
.delete-button
  height: 20px
  width: 20px
  color: white
  background: crimson
  border: none
  font-weight: 900
  border-radius: 100%
  outline: none
  display: flex
  justify-content: center
  align-items: center
</style>

<script>
import { BlitzListForm } from 'blitzar'

const schema = [
  // the `deleteRow` function and `rowIndex` props used below are only available in schemas of a BlitzListForm!
  {
    component: 'button',
    slot: '−',
    events: {
      click: (e, { deleteRow }) => deleteRow(),
    },
    dynamicProps: ['disabled'],
    disabled: (val, { rowIndex, formData }) => rowIndex === formData.length,
    componentClasses: 'delete-button',
    span: '20px',
  },
  {
    id: 'type',
    label: 'Type',
    component: 'select',
    slot: [
      { component: 'option', value: '', slot: 'Select one', disabled: true },
      { component: 'option', value: 'personal', slot: 'Personal' },
      { component: 'option', value: 'work', slot: 'Work' },
    ],
  },
  {
    id: 'comment',
    label: 'Comment',
    component: 'input',
  },
  {
    id: 'amount',
    label: 'Amount',
    component: 'input',
    type: 'number',
    parseInput: (val) => Number(val),
  },
  {
    id: 'paid for',
    label: 'Paid for',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
    span: '100px',
  },
]

export default {
  components: { BlitzListForm },
  data() {
    return { schema, formData: [] }
  },
  methods: {},
}
</script>
