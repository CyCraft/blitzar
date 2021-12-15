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
          v-for="(column, i) in schemaColumns"
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
            :key="rowIndex"
            :formComponent="'tr'"
            :class="[
              'blitz-table__row',
              'blitz-row',
              // rowProps.row.id ? `blitz-row__${rowProps.row.id}` : '',
              // evaluate(rowClasses, rowProps),
            ]"
            :schema="schemaColumns"
            :modelValue="row"
            :mode="mode"
            :id="row.id"
            @update-field="
              ({ id: colId, value, origin }) => onUpdateCell(row.id, colId, value, origin)
            "
          >
            <!-- :style="evaluate(rowStyle, rowProps)" -->
            <template v-slot="blitzFormCtx">
              <!-- :class="['blitz-cell', evaluate(field.cellClasses, rowProps)]" -->
              <!-- :style="evaluate(field.cellStyle, rowProps)" -->
              <!-- @click="(e) => onCellClick(e, rowProps.row, field.id)" -->
              <!-- @dblclick="(e) => onCellDblclick(e, rowProps.row, field.id)" -->
              <td v-for="field in blitzFormCtx.schema" :key="field.id">
                <BlitzField
                  v-bind="{
                    ...field,
                    span: undefined,
                    label: undefined,
                    subLabel: undefined,
                    component: field.component || 'div',
                  }"
                  :modelValue="blitzFormCtx.formDataFlat[field.id]"
                  @update:modelValue="
                    (value, origin) => blitzFormCtx.updateField({ id: field.id, value, origin })
                  "
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
            :key="rowIndex"
            :formComponent="'div'"
            :class="[
              // rowProps.row.id ? `blitz-row__${rowProps.row.id}` : '',
              // evaluate(rowClasses, rowProps),
            ]"
            :mode="mode"
            v-bind="gridBlitzFormOptions"
            :modelValue="row"
            :schema="schemaGrid"
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

<style lang="sass">
/* GRID */
.blitz-table
  display: grid
  align-items: center
  grid-gap: 1rem
  grid-template-areas: 'title title' 'search grid-toggle' 'content content' 'pagination pagination' 'rows-per-page shown-rows-info'
  .blitz-table--title
    grid-area: title
  .blitz-table--search
    grid-area: search
  .blitz-table--grid-toggle
    grid-area: grid-toggle
  .blitz-table--content
    grid-area: content
  .blitz-table--pagination
    grid-area: pagination
  .blitz-table--rows-per-page
    grid-area: rows-per-page
  .blitz-table--shown-rows-info
    grid-area: shown-rows-info

  .blitz-table--grid
    margin-top: 1rem
    display: grid
    grid-gap: 1rem
    justify-items: center
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))
    > *
      width: 100%
      max-width: 207px
      padding: 0.5rem
</style>

<script>
import { computed, ref, defineComponent } from 'vue'
import { DatasetItem } from 'vue-dataset'
import { BlitzForm, BlitzField } from '@blitzar/form'
import { isFunction } from 'is-what'
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
    /** @type {DsScope} */
    ds: { type: Object, required: true },
    schemaColumns: { type: Array, default: undefined },
    schemaGrid: { type: [Array, Object], default: undefined },
    rows: { type: Array, required: true },
    isGrid: { type: Boolean, required: true },
    gridBlitzFormOptions: { type: Object, default: () => ({}) },
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
    'update:sortState',
    'row-click',
    'row-dblclick',
    'cell-click',
    'cell-dblclick',
    'update-cell',
  ],
  setup(props, { emit }) {
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
    function onCellDblclick(event, rowData, colId) {
      emit('row-dblclick', event, rowData)
      emit('cell-dblclick', event, rowData, colId)
    }
    function onCellClick(event, rowData, colId) {
      this.onRowClick(event, rowData)
      emit('cell-click', event, rowData, colId)
    }
    function onRowClick(event, rowData, origin, gridItemProps) {
      const { selectionMode } = this
      if (origin === 'grid' && selectionMode) {
        gridItemProps.selected = !gridItemProps.selected
      }
      emit('row-click', event, rowData)
    }
    function onUpdateCell(rowId, colId, value, origin) {
      emit('update-cell', { rowId, colId, value, origin })
    }

    return {
      emit,
      searchText,
      isGridMode,
      currentPage,
      paginationFieldProps,
      rowsPerPageInner,
      shownRowsInfoFieldProps,
      onUpdateCell,
    }
  },
})
</script>
