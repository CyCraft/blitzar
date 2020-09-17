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
import { BlitzTable } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput, QSelect } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)
Vue.component('QSelect', QSelect)

const rows = []
const schemaColumns = []

export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
