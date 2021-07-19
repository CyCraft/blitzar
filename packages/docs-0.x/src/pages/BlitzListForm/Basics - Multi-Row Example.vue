<template>
  <div>
    <b>Expenses</b><br />
    <BlitzListForm class="my-multi-row-form" :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass">
.my-multi-row-form
  .blitz-list-form__row
    grid-template-columns: 20px 1fr 1fr 100px !important
    > *:last-child
      grid-column: 2 / -1

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
  },
  {
    id: 'type',
    label: 'Type',
    component: 'select',
    slot: [
      { component: 'option', value: '', slot: '' },
      { component: 'option', value: 'personal', slot: 'Personal' },
      { component: 'option', value: 'work', slot: 'Work' },
    ],
  },
  {
    id: 'amount',
    label: 'Amount',
    component: 'input',
    type: 'number',
    parseInput: Number,
  },
  {
    id: 'paid for',
    label: 'Paid for',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    id: 'comment',
    label: 'Comment',
    component: 'input',
  },
]

/**
## Multi-Row Example

When you need each row to be multiple rows, you can do so with some CSS tweaking.

See the _**style tab**_ how this is done for the example below.
 */
export default {
  components: { BlitzListForm },
  data() {
    return { schema, formData: [] }
  },
  methods: {},
}
</script>
