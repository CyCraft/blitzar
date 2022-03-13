import { ref, computed, watch, Ref } from 'vue'
import { flattenObject } from 'flatten-anything'
import { isMap, isSet } from 'is-what'
import type {
  SearchablePropIds,
  ParseValueDic,
  SortState,
  BlitzTableProps,
  TableMeta,
  FiltersState,
  AnyRef,
} from '@blitzar/types'
import { sortFactory, isRowFilterHit, isRowSearchHit, shouldFilterRows } from './tableMetaHelpers'
import { propToWriteableComputed } from '../helpersVue'

type UseTableMetaPayload = {
  /**
   * You can pass an emit function if you want to know of the internal changes in the BlitzTable.
   *
   * This is purely for informative purposes, in case you don't need to know about these events you can pass an empty arrow function.
   */
  emit: {
    (e: 'update:filtersState', payload: FiltersState): void
    (e: 'update:sortState', payload: SortState): void
    (e: 'update:rowsPerPage', payload: number): void
    (e: 'update:pageNr', payload: number): void
    (e: 'update:searchValue', payload: string): void
  }
  currentRowIndexes: Ref<number[]>
  rows: AnyRef<BlitzTableProps['rows']>
  lang: AnyRef<Record<string, string>>
  sortState: SortState
  filtersState: FiltersState
  rowsPerPage: number
  pageNr: number
  searchValue: string
  searchablePropIds: AnyRef<SearchablePropIds>
  parseValueDic: AnyRef<ParseValueDic>
}

/**
 * useTableMeta is the heart of the BlitzTable which takes care of its internal state via refs that represent the data, current page, filtered state, etc.
 * It also exposes a number of computed props with information on the table used throughout the table and default components.
 */
export function useTableMeta(payload: UseTableMetaPayload): TableMeta {
  const { emit, rows, lang, currentRowIndexes, searchablePropIds, parseValueDic } = payload

  const sortState = propToWriteableComputed(payload.sortState, (newVal) =>
    emit('update:sortState', newVal)
  )
  const filtersState = propToWriteableComputed(payload.filtersState, (newVal) =>
    emit('update:filtersState', newVal)
  )
  const pageNr = propToWriteableComputed(payload.pageNr, (newVal) => emit('update:pageNr', newVal))
  const searchValue = propToWriteableComputed(payload.searchValue, (newVal) =>
    emit('update:searchValue', newVal)
  )
  const rowsPerPage = propToWriteableComputed(
    payload.rowsPerPage,
    (newRowsPerPage, oldRowsPerPage) => {
      emit('update:rowsPerPage', newRowsPerPage)
      const oldTopRowIndex = (pageNr.value - 1) * oldRowsPerPage
      // TODO: figure out a way to do this without a while loop
      if (oldTopRowIndex) {
        let lookingAtPageIndex = 0
        while (lookingAtPageIndex < currentRowIndexes.value.length) {
          const topRowIndex = lookingAtPageIndex * newRowsPerPage
          if (topRowIndex > oldTopRowIndex) {
            pageNr.value = Math.max(1, lookingAtPageIndex) // at least page 1
            lookingAtPageIndex = currentRowIndexes.value.length
          } else {
            lookingAtPageIndex++
          }
        }
      }
    }
  )

  const rowsFlat = computed(() => rows.value.map((row) => flattenObject(row)))

  const shouldCalculateRows = computed(() => {
    // console.log(`shouldCalculateRows!`)
    rows.value
    sortState.value
    searchValue.value
    Object.values(filtersState.value).map((info) =>
      Object.values(info).map((v) => {
        if (isSet(v)) return v.size
        if (isMap(v)) return [...v.values()]
        return v
      })
    )
    searchablePropIds.value
    parseValueDic.value
    rowsPerPage.value
    return Date.now()
  })

  const pageRowIndexes = computed(() =>
    currentRowIndexes.value.slice(fromIndex.value, toIndex.value)
  )

  const totalRowCount = computed(() => rows.value.length)

  const rowCount = computed(() => currentRowIndexes.value.length)

  const pageCount = computed(() => Math.ceil(rowCount.value / rowsPerPage.value))

  const fromIndex = computed(() => (pageNr.value - 1) * rowsPerPage.value)

  const toIndex = computed(() => Math.min(pageNr.value * rowsPerPage.value, rowCount.value))

  watch(rowCount, (val, oldVal) => {
    // Reset active page when results change
    pageNr.value = 1
  })

  watch(
    shouldCalculateRows,
    (_) => {
      let result = []

      const searchingOrFiltering = !!searchValue.value || shouldFilterRows(filtersState.value)
      const sorting = sortState.value.length > 0

      if (!searchingOrFiltering && !sorting) {
        // Skip processing and just get the currentRowIndexes
        result = rows.value.map((val, i) => i)
      } else {
        // Index it and prepare flattened data
        result = rows.value.map((val, i) => ({
          rowIndex: i,
          rowData: val,
          rowDataFlat: rowsFlat.value[i],
        }))

        if (searchingOrFiltering) {
          result = result.filter((row) => {
            // Filter it by field
            const filterHit = isRowFilterHit({
              filtersState: filtersState.value,
              row,
              parseValueDic: parseValueDic.value,
            })
            if (!filterHit) return false

            // Search it
            const searchHit = isRowSearchHit({
              searchStr: searchValue.value,
              row,
              searchablePropIds: searchablePropIds.value,
              parseValueDic: parseValueDic.value,
            })
            return searchHit
          })
        }

        // Sort it
        if (sorting) {
          result.sort(sortFactory(sortState.value, parseValueDic.value))
        }

        // We need only the currentRowIndexes
        result = result.map((row) => row.rowIndex)
      }
      currentRowIndexes.value = result
    },
    {
      immediate: true,
    }
  )

  return {
    rows,
    lang,
    sortState,
    filtersState,
    searchValue,
    rowsPerPage,
    pageNr,
    pageRowIndexes,
    totalRowCount,
    rowCount,
    pageCount,
    fromIndex,
    toIndex,
  }
}

export function tableMetaExamplePayload(
  partial: Partial<UseTableMetaPayload>
): UseTableMetaPayload {
  return {
    emit: () => {},
    currentRowIndexes: ref([]),
    rows: ref([]),
    lang: ref({}),
    sortState: [],
    filtersState: {},
    rowsPerPage: 0,
    pageNr: 1,
    searchValue: '',
    searchablePropIds: ref([]),
    parseValueDic: ref({}),
    ...partial,
  }
}
