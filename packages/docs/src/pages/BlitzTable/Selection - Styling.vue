<template>
  <div class="example-selection-styling">
    <BlitzTable
      selection="multiple"
      :selectionComponentProps="selectionComponentProps"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      flat
      bordered
    />
  </div>
</template>

<style lang="sass">
.example-selection-styling
  .table-checkbox
    cursor: pointer
</style>

<script>
import { BlitzTable } from 'blitzar'
import Vue from 'vue'

Vue.component('MyCheckbox', {
  props: { value: Boolean },
  render(h) {
    const toggle = () => this.$emit('input', !this.value)
    return h('div', { on: { click: toggle } }, this.value ? '✅' : '✓')
  },
})

const rows = [
  { nameFirst: 'Eleanor', nameLast: 'Shellstrop', id: 'nkbiu4LA9yZx' },
  { nameFirst: 'Chidi', nameLast: 'Anagonye', id: 'S6XPiAO6IhLi' },
]

const schemaColumns = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]

/**
## Styling selection

You can pass a custom checkbox component via `selectionComponentProps`, an object that represents a BlitzForm blueprint. Just like you would use in a schema. Eg.:

```html
<BlitzTable
  :selectionComponentProps="{ component: 'MyCheckbox', class: 'table-checkbox' }"
/>
```

CSS can also overwritten by targeting these classes:
- `.blitz-table__grid-item.selected`
- `.blitz-table__row.selected`
 */
export default {
  components: { BlitzTable },
  data() {
    const selectionComponentProps = { component: 'MyCheckbox', class: 'table-checkbox' }
    return { rows, schemaColumns, selectionComponentProps }
  },
}
</script>
