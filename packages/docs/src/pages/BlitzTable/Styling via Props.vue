<template>
  <div>
    <BlitzTable
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="Users"
      :flat="true"
      tableHeaderClass="bg-stone t-caption-semi-bold"
    />
  </div>
</template>

<style lang="sass">
@import '@planetar/styles/index.sass'
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
# Styling via Props

Of course we want to style our tables.

Props usable on the columns schema:
- classes
- style
- headerClasses
- headerStyle

Props usable on the table:
- tableClass
- tableStyle
- tableHeaderClass
- tableHeaderStyle
- cardClass
- cardStyle
- cardContainerClass
- cardContainerStyle
- titleClass

 */
export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
