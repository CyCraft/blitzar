<template>
  <slot
    :ds="{
      dsIndexes,
      dsShowEntries,
      dsResultsNumber,
      dsPage,
      dsPagecount,
      dsFrom,
      dsTo,
      dsData,
      dsRows,
      dsPages,
      search,
      showEntries,
      setActive,
    }"
  ></slot>
</template>

<script>
import { ref, computed, provide, watch, nextTick } from 'vue'
import { flattenObject } from 'flatten-anything'
import { isEmptyObject } from 'is-what'
import { createPagingRange, fieldSorter, filterRow, findAny } from './helpers'

export default {
  props: {
    dsData: { type: Array, default: () => [] },
    dsFilterFields: { type: Object, default: () => ({}) },
    dsSortby: { type: Array, default: () => [] },
    dsSearchIn: { type: Array, default: () => [] },
    dsSearchAs: { type: Object, default: () => ({}) },
    dsSortAs: { type: Object, default: () => ({}) },
  },
  /**
   * @param {{
   *   dsData: Record<string, any>[];
   *   dsFilterFields: { [colId in string]: (cellValue: any, rowData: Record<string, any>) => boolean | any };
   *   dsSortby: string[];
   *   dsSearchIn: string[];
   *   dsSearchAs: { [id in string]: (cellValue: any, searchString: string, rowData: Record<string, any>) => boolean };
   *   dsSortAs: { [id in string]: (cellValue: any, rowData: Record<string, any>) => any };
   * }} props
   */
  setup(props) {
    const dsPage = ref(1)
    const dsSearch = ref('')
    const dsShowEntries = ref(10)
    const indexes = ref([])

    const search = (value) => {
      dsSearch.value = value
    }

    const showEntries = async (value) => {
      const pagesBeforeChange = dsPages.value
      dsShowEntries.value = value
      await nextTick()
      const pagesAfterChange = dsPages.value
      if (pagesAfterChange.length < pagesBeforeChange.length) {
        setActive(pagesAfterChange[pagesAfterChange.length - 1])
      }
    }

    const setActive = (value) => {
      dsPage.value = value
    }

    const whenChanged = computed(() => {
      /* eslint-disable no-unused-expressions */
      props.dsData
      dsSearch.value
      props.dsSortby
      props.dsFilterFields
      props.dsSearchIn
      props.dsSearchAs
      props.dsSortAs
      dsShowEntries.value
      return Date.now()
    })

    const dsRows = computed(() => {
      return indexes.value.slice(dsFrom.value, dsTo.value)
    })

    const dsPages = computed(() => {
      return createPagingRange(dsPagecount.value, dsPage.value)
    })

    const dsResultsNumber = computed(() => {
      return indexes.value.length
    })

    const dsPagecount = computed(() => {
      return Math.ceil(dsResultsNumber.value / dsShowEntries.value)
    })

    const dsFrom = computed(() => {
      return (dsPage.value - 1) * dsShowEntries.value
    })

    const dsTo = computed(() => {
      return dsPage.value * dsShowEntries.value
    })

    watch(dsResultsNumber, (val, oldVal) => {
      // Reset active page when results change
      setActive(1)
    })

    watch(
      whenChanged,
      (val, oldVal) => {
        let result = []

        if (!dsSearch.value && !props.dsSortby.length && isEmptyObject(props.dsFilterFields)) {
          // Skip processing and just get the indexes
          result = props.dsData.map((val, i) => i)
        } else {
          // Index it and prepare flattened data
          result = props.dsData.map((val, i) => ({
            rowIndex: i,
            rowData: val,
            rowDataFlat: flattenObject(val),
          }))

          result = result.filter((row) => {
            return (
              // Filter it by field
              filterRow(row, props.dsFilterFields) &&
              // Search it
              findAny(props.dsSearchIn, props.dsSearchAs, row, dsSearch.value)
            )
          })

          // Sort it
          if (props.dsSortby.length) {
            result.sort(fieldSorter(props.dsSortby, props.dsSortAs))
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

    provide('search', search)
    provide('showEntries', showEntries)
    provide('setActive', setActive)
    provide(
      'dsData',
      computed(() => props.dsData)
    )
    provide('dsRows', dsRows)
    provide('dsPages', dsPages)
    provide('dsResultsNumber', dsResultsNumber)
    provide('dsPagecount', dsPagecount)
    provide('dsFrom', dsFrom)
    provide('dsTo', dsTo)
    provide('dsPage', dsPage)

    return {
      dsIndexes: indexes,
      dsShowEntries,
      dsResultsNumber,
      dsPage,
      dsPagecount,
      dsFrom,
      dsTo,
      dsRows,
      dsPages,
      search,
      showEntries,
      setActive,
    }
  },
}
</script>
