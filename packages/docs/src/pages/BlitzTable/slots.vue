<template>
  <div class="slots-demo">
    <QBtnToggle
      class="_button-toggle"
      v-model="chosenExample"
      noCaps
      spread
      :options="[
        { label: 'v-slot:above-table', value: 0 },
        { label: 'v-slot:top-right', value: 1 },
        { label: 'all top slots', value: 2 },
      ]"
    />
    <EasyTable
      v-if="chosenExample === 0"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      :flat="true"
      :filter="filter"
    >
      <template v-slot:above-table>
        <QInput
          v-model="filter"
          outlined
          dense
          placeholder="Search for Lesson by title, topic, or subject"
          class="q-my-md"
        >
          <template v-slot:prepend>
            <QIcon name="search" />
          </template>
        </QInput>
      </template>
    </EasyTable>
    <EasyTable
      v-if="chosenExample === 1"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      :flat="true"
      :filter="filter"
    >
      <template v-slot:top-right>
        <QInput
          v-model="filter"
          outlined
          dense
          placeholder="Search for Lesson by title, topic, or subject"
          class="full-width"
        >
          <template v-slot:prepend>
            <QIcon name="search" />
          </template>
        </QInput>
      </template>
    </EasyTable>
    <EasyTable
      v-if="chosenExample === 2"
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      :flat="true"
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
    </EasyTable>
  </div>
</template>

<style lang="sass">
.slots-demo
  .easy-field__label
    font-weight: 100
  ._slot-preview
    padding: 1rem
    border: thin solid goldenrod
  ._button-toggle
    border: solid 2px $primary
    border-radius: 6px
    > *
      border-radius: 3px
</style>

<script>
import { EasyTable } from 'blitzar'
import { QBtnToggle, QIcon, QInput } from 'quasar'

const rows = [
  { nameFirst: 'Eleanor', nameLast: 'Shellstrop' },
  { nameFirst: 'Chidi', nameLast: 'Anagonye' },
]

const schemaColumns = [
  { id: 'nameFirst', label: 'First Name', component: 'input' },
  { id: 'nameLast', label: 'Last Name', component: 'input' },
]

/**
You can use slots with EasyTable.

## EasyTable specific slots

- above-nav-row
- above-table

## Quasar's QTable slots

You can use all Quasar slots "around" the table. However, EasyTable uses these slots to generate its content: `body` for the rows, `item` for the cards in grid mode.

If you find yourself in a spot where you also want to use slots for the rows or items, you are probably better off using a regular QTable, perhaps in combination with quasar-easy-forms. Feel free to look at my source code for how I built the EasyTable component.
 */
export default {
  components: { EasyTable, QBtnToggle, QIcon, QInput },
  data() {
    return {
      chosenExample: 0,
      filter: '',
      schemaColumns,
      rows,
    }
  },
}
</script>
