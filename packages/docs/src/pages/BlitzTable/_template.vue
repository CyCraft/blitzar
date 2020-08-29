<template>
  <div>
    <EasyTable
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="My Lessons"
      :flat="true"
    />
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { EasyTable } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput, QSelect } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)
Vue.component('QSelect', QSelect)

const rows = []
const schemaColumns = []

export default {
  components: { EasyTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
