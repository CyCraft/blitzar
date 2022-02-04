<script lang="ts">
import { computed, ref, defineComponent, watchEffect, PropType, onBeforeMount } from 'vue'
import { isArray, isBoolean, isFunction, isPlainObject } from 'is-what'
import BlitzForm from '../BlitzForm/BlitzForm.vue'
import BlitzField from '../BlitzField/BlitzField.vue'
import type { BlitzFieldProps, FormContext, Mode, UpdateModelValueOrigin } from '@blitzar/types'
import { ROW_SELECTION_ID } from '@blitzar/types'
import BlitzTh from '../BlitzTh/BlitzTh.vue'
import BlitzTableItem from '../BlitzTableItem/BlitzTableItem.vue'
import type { TableMeta, SortState, BlitzColumn } from '../typesTable'

/**
 * An implementation of a Datatable and Datagrid compatible with BlitzTableOuter
 */
export default defineComponent({
  name: 'BlitzTableInner',
  components: { BlitzForm, BlitzField, BlitzTh, BlitzTableItem },
  inheritAttrs: false,
  props: {
    rows: { type: Array as PropType<Record<string, any>[]>, required: true },
    tableMeta: { type: Object as PropType<TableMeta>, required: true },
    schemaColumns: { type: Array as PropType<BlitzColumn[]>, default: undefined },
    schemaGrid: { type: Array as PropType<BlitzColumn[]>, default: undefined },
    isGrid: { type: Boolean as PropType<boolean>, required: true },
    gridBlitzFormOptions: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    selectedRows: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
    sortState: { type: Object as PropType<SortState>, required: true },
    mode: { type: String as PropType<Mode>, required: true },
    rowsPerPage: { type: Number as PropType<number>, default: 10 },
    titleField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
    searchField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
    gridToggleField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
    paginationField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
    rowsPerPageField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
    shownRowsInfoField: { type: Object as PropType<BlitzFieldProps>, default: undefined },
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
    'update:sortState': (payload: SortState) => isPlainObject(payload),
  },
  setup(props, { emit }) {
    /** SELECTION COLUMN RELATED */
    /**
     * creates the required column schema props for selection
     */
    function getSelectionProps(col?: BlitzColumn): Partial<BlitzColumn> | undefined {
      if (col?.id !== ROW_SELECTION_ID) return

      return {
        // in the BlitzTableInner we will add logic for actual selection
        events: {
          ...col.events,
          ['update:modelValue']: (wasSelected: boolean, { formData }: FormContext) => {
            const isSelectAllHeader = formData === undefined
            if (isSelectAllHeader) {
              if (wasSelected) {
                emit(
                  'update:selectedRows',
                  props.tableMeta.currentIndexes.map((rowIndex) => props.rows[rowIndex])
                )
                return
              }
              emit('update:selectedRows', [])
              return
            }
            if (wasSelected) {
              emit('update:selectedRows', [...props.selectedRows, formData])
              return
            }
            emit(
              'update:selectedRows',
              props.selectedRows.filter((row) => row.id !== formData.id)
            )
            return
          },
        },
        mode: 'edit',
        sortable: false,
        parseValue: (val: any, { formData }: FormContext) => {
          const isSelectAllHeader = formData === undefined
          return isSelectAllHeader
            ? props.selectedRows.length === props.rows.length
            : !!props.selectedRows.find((s) => s.id === formData?.id)
        },
      }
    }

    // add special behaviour for Selection
    const schemaColumnsComputed = computed<undefined | BlitzColumn[]>(() => {
      if (!props.schemaColumns) return props.schemaColumns

      return props.schemaColumns.map((col) => {
        const selectionProps = getSelectionProps(col)
        return { ...col, ...selectionProps }
      })
    })
    // add special behaviour for Selection
    const schemaGridComputed = computed<undefined | BlitzColumn[]>(() => {
      if (!props.schemaGrid) return props.schemaGrid

      return props.schemaGrid.map((col) => {
        const selectionProps = getSelectionProps(col)
        return { ...col, ...selectionProps }
      })
    })

    /** SEARCH FIELD */
    const searchTextInner = ref('')
    const searchText = computed({
      get(): string {
        return searchTextInner.value
      },
      set(val: string) {
        searchTextInner.value = val
        props.tableMeta.search(val)
      },
    })

    /** IS GRID */
    const isGridMode = computed<boolean>({
      get() {
        return props.isGrid
      },
      set(val) {
        emit('update:isGrid', val)
      },
    })

    /** PAGINATION */
    const currentPage = computed<number>({
      get() {
        return props.tableMeta.currentPageNr
      },
      set(val) {
        props.tableMeta.setPageNr(Number(val))
      },
    })
    const paginationFieldProps = computed(() => ({
      pageCount: props.tableMeta.currentPageCount,
      pagesShown: props.tableMeta.shownPageIndexes,
    }))

    /** ROWS PER PAGE FIELD */
    const rowsPerPageInner = computed<number>({
      get() {
        return props.tableMeta.rowsPerPage
      },
      set(val) {
        props.tableMeta.setRowsPerPage(Number(val))
      },
    })
    // if there is no paginationField provided
    onBeforeMount(() => {
      if (!props.paginationField) {
        // then set the amount of rows per page to the total row count:
        rowsPerPageInner.value = props.rows.length
        watchEffect(() => (rowsPerPageInner.value = props.rows.length))
      } else {
        rowsPerPageInner.value = props.rowsPerPage
      }
    })

    /** SHOWN ROWS INFO FIELD */
    const showingFrom = computed<number>(() =>
      props.tableMeta.currentResultsCount !== 0 ? props.tableMeta.shownFrom + 1 : 0
    )
    const showingTo = computed<number>(() =>
      props.tableMeta.shownTo >= props.tableMeta.currentResultsCount
        ? props.tableMeta.currentResultsCount
        : props.tableMeta.shownTo
    )
    const rowCountFiltered = computed<number>(() => props.tableMeta.currentResultsCount)
    const shownRowsInfoText = computed<string>(
      () => `${showingFrom.value} - ${showingTo.value} / ${rowCountFiltered.value}`
    )
    const shownRowsInfoFieldProps = computed(() => ({
      showingFrom: showingFrom.value,
      showingTo: showingTo.value,
      rowCountFiltered: rowCountFiltered.value,
      rowCountTotal: props.rows.length,
      slots: { default: shownRowsInfoText.value },
    }))

    // MUST USE ARROW FUNCTION for `this` access
    const evaluate = (propValue: any, rowProps: Record<string, any>): any => {
      if (!isFunction(propValue)) return propValue || ''
      return propValue(rowProps.row, rowProps, this as any) || ''
    }

    function onRowClick(e: MouseEvent, rowData: Record<string, any>): void {
      // const { selectionMode } = this
      // if (origin === 'grid' && selectionMode) {
      //   gridItemProps.selected = !gridItemProps.selected
      // }
      emit('rowClick', e, rowData)
    }
    function onRowDblclick(e: MouseEvent, rowData: Record<string, any>): void {
      emit('rowDblclick', e, rowData)
    }
    function onCellClick(e: MouseEvent, rowData: Record<string, any>, colId: string): void {
      emit('cellClick', e, rowData, colId)
    }
    function onCellDblclick(e: MouseEvent, rowData: Record<string, any>, colId: string): void {
      emit('cellDblclick', e, rowData, colId)
    }

    function onUpdateCell(
      rowId: string,
      colId: string,
      value: any,
      origin?: UpdateModelValueOrigin
    ): void {
      emit('updateCell', { rowId, colId, value, origin })
    }

    return {
      schemaColumnsComputed,
      schemaGridComputed,
      emit,
      searchText,
      isGridMode,
      currentPage,
      paginationFieldProps,
      rowsPerPageInner,
      shownRowsInfoFieldProps,
      ROW_SELECTION_ID,
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
  <BlitzField class="blitz-table--title" v-bind="titleField" />

  <BlitzField
    v-if="searchField"
    v-model="searchText"
    v-bind="searchField"
    class="blitz-table--search"
  />

  <BlitzField
    v-if="gridToggleField"
    v-model="isGridMode"
    v-bind="gridToggleField"
    class="blitz-table--grid-toggle"
  />

  <table class="blitz-table--table blitz-table--content">
    <thead>
      <tr>
        <BlitzTh
          v-for="(column, i) in schemaColumnsComputed"
          :key="i"
          :column="column"
          :sortState="sortState"
          @update:sortState="(val) => emit('update:sortState', val)"
          >{{ column.label || '' }}</BlitzTh
        >
      </tr>
    </thead>
    <tbody v-if="!isGridMode && schemaColumnsComputed">
      <BlitzTableItem
        :shownFrom="tableMeta.shownFrom"
        :shownTo="tableMeta.shownTo"
        :rows="rows"
        :shownRows="tableMeta.shownRows"
      >
        <template #default="{ row, rowIndex }">
          <BlitzForm
            :id="row.id"
            :key="rowIndex + JSON.stringify(row)"
            :formComponent="'tr'"
            :class="[
              'blitz-table__row',
              'blitz-row',
              // rowProps.row.id ? `blitz-row__${rowProps.row.id}` : '',
              // evaluate(rowClasses, rowProps),
            ]"
            :schema="schemaColumnsComputed"
            :modelValue="row"
            :mode="mode"
            @updateField="
              ({ id: colId, value, origin }) => onUpdateCell(row.id, colId, value, origin)
            "
            @click="(e) => onRowClick(e, row)"
            @dblclick="(e) => onRowDblclick(e, row)"
          >
            <!-- :style="evaluate(rowStyle, rowProps)" -->
            <template #default="blitzFormCtx">
              <!-- :class="['blitz-cell', evaluate(field.cellClasses, rowProps)]" -->
              <!-- :style="evaluate(field.cellStyle, rowProps)" -->
              <!-- @click="(e) => onCellClick(e, rowProps.row, field.id)" -->
              <td v-for="field in blitzFormCtx.schema" :key="field.id">
                <!-- :key="JSON.stringify(row)" -->
                <BlitzField
                  v-bind="{
                    ...field,
                    span: undefined,
                    label: undefined,
                    subLabel: undefined,
                    component: field.component || 'div',
                    modelValue: blitzFormCtx.formDataFlat[field.id],
                  }"
                  @update:modelValue="
                    (value, origin) => blitzFormCtx.updateField({ id: field.id, value, origin })
                  "
                  @click="(e) => onCellClick(e, row, field.id)"
                  @dblclick="(e) => onCellDblclick(e, row, field.id)"
                />
              </td>
            </template>
          </BlitzForm>
        </template>
        <template #noDataFound>
          <div>
            <p class="text-center">No results found</p>
          </div>
        </template>
      </BlitzTableItem>
    </tbody>
    <div v-if="isGridMode && schemaGridComputed" class="blitz-table--grid">
      <BlitzTableItem
        :shownFrom="tableMeta.shownFrom"
        :shownTo="tableMeta.shownTo"
        :rows="rows"
        :shownRows="tableMeta.shownRows"
      >
        <template #default="{ row, rowIndex }">
          <BlitzForm
            :id="row.id"
            :key="rowIndex + JSON.stringify(row)"
            class="blitz-table--grid-card"
            :formComponent="'div'"
            :class="[
              // rowProps.row.id ? `blitz-row__${rowProps.row.id}` : '',
              // evaluate(rowClasses, rowProps),
            ]"
            :mode="mode"
            v-bind="gridBlitzFormOptions"
            :modelValue="row"
            :schema="schemaGridComputed"
            @updateField="
              ({ id: colId, value, origin }) => onUpdateCell(row.id, colId, value, origin)
            "
          />
          <!--
          :style="evaluate(rowStyle, rowProps)"
          :key="rowProps.row.id + JSON.stringify(rowProps.row)"
        -->
        </template>
        <template #noDataFound>
          <div>
            <p class="text-center">No results found</p>
          </div>
        </template>
      </BlitzTableItem>
    </div>
  </table>

  <BlitzField
    v-if="paginationField"
    v-model="currentPage"
    labelPosition="left"
    class="blitz-table--pagination"
    v-bind="{ ...paginationField, ...paginationFieldProps }"
  />

  <BlitzField
    v-if="rowsPerPageField"
    v-model="rowsPerPageInner"
    labelPosition="left"
    class="blitz-table--rows-per-page"
    v-bind="rowsPerPageField"
  />

  <BlitzField
    v-if="shownRowsInfoField"
    v-bind="{ ...shownRowsInfoFieldProps, ...shownRowsInfoField }"
    class="blitz-table--shown-rows-info"
  />
</template>

<style>
/* GRID */
.blitz-table {
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  grid-template-areas:
    'title title'
    'search grid-toggle'
    'content content'
    'pagination pagination'
    'rows-per-page shown-rows-info';
}
.blitz-table--title {
  grid-area: title;
}
.blitz-table--search {
  grid-area: search;
}
.blitz-table--grid-toggle {
  grid-area: grid-toggle;
}
.blitz-table--content {
  grid-area: content;
}
.blitz-table--pagination {
  grid-area: pagination;
}
.blitz-table--rows-per-page {
  grid-area: rows-per-page;
}
.blitz-table--shown-rows-info {
  grid-area: shown-rows-info;
}

.blitz-table--grid {
  margin-top: 1rem;
  display: grid;
  grid-gap: 1rem;
  justify-items: center;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
}
.blitz-table--grid > * {
  width: 100%;
  max-width: 207px;
  padding: 0.5rem;
}
</style>
