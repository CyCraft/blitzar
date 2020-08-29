import EasyTable from './components/EasyTable.vue'

import schemaToQTableColumns from './helpers/schemaToQTableColumns.js'

export { EasyTable, schemaToQTableColumns }

export default {
  EasyTable,

  schemaToQTableColumns,

  install (Vue) {
    Vue.component(EasyTable.name, EasyTable)
  },
}
