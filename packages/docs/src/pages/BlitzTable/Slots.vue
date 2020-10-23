<template>
  <div class="slots-demo">
    <select class="mb-md" v-model="chosenExample">
      <option value="0">example: v-slot:above-table</option>
      <option value="1">example: v-slot:top-right</option>
      <option value="2">example: all slots</option>
    </select>
    <BlitzTable
      v-if="chosenExample === '0'"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      flat
      bordered
      :filter="filter"
    >
      <template v-slot:above-table>
        <input
          v-model="filter"
          placeholder=" 🔍 Search for Lesson by title, topic, or subject"
          class="q-my-md"
        />
      </template>
    </BlitzTable>
    <BlitzTable
      v-if="chosenExample === '1'"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      flat
      bordered
      :filter="filter"
    >
      <template v-slot:top-right>
        <input
          v-model="filter"
          placeholder=" 🔍 Search for Lesson by title, topic, or subject"
          class="full-width"
        />
      </template>
    </BlitzTable>
    <BlitzTable
      v-if="chosenExample === '2'"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      flat
      bordered
      :filter="filter"
    >
      <template v-slot:above-nav-row>
        <div class="_slot-preview">&lt;template v-slot:above-nav-row&gt;&lt;/template&gt;</div>
      </template>
      <template v-slot:top-left>
        <div class="_slot-preview">&lt;template v-slot:top-left&gt;&lt;/template&gt;</div>
      </template>
      <template v-slot:top-right>
        <div class="_slot-preview">&lt;template v-slot:top-right&gt;&lt;/template&gt;</div>
      </template>
      <template v-slot:above-table>
        <div class="_slot-preview">&lt;template v-slot:above-table&gt;&lt;/template&gt;</div>
      </template>
    </BlitzTable>
  </div>
</template>

<style lang="sass">
.slots-demo
  .blitz-field__label
    font-weight: 100
  ._slot-preview
    padding: 1rem
    border: thin solid goldenrod
</style>

<script>
import { BlitzTable } from 'blitzar'

const rows = [
  { nameFirst: 'Eleanor', nameLast: 'Shellstrop' },
  { nameFirst: 'Chidi', nameLast: 'Anagonye' },
]

const schemaColumns = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]

/**
# Slots

You can use slots with BlitzTable.

## BlitzTable specific slots

- above-nav-row
- above-table

## Quasar's QTable slots

You can use all Quasar slots "around" the table. However, BlitzTable uses these slots to generate its content: `body` for the rows, `item` for the cards in grid mode.

If you find yourself in a spot where you also want to use slots for the rows or items, you are probably better off using a regular QTable, perhaps in combination with a [BlitzForm](/docs/blitz-form). Feel free to look at my source code for how I built the BlitzTable component.
 */
export default {
  components: { BlitzTable },
  data() {
    return {
      chosenExample: '0',
      filter: '',
      schemaColumns,
      rows,
    }
  },
}
</script>
