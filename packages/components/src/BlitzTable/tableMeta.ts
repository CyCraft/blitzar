import { ref, computed, watch, nextTick, Ref, ComputedRef, WritableComputedRef } from 'vue'
import { flattenObject } from 'flatten-anything'
import { isEmptyObject } from 'is-what'
import type {
  SearchablePropIds,
  ParseValueDic,
  SortState,
  BlitzTableProps,
  TableMeta,
  FiltersState,
  AnyRef,
} from '@blitzar/types'
import {
  createPagingRange,
  sortFactory,
  isRowFilterHit,
  isRowSearchHit,
  shouldFilterRows,
} from '../helpersTable'
import { propToWriteableComputed } from '../helpersVue'

export function useTableMeta(payload: {
  emit: {
    (e: 'update:selectedRows', payload: Record<string, any>[]): void
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
}): TableMeta {
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
  const rowsPerPage = propToWriteableComputed(payload.rowsPerPage, (newVal) => {
    emit('update:rowsPerPage', newVal)
    const pagesBeforeChange = pageLinks.value
    nextTick().then(() => {
      const pagesAfterChange = pageLinks.value
      if (pagesAfterChange.length < pagesBeforeChange.length) {
        pageNr.value = pagesAfterChange[pagesAfterChange.length - 1] as number
      }
    })
  })

  const rowsFlat = computed(() => rows.value.map((row) => flattenObject(row)))

  const shouldCalculateRows = computed(() => {
    console.log(`shouldCalculateRows!`)
    rows.value
    sortState.value
    searchValue.value
    Object.values(filtersState.value).map((map) => map.values())
    searchablePropIds.value
    parseValueDic.value
    rowsPerPage.value
    return Date.now()
  })

  const pageRowIndexes = computed(() =>
    currentRowIndexes.value.slice(fromIndex.value, toIndex.value)
  )

  const pageLinks = computed(() => createPagingRange(pageCount.value, pageNr.value))

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
    lang,
    sortState,
    filtersState,
    searchValue,
    rowsPerPage,
    pageNr,
    pageRowIndexes,
    pageLinks,
    totalRowCount,
    rowCount,
    pageCount,
    fromIndex,
    toIndex,
  }
}
