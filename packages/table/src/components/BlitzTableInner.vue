<template>
  <BlitzField class="blitz-table--title" v-bind="titleField" />

  <BlitzField
    v-if="searchField"
    class="blitz-table--search"
    v-bind="searchField"
    v-model="searchText"
  />

  <BlitzField
    v-if="gridToggleField"
    v-bind="gridToggleField"
    class="blitz-table--grid-toggle"
    v-model="isGridMode"
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
    <tbody v-if="!isGridMode">
      <DatasetItem>
        <template #default="{ row, rowIndex }">
          <BlitzForm
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
            :id="row.id"
            @update-field="
              ({ id: colId, value, origin }) => onUpdateCell(row.id, colId, value, origin)
            "
            @click="(e) => onRowClick(e, row)"
            @dblclick="(e) => onRowDblclick(e, row)"
          >
            <!-- :style="evaluate(rowStyle, rowProps)" -->
            <template v-slot="blitzFormCtx">
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
      </DatasetItem>
    </tbody>
    <div v-if="isGridMode" class="blitz-table--grid">
      <DatasetItem>
        <template #default="{ row, rowIndex }">
          <BlitzForm
            class="blitz-table--grid-card"
            :key="rowIndex + JSON.stringify(row)"
            :formComponent="'div'"
            :class="[
              // rowProps.row.id ? `blitz-row__${rowProps.row.id}` : '',
              // evaluate(rowClasses, rowProps),
            ]"
            :mode="mode"
            v-bind="gridBlitzFormOptions"
            :modelValue="row"
            :schema="schemaGridComputed"
            :id="row.id"
            @update-field="
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
      </DatasetItem>
    </div>
  </table>

  <BlitzField
    v-if="paginationField"
    labelPosition="left"
    class="blitz-table--pagination"
    v-bind="{ ...paginationField, ...paginationFieldProps }"
    v-model="currentPage"
  />

  <BlitzField
    v-if="rowsPerPageField"
    labelPosition="left"
    class="blitz-table--rows-per-page"
    v-bind="rowsPerPageField"
    v-model="rowsPerPageInner"
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

<script>
import { computed, ref, defineComponent, watchEffect, PropType } from 'vue'
import { isFunction } from 'is-what'
import { BlitzForm, BlitzField } from '@blitzar/form'
import { RowSelectionId } from '@blitzar/utils'
import { DatasetItem } from '@blitzar/components'
import BlitzTh from './BlitzTh.vue'

/*
 * dsPages — The array used to create pagination links
 * @type {Array}
 */
/*
 * dsResultsNumber — The number of rows currently displaying
 * @type {Number}
 */
/*
 * dsPagecount — The number of pagination pages
 * @type {Number}
 */
/*
 * dsFrom — The item "from" of paginated items currently displaying
 * @type {Number}
 */
/*
 * dsTo — The item "to" of paginated items currently displaying
 * @type {Number}
 */
/*
 * dsPage — The number of the current page in pagination
 * @type {Number}
 */
/*
 * dsData — The data object that contains all the data.
 * @type {Array of Objects}
 */
/*
 * datasetI18n — An object containing translation strings
 * @type {Object}
 */

/**
 * @typedef DsScope
 * @type {{
 *   dsData: { [id in string]: any }[];
 *   dsRows: ;
 *   dsPages: Array;
 *   dsResultsNumber: number;
 *   dsPagecount: number;
 *   dsShowEntries: number;
 *   dsFrom: number;
 *   dsTo: number;
 *   dsPage: number;
 *   datasetI18n: Object;
 *   search: (val: string) => void;
 *   showEntries: (val: number) => Promise<void>;
 *   setActive: (val: number) => void;
 * }}
 * @see https://next--vue-dataset-demo.netlify.app/components/#props
 */

export default defineComponent({
  name: 'BlitzTableInner',
  inheritAttrs: false,
  components: {
    BlitzForm,
    BlitzField,
    BlitzTh,
    DatasetItem,
  },
  props: {
    ds: {
      /** @type {PropType<DsScope>} */
      type: Object,
      required: true,
    },
    schemaColumns: { type: Array, default: undefined },
    schemaGrid: { type: [Array, Object], default: undefined },
    rows: { type: Array, required: true },
    isGrid: { type: Boolean, required: true },
    gridBlitzFormOptions: { type: Object, default: () => ({}) },
    selectedRows: { type: Array, default: () => [] },
    sortState: { type: Object, required: true },
    mode: { type: String, required: true },
    rowsPerPage: { type: Number, default: 10 },
    titleField: { type: Object },
    searchField: { type: Object },
    gridToggleField: { type: Object },
    paginationField: { type: Object },
    rowsPerPageField: { type: Object },
    shownRowsInfoField: { type: Object },
  },
  emits: [
    'update:isGrid',
    'update:selectedRows',
    'update:sortState',
    'row-click',
    'row-dblclick',
    'cell-click',
    'cell-dblclick',
    'update-cell',
  ],
  setup(props, { emit }) {
    /** SELECTION COLUMN RELATED */
    /**
     * creates the required column schema props for selection
     */
    function getSelectionProps(col = {}) {
      if (col.id !== RowSelectionId) return
      return {
        // in the BlitzTableInner we will add logic for actual selection
        events: {
          ...col.events,
          ['update:modelValue']: (wasSelected, { formData }) => {
            const isSelectAllHeader = formData === undefined
            if (isSelectAllHeader) {
              if (wasSelected) {
                emit(
                  'update:selectedRows',
                  props.ds.dsIndexes.map((rowIndex) => props.ds.dsData[rowIndex])
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
        parseValue: (val, { formData }) => {
          const isSelectAllHeader = formData === undefined
          return isSelectAllHeader
            ? props.selectedRows.length === props.rows.length
            : !!props.selectedRows.find((s) => s.id === formData?.id)
        },
      }
    }

    // add special behaviour for Selection
    const schemaColumnsComputed = computed(() => {
      if (!props.schemaColumns) return props.schemaColumns

      return props.schemaColumns.map((col) => {
        const selectionProps = getSelectionProps(col)
        return { ...col, ...selectionProps }
      })
    })
    // add special behaviour for Selection
    const schemaGridComputed = computed(() => {
      if (!props.schemaGrid) return props.schemaGrid

      return props.schemaGrid.map((col) => {
        const selectionProps = getSelectionProps(col)
        return { ...col, ...selectionProps }
      })
    })

    /** SEARCH FIELD */
    const searchTextInner = ref('')
    let searchTimeout = null
    const searchText = computed({
      get() {
        return searchTextInner.value
      },
      set(val) {
        searchTextInner.value = val
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => props.ds.search(val), 100)
      },
    })

    /** IS GRID */
    const isGridMode = computed({
      get() {
        return props.isGrid
      },
      set(val) {
        emit('update:isGrid', val)
      },
    })

    /** PAGINATION */
    const currentPage = computed({
      get() {
        return props.ds.dsPage
      },
      set(val) {
        props.ds.setActive(Number(val))
      },
    })
    const paginationFieldProps = computed(() => ({
      pageCount: props.ds.dsPagecount,
      pagesShown: props.ds.dsPages,
    }))

    /** ROWS PER PAGE FIELD */
    const rowsPerPageInner = computed({
      get() {
        return props.ds.dsShowEntries
      },
      set(val) {
        props.ds.showEntries(Number(val))
      },
    })
    // if there is no paginationField provided
    if (!props.paginationField) {
      // then set the amount of rows per page to the total row count:
      rowsPerPageInner.value = props.ds.dsData.length
      watchEffect(() => (rowsPerPageInner.value = props.ds.dsData.length))
    } else {
      rowsPerPageInner.value = props.rowsPerPage
    }

    /** SHOWN ROWS INFO FIELD */
    const showingFrom = computed(() => (props.ds.dsResultsNumber !== 0 ? props.ds.dsFrom + 1 : 0))
    const showingTo = computed(() =>
      props.ds.dsTo >= props.ds.dsResultsNumber ? props.ds.dsResultsNumber : props.ds.dsTo
    )
    const rowCountFiltered = computed(() => props.ds.dsResultsNumber)
    const shownRowsInfoText = computed(
      () => `${showingFrom.value} - ${showingTo.value} / ${rowCountFiltered.value}`
    )
    const shownRowsInfoFieldProps = computed(() => ({
      showingFrom: showingFrom.value,
      showingTo: showingTo.value,
      rowCountFiltered: rowCountFiltered.value,
      rowCountTotal: props.ds.dsData.length,
      slots: { default: shownRowsInfoText.value },
    }))

    function evaluate(propValue, rowProps) {
      if (!isFunction(propValue)) return propValue || ''
      return propValue(rowProps.row, rowProps, this) || ''
    }

    function onRowClick(e, rowData) {
      // const { selectionMode } = this
      // if (origin === 'grid' && selectionMode) {
      //   gridItemProps.selected = !gridItemProps.selected
      // }
      emit('row-click', e, rowData)
    }
    function onRowDblclick(e, rowData) {
      emit('row-dblclick', e, rowData)
    }
    function onCellClick(e, rowData, colId) {
      emit('cell-click', e, rowData, colId)
    }
    function onCellDblclick(e, rowData, colId) {
      emit('cell-dblclick', e, rowData, colId)
    }

    function onUpdateCell(rowId, colId, value, origin) {
      emit('update-cell', { rowId, colId, value, origin })
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
      RowSelectionId,
      onRowClick,
      onRowDblclick,
      onCellClick,
      onCellDblclick,
      onUpdateCell,
    }
  },
})
</script>
