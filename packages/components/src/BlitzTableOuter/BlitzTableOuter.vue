<script lang="ts">
import { ref, computed, watch, nextTick, PropType, defineComponent } from 'vue'
import { flattenObject } from 'flatten-anything'
import { isEmptyObject } from 'is-what'
import { createPagingRange, sortFactory, filterRow, isRowSearchHit } from '../helpersTable'
import type { FilterFns, SearchablePropIds, ParseValueDic, SortState } from '../typesTable'

/**
 * A renderless component that calculates and only provides the scope required to create data tables and grids
 */
export default defineComponent({
  name: 'BlitzTableOuter',
  props: {
    rows: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
    filterFns: { type: Object as PropType<FilterFns>, default: () => ({}) },
    sortStateArr: { type: Array as PropType<SortState[]>, default: () => [] },
    searchablePropIds: { type: Array as PropType<SearchablePropIds>, default: () => [] },
    parseValueDic: { type: Object as PropType<ParseValueDic>, default: () => ({}) },
  },
  setup(props) {
    const currentPageNr = ref(1)
    const searchString = ref('')
    const rowsPerPage = ref(10)
    const indexes = ref<number[]>([])

    const search = (value: string) => {
      searchString.value = value
    }

    const setRowsPerPage = async (value: number) => {
      const pagesBeforeChange = shownPageIndexes.value
      rowsPerPage.value = value
      await nextTick()
      const pagesAfterChange = shownPageIndexes.value
      if (pagesAfterChange.length < pagesBeforeChange.length) {
        setPageNr(pagesAfterChange[pagesAfterChange.length - 1] as number)
      }
    }

    const setPageNr = (value: number) => {
      currentPageNr.value = value
    }

    const whenChanged = computed(() => {
      props.rows
      searchString.value
      props.sortStateArr
      props.filterFns
      props.searchablePropIds
      props.parseValueDic
      rowsPerPage.value
      return Date.now()
    })

    const shownRows = computed(() => {
      return indexes.value.slice(shownFrom.value, shownTo.value)
    })

    const shownPageIndexes = computed(() => {
      return createPagingRange(currentPageCount.value, currentPageNr.value)
    })

    const currentResultsCount = computed(() => {
      return indexes.value.length
    })

    const currentPageCount = computed(() => {
      return Math.ceil(currentResultsCount.value / rowsPerPage.value)
    })

    const shownFrom = computed(() => {
      return (currentPageNr.value - 1) * rowsPerPage.value
    })

    const shownTo = computed(() => {
      return currentPageNr.value * rowsPerPage.value
    })

    watch(currentResultsCount, (val, oldVal) => {
      // Reset active page when results change
      setPageNr(1)
    })

    watch(
      whenChanged,
      (val, oldVal) => {
        let result = []

        if (!searchString.value && !props.sortStateArr.length && isEmptyObject(props.filterFns)) {
          // Skip processing and just get the indexes
          result = props.rows.map((val, i) => i)
        } else {
          // Index it and prepare flattened data
          result = props.rows.map((val, i) => ({
            rowIndex: i,
            rowData: val,
            rowDataFlat: flattenObject(val),
          }))

          result = result.filter((row) => {
            return (
              // Filter it by field
              filterRow(row, props.filterFns) &&
              // Search it
              isRowSearchHit({
                searchStr: searchString.value,
                row,
                searchablePropIds: props.searchablePropIds,
                parseValueDic: props.parseValueDic,
              })
            )
          })

          // Sort it
          if (props.sortStateArr.length) {
            result.sort(sortFactory(props.sortStateArr, props.parseValueDic))
          }

          // We need only the indexes
          result = result.map((row) => row.rowIndex)
        }
        indexes.value = result
      },
      {
        immediate: true,
      }
    )

    return {
      currentIndexes: indexes,
      rowsPerPage,
      currentResultsCount,
      currentPageNr,
      currentPageCount,
      shownFrom,
      shownTo,
      shownRows,
      shownPageIndexes,
      search,
      setRowsPerPage,
      setPageNr,
    }
  },
})
</script>

<template>
  <slot
    :tableMeta="{
      currentIndexes,
      shownRows,
      rowsPerPage,
      currentResultsCount,
      currentPageNr,
      currentPageCount,
      shownFrom,
      shownTo,
      shownPageIndexes,
      search,
      setRowsPerPage,
      setPageNr,
    }"
  ></slot>
</template>
