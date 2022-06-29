<script lang="ts" setup>
import { ref, computed, watchEffect, onBeforeMount, useSlots, defineComponent } from 'vue'
import { merge } from 'merge-anything'
import { isFunction, isFullArray, isBoolean, isFullString } from 'is-what'
import { getBlitzFieldOverwrites } from '../helpersForm'
import BlitzForm from '../BlitzForm/BlitzForm.vue'
import BlitzField from '../BlitzField/BlitzField.vue'
import BlitzTh from '../BlitzTh/BlitzTh.vue'
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

defineComponent({ name: 'BlitzTable' })

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
  /**
   * This is triggered when a row is internally deleted. You MUST do either of the following to handle row deletion.
   * - pass rows like `v-model:rows="rows"`
   * - listen to the `rowDeleted` event and handle the row deletion in the parent yourself
   */
  (e: 'rowDeleted', rowIndex: number): void
  /**
   * This is triggered when a row is internally deleted. You MUST do either of the following to handle row deletion.
   * - pass rows like `v-model:rows="rows"`
   * - listen to the `rowDeleted` event and handle the row deletion in the parent yourself
   */
  (e: 'update:rows', payload: Record<string, any>[]): void
  (e: 'update:isGrid', payload: boolean): void
  (e: 'update:selectedRows', payload: Record<string, any>[]): void
  (e: 'update:filtersState', payload: FiltersState): void
  (e: 'update:sortState', payload: SortState): void
  (e: 'update:rowsPerPage', payload: number): void
  (e: 'update:pageNr', payload: number): void
  (e: 'update:searchValue', payload: string): void
}>()

function getSortableProps(col?: BlitzColumn): { sortable: boolean } | undefined {
  if (!isBoolean(col?.sortable) && isFullString(col?.id)) {
    return { sortable: true }
  }
  return undefined
}

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

function deleteRow(rowIndex: number): void {
  emit('rowDeleted', rowIndex)
  const newRows = [...props.rows]
  newRows.splice(rowIndex, 1)
  emit('update:rows', newRows)
}

function applyFieldDefaults(field?: BlitzFieldProps): BlitzFieldProps | undefined {
  if (!field) return undefined

  return merge(field, { tableMeta }, getBlitzFieldOverwrites(field, props.lang))
}

const fTitle = computed(() => applyFieldDefaults(props.titleField))
const fSearch = computed(() => applyFieldDefaults(props.searchField))
const fFilters = computed(() => applyFieldDefaults(props.filtersField))
const fGridToggle = computed(() => applyFieldDefaults(props.gridToggleField))
const fPagination = computed(() => ({
  ...applyFieldDefaults(props.paginationField),
  pageCount: tableMeta.pageCount.value,
}))
const fShownRowsInfo = computed(() => {
  if (!props.shownRowsInfoField) return

  const fromNr = rowCount.value !== 0 ? fromIndex.value + 1 : 0
  const shownRowsInfoText = `${fromNr} - ${toIndex.value} / ${rowCount.value}`

  return applyFieldDefaults({
    ...props.shownRowsInfoField,
    slots: { default: shownRowsInfoText },
  })
})
const fRowsPerPage = computed(() => applyFieldDefaults(props.rowsPerPageField))
const fTh = computed(() => applyFieldDefaults(props.thField))

const slots = useSlots()

const gridTemplateAreas = computed(
  () => `${fTitle.value ? `'title title'` : ''}
  ${fFilters.value ? `'filters filters'` : ''}
  ${fSearch.value && fGridToggle.value ? `'search grid-toggle'` : ''}
  ${fSearch.value && !fGridToggle.value ? `'search search'` : ''}
  ${!fSearch.value && fGridToggle.value ? `'grid-toggle grid-toggle'` : ''}
  ${slots.default ? `'slot slot'` : ''}
  'content content'
  ${fPagination.value ? `'pagination pagination'` : ''}
  ${fRowsPerPage.value && fShownRowsInfo.value ? `'rows-per-page shown-rows-info'` : ''}
  ${fRowsPerPage.value && !fShownRowsInfo.value ? `'rows-per-page rows-per-page'` : ''}
  ${!fRowsPerPage.value && fShownRowsInfo.value ? `'shown-rows-info shown-rows-info'` : ''}`
)
</script>

<template>
  <div :class="`blitz-table ${!pageRowIndexes.length ? '_no-data-found' : ''}`" v-bind="$attrs">
    <BlitzField v-if="fTitle" class="blitz-table--title" v-bind="fTitle" />

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

    <div v-if="slots.default" class="blitz-table--slot">
      <slot />
    </div>

    <table class="blitz-table--table blitz-table--content">
      <thead>
        <tr>
          <template v-if="fTh">
            <component
              :is="fTh.component"
              v-for="(col, i) in schemaColumnsComputed"
              :key="i"
              v-model:sortState="sortState"
              :class="fTh.componentClasses"
              :style="fTh.componentStyle"
              :column="col"
              :lang="lang"
            />
          </template>
          <template v-if="!fTh">
            <BlitzTh
              v-for="(col, i) in schemaColumnsComputed"
              :key="i"
              v-model:sortState="sortState"
              :column="col"
              :lang="lang"
            />
          </template>
        </tr>
      </thead>
      <component
        :is="isGridInner ? 'div' : 'tbody'"
        v-if="(isGridInner && schemaGridComputed) || (!isGridInner && schemaColumnsComputed)"
        :class="isGridInner ? 'blitz-table--grid' : ''"
      >
        <slot v-if="!pageRowIndexes.length" name="noDataFound">
          <div>
            <p class="text-center">No results found</p>
          </div>
        </slot>

        <template
          v-for="rowIndex in pageRowIndexes"
          :key="rowIndex + JSON.stringify(rows[rowIndex])"
        >
          <BlitzForm
            v-bind="isGridInner ? gridBlitzFormOptions : {}"
            :id="rows[rowIndex].id"
            :formComponent="isGridInner ? 'div' : 'tr'"
            :class="[
              isGridInner ? 'blitz-table--grid-card' : 'blitz-table__row blitz-row',
              // rowProps.row.id ? `blitz-row__${rowProps.rows[rowIndex].id}` : '',
              // evaluate(rowClasses, rowProps),
            ]"
            :schema="isGridInner ? schemaGridComputed || [] : schemaColumnsComputed || []"
            :modelValue="rows[rowIndex]"
            :mode="mode"
            @updateField="
              ({ id: colId, value, origin }) =>
                onUpdateCell({ rowId: rows[rowIndex].id, colId, value, origin })
            "
            @click="(e) => onRowClick(e, rows[rowIndex])"
            @dblclick="(e) => onRowDblclick(e, rows[rowIndex])"
          >
            <!-- :style="evaluate(rowStyle, rowProps)" -->
            <template v-if="!isGridInner" #default="blitzFormCtx">
              <!-- :class="['blitz-cell', evaluate(field.cellClasses, rowProps)]" -->
              <!-- :style="evaluate(field.cellStyle, rowProps)" -->
              <!-- @click="(e) => onCellClick(e, rowProps.rows[rowIndex], field.id)" -->
              <td v-for="field in blitzFormCtx.schema" :key="field.id">
                <!-- :key="JSON.stringify(rows[rowIndex])" -->
                <BlitzField
                  v-bind="{
                    ...field,
                    span: undefined,
                    label: undefined,
                    subLabel: undefined,
                    component: field.component || 'div',
                    modelValue: blitzFormCtx.formDataFlat[`${field.id}`],
                    rowIndex,
                    rowData: rows[rowIndex],
                    deleteRow: () => deleteRow(rowIndex),
                  }"
                  @update:modelValue="
                    (value, origin) => blitzFormCtx.updateField({ id: field.id, value, origin })
                  "
                  @click="(e) => onCellClick(e, rows[rowIndex], field.id)"
                  @dblclick="(e) => onCellDblclick(e, rows[rowIndex], field.id)"
                />
              </td>
            </template>
          </BlitzForm>
        </template>
      </component>
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
  grid-template-areas: v-bind('gridTemplateAreas');
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
.blitz-table--slot {
  grid-area: slot;
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
