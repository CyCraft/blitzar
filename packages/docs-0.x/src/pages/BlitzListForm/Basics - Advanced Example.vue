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
    evaluatedProps: ['disabled'],
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

/**
### Advanced Example

When you check the _**script tab**_ of this more advanced example, you'll notice we are using some new props available on our context of the Evaluated Props. (Be sure to check out the [documentation on Evaluated Props](#evaluated-props) of BlitzForm)

There are 4 _extra_ props available on the context when using BlitzListForm:
- `rowInput` (function)
- `deleteRow` (function)
- `rowIndex` (number)
- `rowData` (object or array)
- (all other context props as the BlitzForm documentation also available)

This example uses `deleteRow` and `rowIndex` to create a list form where you can delete rows from:
 */
export default {
  components: { BlitzListForm },
  data() {
    return { schema, formData: [] }
  },
  methods: {},
}
</script>
