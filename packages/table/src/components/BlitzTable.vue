<template>
  <div class="blitz-table" v-bind="$attrs">
    <Dataset
      :dsData="rows"
      :dsSortby="dsSortbyComputed"
      :dsFilterFields="{}"
      :dsSearchIn="[]"
      :dsSearchAs="dsSearchAsComputed"
      :dsSortAs="dsSortAsComputed"
      v-slot="{ ds }"
    >
      <BlitzTableInner
        :ds="ds"
        :schemaColumns="schemaColumnsComputed"
        :schemaGrid="schemaGrid"
        :gridBlitzFormOptions="gridBlitzFormOptions"
        :rows="rows"
        v-model:isGrid="isGridInner"
        v-model:selectedRows="selectedRowsComputed"
        v-model:sortState="sortState"
        :mode="mode"
        :rowsPerPage="rowsPerPage"
        :titleField="applyBlitzFieldOverwrites(titleField)"
        :searchField="applyBlitzFieldOverwrites(searchField)"
        :gridToggleField="applyBlitzFieldOverwrites(gridToggleField)"
        :paginationField="applyBlitzFieldOverwrites(paginationField)"
        :rowsPerPageField="applyBlitzFieldOverwrites(rowsPerPageField)"
        :shownRowsInfoField="applyBlitzFieldOverwrites(shownRowsInfoField)"
        @row-click="(e, rowData) => onRowClick(e, rowData)"
        @row-dblclick="(e, rowData) => onRowDblclick(e, rowData)"
        @cell-click="(e, rowData, colId) => onCellClick(e, rowData, colId)"
        @cell-dblclick="(e, rowData, colId) => onCellDblclick(e, rowData, colId)"
        @update-cell="
          ({ rowId, colId, value, origin }) => onUpdateCell({ rowId, colId, value, origin })
        "
      />
    </Dataset>
  </div>
</template>

<style>
/* RESETS */
.blitz-table,
.blitz-table * {
  box-sizing: border-box;
}
.blitz-table table,
.blitz-table ul {
  margin: 0;
}
</style>

<script>
import { watch, ref, defineComponent, computed, PropType } from 'vue'
import { merge } from 'merge-anything'
import { isFunction, isFullArray, isBoolean, isFullString } from 'is-what'
import { getProp } from 'path-to-prop'
import { getBlitzFieldOverwrites } from '@blitzar/form'
import { RowSelectionId } from '@blitzar/utils'
import { Dataset } from '@blitzar/components'
import BlitzTableInner from './BlitzTableInner.vue'

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
 * @typedef DatasetProps
 * @type {{
 *   dsData: { [id in string]: any }[];
 *   dsFilterFields: { [colId in string]: (cellValue: any, rowData: Record<string, any>) => boolean | any };
 *   dsSortby: string[];
 *   dsSearchIn: string[];
 *   dsSearchAs: { [id in string]: (val: any) => boolean };
 *   dsSortAs: { [id in string]: (val: any) => any };
 * }}
 * @see https://next--vue-dataset-demo.netlify.app/components/#props
 */

function getSortableProps(col = {}) {
  if (!isBoolean(col.sortable) && isFullString(col.id)) {
    return { sortable: true }
  }
}

export default defineComponent({
  name: 'BlitzTable',
  components: { BlitzTableInner, Dataset },
  props: {
    /**
     * The schema for the columns you want to generate. (BlitzForm schema format)
     * @example [{ id: 'nameFirst', label: 'First Name', component: 'input' }, { id: 'nameLast', label: 'Last Name', component: 'input' }]
     * @category column
     */
    schemaColumns: {
      /** @type {PropType<Record<string, any>[]>} */
      type: Array,
      default: undefined,
    },
    /**
     * The schema for the grid cards you want to generate. (BlitzForm schema format)
     * @example [{ id: 'nameFirst', label: 'First Name', component: 'input' }, { id: 'nameLast', label: 'Last Name', component: 'input' }]
     * @category column
     */
    schemaGrid: {
      /** @type {PropType<Record<string, any>[]>} */
      type: [Array, Object],
      default: undefined,
    },
    /**
     * Rows of data to display. Use `rows` instead of the QTables `data`. Renamed for clarity.
     * @example [{ nameFirst: 'Eleanor', nameLast: 'Shellstrop' }, { nameFirst: 'Chidi', nameLast: 'Anagonye' }]
     * @category model
     */
    rows: {
      /** @type {PropType<Record<string, any>[]>} */
      type: Array,
      required: true,
    },
    /**
     * Defaults to `false` (table-view) if `schemaColumns` is provided
     * Defaults to `true` (grid-view) if `schemaGrid` is provided (and no `schemaColumns`)
     */
    isGrid: { type: Boolean, default: undefined },
    /**
     * The BlitzForm options you want to use for the grid cards. Eg. You can pass `{ actionButtons: [] }` here to include some action buttons on each grid card.
     *
     * Please note:
     * - The `schema` for the grid cards should be set via the `schemaGrid` prop instead of passing it here as `schema`.
     * - The BlitzForm used for each grid card will automatically get the row data.
     * - See the documentation of BlitzForm for more information on the props you can set.
     * @category column
     */
    gridBlitzFormOptions: {
      /** @type {PropType<Record<string, any>>} */
      type: Object,
      default: () => ({}),
    },
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
    /**
     * MUST be used with `v-model:selectedRows="mySelection"`
     */
    selectedRows: {
      /** @type {PropType<Record<string, any>[] >} */
      type: Array,
      default: () => [],
    },
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
    /**
     * By default the rows show just the raw data without showing field components. If you set `mode: 'edit'` your entire table will show the actual (editable) component as per your schema.
     */
    mode: { type: String, default: 'raw' },
    rowsPerPage: { type: Number, default: 10 },
    /**
     * A field as per BlitzField syntax.
     *
     * Anything you pass here will just be added as title element and receive `.blitz-table--title` as class.
     *
     * TODO: add @example
     */
    titleField: { type: Object },
    /**
     * An input field as per BlitzField syntax.
     *
     * It must be compatible with `v-model` and accept a String as `modelValue`.
     *
     * Will receive `.blitz-table--search` as class.
     *
     * TODO: add @example
     */
    searchField: { type: Object },
    /**
     * A toggle field as per BlitzField syntax.
     *
     * It must be compatible with `v-model` and accept a Boolean as `modelValue`:
     * - `false` will be interpreted as the table view `isGrid: false` (the default)
     * - `true` will be interpreted as the grid view `isGrid: true`
     *
     * Will receive `.blitz-table--grid-toggle` as class.
     *
     * TODO: add @example
     */
    gridToggleField: { type: Object },
    /**
     * A select or input field as per BlitzField syntax.
     *
     * It must be compatible with `v-model` and accept a Number as `modelValue`.
     *
     * Other props it receives and can be used are:
     *
     * - `showingFrom: Number` — eg. `1` when showing from row 1 to 5
     * - `showingTo: Number` — eg. `5` when showing from row 1 to 5
     * - `rowCount: Number` — eg. `100` when there are 100 rows visible, this can differ from the total row count because the rows might be searched/filtered
     *
     * Will receive `.blitz-table--rows-per-page` as class.
     *
     * TODO: add @example
     */
    rowsPerPageField: { type: Object },
    shownRowsInfoField: { type: Object },
    paginationField: { type: Object },
  },
  setup(props, { emit }) {
    const hasColumns = isFullArray(props.schemaColumns)
    const hasGrid = isFullArray(props.schemaGrid)

    const isGridInner = ref(isBoolean(props.isGrid) ? props.isGrid : !hasColumns && hasGrid)
    watch(
      () => isGridInner,
      (newVal, oldVal) => (newVal !== oldVal ? emit('update:isGrid', val) : null)
    )
    watch(
      () => props.isGrid,
      (newVal, oldVal) => (newVal !== oldVal ? (isGridInner.value = newVal) : null)
    )

    function applyBlitzFieldOverwrites(field) {
      if (!field) return undefined
      return merge(field, getBlitzFieldOverwrites(field))
    }

    /** SELECTION related state */
    const selectedRowsComputed = computed({
      get() {
        return props.selectedRows
      },
      set(newSelectedRows) {
        /**
         * This makes it possible to sync the table's selected rows like:
         * ```html
         * <BlitzTable v-model:selectedRows="mySelectedRows" />
         * ```
         * @property {Record<string, any>[]} newSelectedRows val
         */
        emit('update:selectedRows', newSelectedRows)
      },
    })

    /** SORT related state */
    /**
     * @type {{ id: null | string, direction: 'asc' | 'desc' | 'none' }}
     */
    const sortState = ref({
      id: null,
      direction: 'none',
    })

    // apply default `sortable` to columns && add special behaviour for Selection
    const schemaColumnsComputed = computed(() => {
      if (!props.schemaColumns) return props.schemaColumns

      return props.schemaColumns.map((col) => {
        const sortableProps = getSortableProps(col)
        return { ...col, ...sortableProps }
      })
    })
    // add special behaviour for Selection
    // const schemaGridComputed = computed(() => {
    //   if (!props.schemaGrid) return props.schemaGrid

    //   return props.schemaGrid
    // })

    /**
     * Provides Dataset's `dsSearchAs` prop with a special functions for columns with `parseValue`
     */
    const dsSearchAsComputed = schemaColumnsComputed.value.reduce((searchAsDic, column) => {
      if (!column.id) return searchAsDic
      if (!isFunction(column.parseValue)) return searchAsDic

      const searchFn = (cellValue, searchString, rowData) => {
        const actualCellValue = getProp(rowData, column.id)
        const searchStr = String(searchString).toLowerCase()

        try {
          const parsedValue = column.parseValue(cellValue, { formData: rowData })
          const checkParsed = String(parsedValue).toLowerCase().indexOf(searchStr) >= 0
          if (checkParsed === true) {
            return true
          }
        } catch (error) {}
        // as fallback also check the non-parsed value
        return String(actualCellValue).toLowerCase().indexOf(searchStr) >= 0
      }

      searchAsDic[column.id] = searchFn

      return searchAsDic
    }, {})

    /**
     * Provides Dataset's `dsSortAs` prop with a special functions for columns with `parseValue`
     */
    const dsSortAsComputed = schemaColumnsComputed.value.reduce((sortAsDic, column) => {
      if (!column.id) return sortAsDic
      if (!column.sortable) return sortAsDic
      if (!isFunction(column.parseValue)) return sortAsDic

      const sortAsFn = (cellValue, rowData) => {
        const parsedValue = column.parseValue(cellValue, { formData: rowData })
        return parsedValue
      }

      sortAsDic[column.id] = sortAsFn
      return sortAsDic
    }, {})

    const dsSortbyComputed = computed(() => {
      if (!sortState.value.id) return []
      if (sortState.value.direction === 'desc') return [`-${sortState.value.id}`]
      return [sortState.value.id]
    })

    // function evaluate(propValue, rowProps) {
    //   if (!isFunction(propValue)) return propValue || ''
    //   return propValue(rowProps.row, rowProps, this) || ''
    // }

    function onRowClick(e, rowData) {
      // const { selectionMode } = this
      // if (origin === 'grid' && selectionMode) {
      //   gridItemProps.selected = !gridItemProps.selected
      // }
      /**
       * Emitted when user clicks/taps on a row.
       * @property {MouseEvent} e the mouse e that occured
       * @property {Record<string, any>} payload the rowData
       */
      emit('row-click', e, rowData)
    }
    function onRowDblclick(e, rowData) {
      /**
       * Emitted when user quickly double clicks/taps on a row.
       * @property {MouseEvent} e the mouse e that occured
       * @property {Record<string, any>} payload the rowData
       */
      emit('row-dblclick', e, rowData)
    }
    function onCellClick(e, rowData, colId) {
      /**
       * Emitted when user clicks/taps on a cell.
       * @property {MouseEvent} e the mouse e that occured
       * @property {Record<string, any>} payload the rowData
       * @property {string} colId the column ID, this is what you have set as `id` in the schema
       */
      emit('cell-click', e, rowData, colId)
    }
    function onCellDblclick(e, rowData, colId) {
      /**
       * Emitted when user quickly double clicks/taps on a cell.
       * @property {MouseEvent} e the mouse e that occured
       * @property {Record<string, any>} payload the rowData
       * @property {string} colId the column ID, this is what you have set as `id` in the schema
       */
      emit('cell-dblclick', e, rowData, colId)
    }
    function onUpdateCell({ rowId, colId, value, origin }) {
      if (colId === RowSelectionId) return

      /**
       * Emitted when the user updates the cell, if rendered as editable by setting `mode: 'edit'` in the schema.
       * @property {{ rowId: string, colId: string, value: any, origin?: string }} payload
       */
      emit('update-cell', { rowId, colId, value, origin })
    }

    return {
      dsSearchAsComputed,
      dsSortAsComputed,
      selectedRowsComputed,
      sortState,
      dsSortbyComputed,
      applyBlitzFieldOverwrites,
      isGridInner,
      schemaColumnsComputed,
      // schemaGridComputed,
      // evaluate,
      onRowClick,
      onRowDblclick,
      onCellClick,
      onCellDblclick,
      onUpdateCell,
    }
  },
})
</script>
