<script lang="ts">
import { watch, ref, defineComponent, computed, PropType, watchEffect } from 'vue'
import { merge } from 'merge-anything'
import { isFunction, isFullArray, isBoolean, isFullString, isPlainObject, isArray } from 'is-what'
import { getProp } from 'path-to-prop'
import { getBlitzFieldOverwrites } from '@blitzar/form'
import type { BlitzFieldProps, Mode, UpdateModelValueOrigin } from '@blitzar/types'
import { ROW_SELECTION_ID } from '@blitzar/types'
import type {
  BlitzColumn,
  BlitzColumnProps,
  DsSearchAs,
  DsSortAs,
  DsSortby,
  SortState,
} from './types'
import BlitzTableOuter from './BlitzTableOuter.vue'
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

function getSortableProps(col?: BlitzColumn): { sortable: boolean } | undefined {
  if (!isBoolean(col?.sortable) && isFullString(col?.id)) {
    return { sortable: true }
  }
  return undefined
}

export default defineComponent({
  name: 'BlitzTable',
  components: { BlitzTableInner, BlitzTableOuter },
  props: {
    /**
     * The schema for the columns you want to generate. (BlitzForm schema format)
     * @example [{ id: 'nameFirst', label: 'First Name', component: 'input' }, { id: 'nameLast', label: 'Last Name', component: 'input' }]
     * @category column
     */
    schemaColumns: {
      type: Array as PropType<BlitzColumn[]>,
      default: undefined,
    },
    /**
     * The schema for the grid cards you want to generate. (BlitzForm schema format)
     * @example [{ id: 'nameFirst', label: 'First Name', component: 'input' }, { id: 'nameLast', label: 'Last Name', component: 'input' }]
     * @category column
     */
    schemaGrid: {
      type: Array as PropType<BlitzColumn[]>,
      default: undefined,
    },
    /**
     * Rows of data to display. Use `rows` instead of the QTables `data`. Renamed for clarity.
     * @example [{ nameFirst: 'Eleanor', nameLast: 'Shellstrop' }, { nameFirst: 'Chidi', nameLast: 'Anagonye' }]
     * @category model
     */
    rows: {
      type: Array as PropType<Record<string, any>[]>,
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
      type: Object as PropType<Record<string, any>>,
      default: (): Record<string, any> => ({}),
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
      type: Array as PropType<Record<string, any>[]>,
      default: (): Record<string, any>[] => [],
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
    mode: { type: String as PropType<Mode>, default: 'raw' },
    rowsPerPage: { type: Number, default: 10 },
    /**
     * A field as per BlitzField syntax.
     *
     * Anything you pass here will just be added as title element and receive `.blitz-table--title` as class.
     *
     * TODO: add @example
     */
    titleField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
    /**
     * An input field as per BlitzField syntax.
     *
     * It must be compatible with `v-model` and accept a String as `modelValue`.
     *
     * Will receive `.blitz-table--search` as class.
     *
     * TODO: add @example
     */
    searchField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
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
    gridToggleField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
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
    rowsPerPageField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
    shownRowsInfoField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
    paginationField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
  },
  emits: {
    rowClick: (e: MouseEvent, rowData: Record<string, any>) => isPlainObject(rowData),
    rowDblclick: (e: MouseEvent, rowData: Record<string, any>) => isPlainObject(rowData),
    cellClick: (e: MouseEvent, rowData: Record<string, any>, colId: string) =>
      isPlainObject(rowData),
    cellDblclick: (e: MouseEvent, rowData: Record<string, any>, colId: string) =>
      isPlainObject(rowData),
    updateCell: ({
      rowId,
      colId,
      value,
      origin,
    }: {
      rowId: string
      colId: string
      value: any
      origin?: UpdateModelValueOrigin
    }) => true,
    'update:isGrid': (payload: boolean) => isBoolean(payload),
    'update:selectedRows': (payload: Record<string, any>[]) => isArray(payload),
  },
  setup(props, { emit }) {
    const hasColumns = isFullArray(props.schemaColumns)
    const hasGrid = isFullArray(props.schemaGrid)

    const isGridInner = ref(isBoolean(props.isGrid) ? props.isGrid : !hasColumns && hasGrid)
    watchEffect(() => emit('update:isGrid', isGridInner.value))
    watchEffect(() => (isGridInner.value = Boolean(props.isGrid)))

    function applyBlitzFieldOverwrites(field?: BlitzFieldProps): BlitzFieldProps | undefined {
      if (!field) return undefined

      return merge(field, getBlitzFieldOverwrites(field))
    }

    /** SELECTION related state */
    const selectedRowsComputed = computed({
      get(): Record<string, any>[] {
        return props.selectedRows
      },
      set(newSelectedRows: Record<string, any>[]) {
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
    const sortState = ref<SortState>({ id: null, direction: 'none' })

    // apply default `sortable` to columns && add special behaviour for Selection
    const schemaColumnsComputed = computed<BlitzColumn[] | undefined>(() => {
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
    const dsSearchAsComputed = (schemaColumnsComputed.value || []).reduce<DsSearchAs>(
      (searchAsDic, column) => {
        if (!column.id) return searchAsDic
        if (!isFunction(column.parseValue)) return searchAsDic

        const searchFn = (
          cellValue: any,
          searchString: string,
          rowData: Record<string, any>
        ): boolean => {
          const actualCellValue = getProp(rowData, column.id)
          const searchStr = String(searchString).toLowerCase()

          try {
            const parsedValue = column.parseValue(cellValue, { formData: rowData })
            const checkParsed = String(parsedValue).toLowerCase().indexOf(searchStr) >= 0
            if (checkParsed === true) {
              return true
            }
          } catch (error) {
            /** error */
          }
          // as fallback also check the non-parsed value
          return String(actualCellValue).toLowerCase().indexOf(searchStr) >= 0
        }

        searchAsDic[column.id] = searchFn

        return searchAsDic
      },
      {}
    )

    /**
     * Provides Dataset's `dsSortAs` prop with a special functions for columns with `parseValue`
     */
    const dsSortAsComputed = (schemaColumnsComputed.value || []).reduce<DsSortAs>(
      (sortAsDic, column) => {
        if (!column.id) return sortAsDic
        if (!column.sortable) return sortAsDic
        if (!isFunction(column.parseValue)) return sortAsDic

        const sortAsFn = (cellValue: any, rowData: Record<string, any>): any => {
          const parsedValue = column.parseValue(cellValue, { formData: rowData })
          return parsedValue
        }

        sortAsDic[column.id] = sortAsFn
        return sortAsDic
      },
      {}
    )

    const dsSortbyComputed = computed<DsSortby>(() => {
      if (!sortState.value.id) return []
      if (sortState.value.direction === 'desc') return [`-${sortState.value.id}`]
      return [sortState.value.id]
    })

    // function evaluate(propValue, rowProps) {
    //   if (!isFunction(propValue)) return propValue || ''
    //   return propValue(rowProps.row, rowProps, this) || ''
    // }

    function onRowClick(e: MouseEvent, rowData: Record<string, any>): void {
      // const { selectionMode } = this
      // if (origin === 'grid' && selectionMode) {
      //   gridItemProps.selected = !gridItemProps.selected
      // }
      /**
       * Emitted when user clicks/taps on a row.
       * @property {MouseEvent} e the mouse e that occured
       * @property {Record<string, any>} payload the rowData
       */
      emit('rowClick', e, rowData)
    }
    function onRowDblclick(e: MouseEvent, rowData: Record<string, any>): void {
      /**
       * Emitted when user quickly double clicks/taps on a row.
       * @property {MouseEvent} e the mouse e that occured
       * @property {Record<string, any>} payload the rowData
       */
      emit('rowDblclick', e, rowData)
    }
    function onCellClick(e: MouseEvent, rowData: Record<string, any>, colId: string): void {
      /**
       * Emitted when user clicks/taps on a cell.
       * @property {MouseEvent} e the mouse e that occured
       * @property {Record<string, any>} payload the rowData
       * @property {string} colId the column ID, this is what you have set as `id` in the schema
       */
      emit('cellClick', e, rowData, colId)
    }
    function onCellDblclick(e: MouseEvent, rowData: Record<string, any>, colId: string): void {
      /**
       * Emitted when user quickly double clicks/taps on a cell.
       * @property {MouseEvent} e the mouse e that occured
       * @property {Record<string, any>} payload the rowData
       * @property {string} colId the column ID, this is what you have set as `id` in the schema
       */
      emit('cellDblclick', e, rowData, colId)
    }
    function onUpdateCell({
      rowId,
      colId,
      value,
      origin,
    }: {
      rowId: string
      colId: string
      value: any
      origin?: UpdateModelValueOrigin
    }): void {
      if (colId === ROW_SELECTION_ID) return

      /**
       * Emitted when the user updates the cell, if rendered as editable by setting `mode: 'edit'` in the schema.
       * @property {{ rowId: string, colId: string, value: any, origin?: string }} payload
       */
      emit('updateCell', { rowId, colId, value, origin })
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

<template>
  <div class="blitz-table" v-bind="$attrs">
    <BlitzTableOuter
      v-slot="{ ds }"
      :dsData="rows"
      :dsSortby="dsSortbyComputed"
      :dsFilterFields="{}"
      :dsSearchIn="[]"
      :dsSearchAs="dsSearchAsComputed"
      :dsSortAs="dsSortAsComputed"
    >
      <BlitzTableInner
        v-model:isGrid="isGridInner"
        v-model:selectedRows="selectedRowsComputed"
        v-model:sortState="sortState"
        :ds="ds"
        :schemaColumns="schemaColumnsComputed"
        :schemaGrid="schemaGrid"
        :gridBlitzFormOptions="gridBlitzFormOptions"
        :rows="rows"
        :mode="mode"
        :rowsPerPage="rowsPerPage"
        :titleField="applyBlitzFieldOverwrites(titleField)"
        :searchField="applyBlitzFieldOverwrites(searchField)"
        :gridToggleField="applyBlitzFieldOverwrites(gridToggleField)"
        :paginationField="applyBlitzFieldOverwrites(paginationField)"
        :rowsPerPageField="applyBlitzFieldOverwrites(rowsPerPageField)"
        :shownRowsInfoField="applyBlitzFieldOverwrites(shownRowsInfoField)"
        @rowClick="(e, rowData) => onRowClick(e, rowData)"
        @rowDblclick="(e, rowData) => onRowDblclick(e, rowData)"
        @cellClick="(e, rowData, colId) => onCellClick(e, rowData, colId)"
        @cellDblclick="(e, rowData, colId) => onCellDblclick(e, rowData, colId)"
        @updateCell="
          ({ rowId, colId, value, origin }) => onUpdateCell({ rowId, colId, value, origin })
        "
      />
    </BlitzTableOuter>
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
