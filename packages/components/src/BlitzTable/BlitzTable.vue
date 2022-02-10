<script lang="ts" setup>
import { ref, computed, watchEffect, onBeforeMount } from 'vue'
import { merge } from 'merge-anything'
import { isFunction, isFullArray, isBoolean, isFullString } from 'is-what'
import { getBlitzFieldOverwrites } from '../helpersForm'
import BlitzForm from '../BlitzForm/BlitzForm.vue'
import BlitzField from '../BlitzField/BlitzField.vue'
import BlitzTh from '../BlitzTh/BlitzTh.vue'
import BlitzTableItem from '../BlitzTableItem/BlitzTableItem.vue'
import type {
  SchemaField,
  BlitzFieldProps,
  UpdateModelValueOrigin,
  BlitzColumn,
  FiltersState,
  ParseValueDic,
  SortState,
} from '@blitzar/types'
import { FormContext, ROW_SELECTION_ID, blitzTableProps } from '@blitzar/types'
import { useTableMeta } from './tableMeta'
import { propToWriteableComputed } from '../helpersVue'

function getSortableProps(col?: BlitzColumn): { sortable: boolean } | undefined {
  if (!isBoolean(col?.sortable) && isFullString(col?.id)) {
    return { sortable: true }
  }
  return undefined
}

const props = defineProps(blitzTableProps)

const emit = defineEmits<{
  (e: 'rowClick', payload: MouseEvent, rowData: Record<string, any>): void
  (e: 'rowDblclick', payload: MouseEvent, rowData: Record<string, any>): void
  (e: 'cellClick', payload: MouseEvent, rowData: Record<string, any>, colId?: string): void
  (e: 'cellDblclick', payload: MouseEvent, rowData: Record<string, any>, colId?: string): void
  (
    e: 'updateCell',
    payload: { rowId: string; colId: string; value: any; origin?: UpdateModelValueOrigin }
  ): void
  (e: 'update:isGrid', payload: boolean): void
  (e: 'update:selectedRows', payload: Record<string, any>[]): void
  (e: 'update:filtersState', payload: FiltersState): void
  (e: 'update:sortState', payload: SortState): void
  (e: 'update:rowsPerPage', payload: number): void
  (e: 'update:pageNr', payload: number): void
  (e: 'update:searchValue', payload: string): void
}>()

const hasColumns = isFullArray(props.schemaColumns)
const hasGrid = isFullArray(props.schemaGrid)

const isGridInner = ref(isBoolean(props.isGrid) ? props.isGrid : !hasColumns && hasGrid)
watchEffect(() => emit('update:isGrid', isGridInner.value))
watchEffect(() => (isGridInner.value = Boolean(props.isGrid)))

/**
 * The row indexes of all the rows currently shown in the table. Sorted, filtered, searched and all.
 */
const currentRowIndexes = ref<number[]>([])

/** SELECTION related state */
const selectedRows = propToWriteableComputed(props.selectedRows, (newVal) =>
  emit('update:selectedRows', newVal)
)
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
            selectedRows.value = currentRowIndexes.value.map((rowIndex) => props.rows[rowIndex])
            return
          }
          selectedRows.value = []
          return
        }
        if (wasSelected) {
          selectedRows.value = [...selectedRows.value, formData]
          return
        }
        selectedRows.value = selectedRows.value.filter((row) => row.id !== formData.id)
        return
      },
    },
    mode: 'edit',
    sortable: false,
    parseValue: (val: any, { formData }: FormContext) => {
      const isSelectAllHeader = formData === undefined
      return isSelectAllHeader
        ? selectedRows.value.length === props.rows.length
        : !!selectedRows.value.find((s) => s.id === formData?.id)
    },
  }
}

const schemaColumnsComputed = computed<SchemaField[] | undefined>(() => {
  if (!props.schemaColumns) return undefined

  return props.schemaColumns.map((col) => {
    // add special behaviour for selection
    const selectionProps = getSelectionProps(col)
    // add special behaviour for sorting
    const sortableProps = getSortableProps(col)
    // translate column headers
    const label = 'label' in col ? col.label : props.lang[col?.id || '']
    return { ...col, label, ...sortableProps, ...selectionProps }
  })
})

const schemaGridComputed = computed<SchemaField[] | undefined>(() => {
  if (!props.schemaGrid) return undefined

  return props.schemaGrid.map((col) => {
    // add special behaviour for selection
    const selectionProps = getSelectionProps(col)
    // add special behaviour for sorting... no?
    // translate column headers
    const label = 'label' in col ? col.label : props.lang[col?.id || '']
    return { ...col, label, ...selectionProps }
  })
})

const parseValueDic = computed<ParseValueDic>(() =>
  (schemaColumnsComputed.value || []).reduce<ParseValueDic>((dic, col) => {
    if (col.id && isFunction(col.parseValue)) {
      dic[col.id] = col.parseValue
    }
    return dic
  }, {})
)

const tableMeta = useTableMeta({
  emit,
  currentRowIndexes,
  rows: computed(() => props.rows),
  lang: computed(() => props.lang || {}),
  sortState: props.sortState,
  filtersState: props.filtersState,
  rowsPerPage: props.rowsPerPage,
  pageNr: props.pageNr,
  searchValue: props.searchValue,
  searchablePropIds: ref([]),
  parseValueDic: parseValueDic,
})
const {
  sortState,
  filtersState,
  rowsPerPage,
  pageNr,
  searchValue,
  rowCount,
  fromIndex,
  toIndex,
  pageRowIndexes,
} = tableMeta

// if there is no paginationField provided
onBeforeMount(() => {
  if (!props.paginationField) {
    // then set the amount of rows per page to the total row count:
    rowsPerPage.value = props.rows.length
    watchEffect(() => (rowsPerPage.value = props.rows.length))
  } else {
    rowsPerPage.value = props.rowsPerPage
  }
})

// // MUST USE ARROW FUNCTION for `this` access
// const evaluate = (propValue: any, rowProps: Record<string, any>): any => {
//   if (!isFunction(propValue)) return propValue || ''
//   return propValue(rowProps.row, rowProps, this as any) || ''
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
function onCellClick(e: MouseEvent, rowData: Record<string, any>, colId?: string): void {
  /**
   * Emitted when user clicks/taps on a cell.
   * @property {MouseEvent} e the mouse e that occured
   * @property {Record<string, any>} payload the rowData
   * @property {string} colId the column ID, this is what you have set as `id` in the schema
   */
  emit('cellClick', e, rowData, colId)
}
function onCellDblclick(e: MouseEvent, rowData: Record<string, any>, colId?: string): void {
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

function applyFieldDefaults(field?: BlitzFieldProps): BlitzFieldProps | undefined {
  if (!field) return undefined

  return merge(field, { tableMeta }, getBlitzFieldOverwrites(field, props.lang))
}

const fTitle = computed(() => applyFieldDefaults(props.titleField))
const fSearch = computed(() => applyFieldDefaults(props.searchField))
const fFilters = computed(() => applyFieldDefaults(props.filtersField))
const fGridToggle = computed(() => applyFieldDefaults(props.gridToggleField))
const fPagination = computed(() => applyFieldDefaults(props.paginationField))
const fShownRowsInfo = computed(() => {
  const fromNr = rowCount.value !== 0 ? fromIndex.value + 1 : 0
  const shownRowsInfoText = `${fromNr} - ${toIndex.value} / ${rowCount.value}`

  return applyFieldDefaults({
    ...props.shownRowsInfoField,
    slots: { default: shownRowsInfoText },
  })
})
const fRowsPerPage = applyFieldDefaults(props.rowsPerPageField)
</script>

<template>
  <div class="blitz-table" v-bind="$attrs">
    <BlitzField class="blitz-table--title" v-bind="fTitle" />

    <BlitzField
      v-if="fFilters"
      v-model="filtersState"
      v-bind="fFilters"
      class="blitz-table--filters"
    />

    <BlitzField v-if="fSearch" v-model="searchValue" v-bind="fSearch" class="blitz-table--search" />

    <BlitzField
      v-if="fGridToggle"
      v-model="isGridInner"
      v-bind="fGridToggle"
      class="blitz-table--grid-toggle"
    />

    <table class="blitz-table--table blitz-table--content">
      <thead>
        <tr>
          <BlitzTh
            v-for="(col, i) in schemaColumnsComputed"
            :key="i"
            v-model:sortState="sortState"
            :column="col"
            :lang="lang"
          />
        </tr>
      </thead>
      <tbody v-if="!isGridInner && schemaColumnsComputed">
        <BlitzTableItem
          :fromIndex="fromIndex"
          :toIndex="toIndex"
          :rows="rows"
          :pageRowIndexes="pageRowIndexes"
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
                ({ id: colId, value, origin }) =>
                  onUpdateCell({ rowId: row.id, colId, value, origin })
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
                      modelValue: blitzFormCtx.formDataFlat[`${field.id}`],
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
      <div v-if="isGridInner && schemaGridComputed" class="blitz-table--grid">
        <BlitzTableItem
          :fromIndex="fromIndex"
          :toIndex="toIndex"
          :rows="rows"
          :pageRowIndexes="pageRowIndexes"
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
                ({ id: colId, value, origin }) =>
                  onUpdateCell({ rowId: row.id, colId, value, origin })
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
      v-if="fPagination"
      v-model="pageNr"
      labelPosition="left"
      class="blitz-table--pagination"
      v-bind="fPagination"
    />

    <BlitzField
      v-if="fRowsPerPage"
      v-model="rowsPerPage"
      labelPosition="left"
      class="blitz-table--rows-per-page"
      v-bind="fRowsPerPage"
    />

    <BlitzField
      v-if="fShownRowsInfo"
      v-bind="fShownRowsInfo"
      class="blitz-table--shown-rows-info"
    />
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

/* GRID */
.blitz-table {
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  grid-template-areas:
    'title title'
    'filters filters'
    'search grid-toggle'
    'content content'
    'pagination pagination'
    'rows-per-page shown-rows-info';
}
.blitz-table--title {
  grid-area: title;
}
.blitz-table--filters {
  grid-area: filters;
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
