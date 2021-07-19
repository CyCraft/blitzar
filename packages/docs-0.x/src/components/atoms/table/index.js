import BlitzTable from './components/BlitzTable.vue'

import { schemaToQTableColumns } from './helpers/schemaToQTableColumns.js'

export { BlitzTable, schemaToQTableColumns }

export default {
  BlitzTable,

  schemaToQTableColumns,

  install(Vue) {
    Vue.component(BlitzTable.name, BlitzTable)
  },
}
