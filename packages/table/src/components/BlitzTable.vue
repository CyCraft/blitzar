<template>
  <Dataset
    v-slot="{ ds }"
    :dsData="rows"
    :dsFilterFields="{}"
    :dsSortby="['name']"
    :dsSearchIn="['balance', 'birthdate', 'name', 'company', 'email', 'phone', 'address', 'favoriteAnimal']"
    :dsSearchAs="{}"
  >
    <!-- <div class="row mb-2" :dataPageCount="ds.dsPagecount">
      <div class="col-md-6 mb-2 mb-md-0">
        <DatasetShow :dsShowEntries="selected" @changed="selected = $event" />
      </div>
      <div class="col-md-6">
        <DatasetSearch dsSearchPlaceholder="Search..." />
      </div>
    </div> -->
    <div v-if="viewInner === 'table'">
      <table>
        <thead>
          <tr>
            <th
              v-for="(column, i) in schemaColumns"
              :key="i"
            >{{ column.label || '' }}</th>
          </tr>
        </thead>
        <tbody>
          <DatasetItem class="">
            <template #default="{ row, rowIndex }">
              <BlitzForm
                :formComponent="'tr'"
                :class="
                  [
                    'blitz-table__row',
                    'blitz-row',
                    // rowProps.row.id ? `blitz-row__${rowProps.row.id}` : '',
                    // evaluate(rowClasses, rowProps),
                  ]
                "
                :schema="schemaColumns"
                :modelValue="row"
              >
                <template v-slot="blitzFormCtx">
                    <!-- :class="['blitz-cell', evaluate(field.cellClasses, rowProps)]" -->
                    <!-- :style="evaluate(field.cellStyle, rowProps)" -->
                    <!-- @click="(e) => onCellClick(e, rowProps.row, field.id)" -->
                    <!-- @dblclick="(e) => onCellDblclick(e, rowProps.row, field.id)" -->
                  <td
                    v-for="field in blitzFormCtx.schema"
                    :key="field.id"
                  >
                    <BlitzField
                      v-bind="{
                        ...field,
                        span: undefined,
                        label: undefined,
                        subLabel: undefined,
                        component: field.component || 'div',
                      }"
                      :modelValue="blitzFormCtx.formDataFlat[field.id]"
                    />
                    <!-- @update:modelValue="(val, origin) => onInputCell(rowProps.row.id, field.id, val, origin)" -->
                  </td>
                </template>
              </BlitzForm>
                <!-- :style="evaluate(rowStyle, rowProps)"
                :id="rowProps.row.id"
                :mode="mode"
                :key="rowProps.row.id + JSON.stringify(rowProps.row)"
                @update-field="({ id, value, origin }) => onInputCell(rowProps.row.id, id, value, origin)" -->
            </template>
            <template #noDataFound>
              <div class="col-md-12 pt-2">
                <p class="text-center">No results found</p>
              </div>
            </template>
          </DatasetItem>
        </tbody>
      </table>
    </div>
    
    <div v-if="viewInner === 'grid'">
    </div>
    
    <!-- <div class="row">
      <div class="col-md-12">
        <DatasetItem class="form-row mb-3">
          <template #default="{ row, rowIndex }">
            <div class="col-md-4">
              <div class="card mb-2">
                <div class="card-body pt-3 pb-2 px-3">
                  <h5 class="card-title text-truncate mb-2" :title="`Index: ${rowIndex}`">
                    <span :class="['font-16', statusClass[row.onlineStatus]]">⬤</span>
                    {{ row.name }}
                  </h5>
                  <h6 class="card-subtitle text-truncate text-muted">{{ row.email }}</h6>
                  <p class="card-text text-truncate mb-0">{{ row.balance }}</p>
                  <p class="card-text text-truncate text-right">{{ row.birthdate }}</p>
                </div>
              </div>
            </div>
          </template>
          <template #noDataFound>
            <div class="col-md-12 pt-2">
              <p class="text-center">No results found</p>
            </div>
          </template>
        </DatasetItem>
      </div>
    </div> -->
    <!-- <div class="d-flex flex-md-row flex-column justify-content-between align-items-center">
      <DatasetInfo class="mb-2 mb-md-0" />
      <DatasetPager />
    </div> -->
  </Dataset>
</template>

<style lang="sass">
@import '../index.sass'
</style>

<script>
import { merge } from 'merge-anything'
import { isPlainObject, isFunction, isArray } from 'is-what'
import { BlitzForm, BlitzField } from '@blitzar/form'
import BlitzGridListToggle from './BlitzGridListToggle.vue'
import { schemaToQTableColumns } from '../helpers/schemaToQTableColumns.js'
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow
} from 'vue-dataset'

/**
 * @typedef GridCardProps
 * @type {object}
 * @property {any} key - Row's key
 * @property {object} row - Row object
 * @property {number} rowIndex - Row's index (0 based) in the filtered and sorted table
 * @property {number} pageIndex - Row's index (0 based) in the current page of the filtered and sorted table
 * @property {object} cols - Column definitions
 * @property {object} colsMap - Column mapping (key is column name, value is column object)
 * @property {boolean} selected - (reactive prop) Is row selected? Can directly be assigned new Boolean value which changes selection state"
 * @property {boolean} expand - (reactive prop) Is row expanded? Can directly be assigned new Boolean value which changes expanded state"
 * @property {string} __trClass - Internal prop passed down to QTr (if used)
 */

/**
Here you can find all the information on the available props & events of BlitzTable.

If any of the documentation is unclear, feel free to [open an issue](https://github.com/cycraft/blitzar/issues) to ask for clarification!

BlitzTable ~~uses Quasar's QTable~~ under the hood.
 */
export default {
  name: 'BlitzTable',
  inheritAttrs: false,
  components: {
    BlitzForm,
    BlitzField,
    Dataset,
    DatasetItem,
    DatasetInfo,
    DatasetPager,
    DatasetSearch,
    DatasetShow
  },
  props: {
    /**
     * The schema for the columns you want to generate. (BlitzForm schema format)
     * @type {Record<string, any>[]}
     * @example [{ id: 'nameFirst', label: 'First Name', component: 'input' }, { id: 'nameLast', label: 'Last Name', component: 'input' }]
     * @category column
     */
    schemaColumns: { type: Array, default: undefined },
    /**
     * The schema for the grid cards you want to generate. (BlitzForm schema format)
     * @type {Record<string, any>[]}
     * @example [{ id: 'nameFirst', label: 'First Name', component: 'input' }, { id: 'nameLast', label: 'Last Name', component: 'input' }]
     * @category column
     */
    schemaGrid: { type: [Array, Object], default: undefined },
    /**
     * Rows of data to display. Use `rows` instead of the QTables `data`. Renamed for clarity.
     * @type {Record<string, any>[]}
     * @example [{ nameFirst: 'Eleanor', nameLast: 'Shellstrop' }, { nameFirst: 'Chidi', nameLast: 'Anagonye' }]
     * @category model
     */
    rows: { type: Array, required: true },
    /**
     * Defaults to 'table' if `schemaColumns` is provided
     * Defaults to 'grid' if `schemaGrid` is provided
     * @type {'table' | 'grid'}
     */
    view: { type: String, default: undefined },
    // /**
    //  * Action buttons to add to the top right of the table. An array of objects just like a BlitzForm schema.
    //  *
    //  * There is also one preset button to toggle between grid- and list-view. This is shown by default, or can be included in the schema array as just the string 'grid' like the example below.
    //  * @example ['grid', { component: 'button', slot: 'log it', events: { click: console.log } }]
    //  * @category content
    //  */
    // actionButtons: { type: Array, default: () => ['grid'] },
    // /**
    //  * The BlitzForm options you want to use for the grid cards. Eg. You can pass `{ actionButtons: [] }` here to include some action buttons on each grid card.
    //  *
    //  * Please note:
    //  * - The `schema` for the grid cards should be set via the `schemaGrid` prop instead of passing it here as `schema`.
    //  * - The BlitzForm used for each grid card will automatically get the row data.
    //  * - See the documentation of BlitzForm for more information on the props you can set.
    //  * @category column
    //  */
    // gridBlitzFormOptions: { type: Object, default: () => ({}) },
    // /**
    //  * Custom styling to be applied to each row. Applied like so `:style="rowStyle"`
    //  * @example 'padding: 1em;'
    //  * @category style
    //  */
    // rowStyle: { type: [Object, Array, String, Function] },
    // /**
    //  * Custom classes to be applied to each row. Applied like so `:class="rowClasses"`
    //  * @example ['dark-theme']
    //  * @category style
    //  */
    // rowClasses: { type: [Object, Array, String, Function] },
    // /**
    //  * An object that represents the checkbox when the table is in "selection" mode. You can tell BlitzTable to use a custom checkbox component instead of the default.
    //  * Defaults to a regular HTML5 checkbox.
    //  * @example { component: 'MyCheckbox', class: 'table-checkbox' }
    //  */
    // selectionComponentProps: {
    //   type: Object,
    //   default: () => ({
    //     component: 'input',
    //     type: 'checkbox',
    //   }),
    // },
    // // Inherited props used here:
    // /**
    //  * @category inherited prop
    //  */
    // grid: { type: Boolean, default: false },
    // /**
    //  * @category inherited prop
    //  * @type {Record<string, any>[]}
    //  */
    // selected: { type: Array, default: () => [] },
    // /**
    //  * CSS classes to apply to the card (when in grid mode).
    //  * You can pass a function which will be evaluated just like an Dynamic Prop. The first param passed will be the entire row data. The second is `item` scoped slot object from a QTable.
    //  * @type {(rowData: Record<string, any>, gridCardProps: GridCardProps, BlitzTableContext: any) => string | Record<string, any> | (string | Record<string, any>)[]}
    //  * @example 'special-class'
    //  * @example :card-class="{ 'my-special-class': [Boolean condition] }"
    //  * @category inherited prop
    //  */
    // cardClass: { type: [Function, String, Array, Object] },
    // /**
    //  * CSS style to apply to the card (when in grid mode).
    //  * You can pass a function which will be evaluated just like an Dynamic Prop. The first param passed will be the entire row data. The second is `item` scoped slot object from a QTable.
    //  * @type {(rowData: Record<string, any>, gridCardProps: GridCardProps, BlitzTableContext: any) => string | Record<string, any> | (string | Record<string, any>)[]}
    //  * @example 'background-color: #fff'
    //  * @example :card-style="{ backgroundColor: '#fff' }"
    //  * @category inherited prop
    //  */
    // cardStyle: { type: [Function, String, Array, Object] },
    // /**
    //  * By default the rows show just the raw data without showing field components. If you set `mode: 'edit'` your entire table will show the actual (editable) component as per your schema.
    //  * @category content
    //  */
    // mode: { type: String, default: 'raw' },
    // // Inherited props with different defaults:
    // // Modified inherited props:
    // /**
    //  * Do not use this! Use `rows` instead of the QTables `data`. Renamed for clarity.
    //  * @category modified prop
    //  */
    // data: { type: Array },
    // /**
    //  * Do not use this! Use `schemaColumns` instead. This is the prop QTable uses to define its columns. BlitzTable uses `schemaColumns` instead.
    //  * @category modified prop
    //  */
    // columns: {},
    // /**
    //  * A title to be placed above your table.
    //  * @category modified prop
    //  */
    // title: { type: String },
    // /**
    //  * Do not use this! This is fixed to `id` in a BlitzTable and cannot be changed.
    //  * @category modified prop
    //  */
    // rowKey: {},
  },
  data() {
    const { view, schemaColumns, schemaGrid } = this
    const hasColumns = !!schemaColumns
    const hasGrid = !!schemaGrid

    // const { grid, selected } = this
    // const innerSelected = selected
    // const gridModeEnabled = grid
    // const innerFilter = filter
    return {
      viewInner: view || (!hasColumns && hasGrid ? 'grid' : 'table'),
      // innerFilter,
      // innerSelected,
      // gridModeEnabled,
      // defaultPagination: {
      //   rowsPerPage: 10,
      // },
      statusClass: {
        Active: 'text-success',
        Away: 'text-warning',
        'Do not disturb': 'text-danger',
        Invisible: 'text-secondary'
      },
      selected: 5
    }
  },
  watch: {
    view(newValue) {
      this.viewInner = newValue
    },
    viewInner(newValue) {
      this.$emit('update:view', newValue)
    },
  },
  computed: {
  },
  methods: {
    evaluate(propValue, rowProps) {
      if (!isFunction(propValue)) return propValue || ''
      return propValue(rowProps.row, rowProps, this) || ''
    },
    setSelectionAllRows(setTo) {
      if (setTo === true) {
        const filteredRowsFromQTable = this.$refs.qtable?.filteredSortedRows
        this.cSelected = isArray(filteredRowsFromQTable) ? filteredRowsFromQTable : this.rows
      } else {
        this.cSelected = []
      }
    },
    onCellDblclick(event, rowData, colId) {
      this.event('row-dblclick', event, rowData)
      this.event('cell-dblclick', event, rowData, colId)
    },
    onCellClick(event, rowData, colId) {
      this.onRowClick(event, rowData)
      this.event('cell-click', event, rowData, colId)
    },
    onRowClick(event, rowData, origin, gridItemProps) {
      const { selectionMode } = this
      if (origin === 'grid' && selectionMode) {
        gridItemProps.selected = !gridItemProps.selected
      }
      this.event('row-click', event, rowData)
    },
    onInputCell(rowId, colId, value, origin) {
      this.event('update-cell', { rowId, colId, value, origin })
    },
    /**
     * @param {'update:pagination' | 'update:selected' | 'row-click' | 'row-dblclick' | 'cell-click' | 'cell-dblclick' | 'update-cell'} eventName
     * @param {...any[]} args
     */
    event(eventName, ...args) {
      if (eventName === 'update:pagination') {
        /**
         * This makes it possible to sync the table pagination like:
         * ```html
         * <BlitzTable :pagination.sync="pagination" />
         * ```
         * See the [Quasar docs](https://quasar.dev/vue-components/table#Pagination) for the exact details on how pagination works.
         * @property {{ sortBy: 'desc' | 'asc', descending: boolean, page: number, rowsPerPage: number, rowsNumber?: number }} payload newPagination
         */
        this.$emit('update:pagination', ...args)
      }
      if (eventName === 'update:selected') {
        /**
         * This makes it possible to sync the table selection (the selected rows) like:
         * ```html
         * <BlitzTable :selected.sync="selected" selection="multiple" />
         * ```
         * See the [Quasar docs](https://quasar.dev/vue-components/table#Selection) for the exact details on how selection works.
         * @property {Record<string, any>[]} payload val
         */
        this.$emit('update:selected', ...args)
      }
      if (eventName === 'row-click') {
        /**
         * Emitted when user clicks/taps on a row.
         * @property {MouseEvent} event the mouse event that occured
         * @property {Record<string, any>} payload the rowData
         */
        this.$emit('row-click', ...args)
      }
      if (eventName === 'row-dblclick') {
        /**
         * Emitted when user quickly double clicks/taps on a row.
         * @property {MouseEvent} event the mouse event that occured
         * @property {Record<string, any>} payload the rowData
         */
        this.$emit('row-dblclick', ...args)
      }
      if (eventName === 'cell-click') {
        /**
         * Emitted when user clicks/taps on a cell.
         * @property {MouseEvent} event the mouse event that occured
         * @property {Record<string, any>} payload the rowData
         * @property {string} colId the column ID, this is what you have set as `id` in the schema
         */
        this.$emit('cell-click', ...args)
      }
      if (eventName === 'cell-dblclick') {
        /**
         * Emitted when user quickly double clicks/taps on a cell.
         * @property {MouseEvent} event the mouse event that occured
         * @property {Record<string, any>} payload the rowData
         * @property {string} colId the column ID, this is what you have set as `id` in the schema
         */
        this.$emit('cell-dblclick', ...args)
      }
      if (eventName === 'update-cell') {
        /**
         * Emitted when the user updates the cell, if rendered as editable by setting `mode: 'edit'` in the schema.
         * @property {{ rowId: string, colId: string, value: any, origin?: string }} payload
         */
        this.$emit('update-cell', ...args)
      }
    },
  },
}
</script>
