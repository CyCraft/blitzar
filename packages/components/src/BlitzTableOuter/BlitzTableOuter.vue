<script lang="ts">
import { ref, computed, watch, nextTick, PropType, defineComponent, unref } from 'vue'
import { flattenObject } from 'flatten-anything'
import { isEmptyObject } from 'is-what'
import { createPagingRange, fieldSorter, filterRow, findAny } from '../helpersTable'
import type {
  BlitzColumnProps,
  DsData,
  DsFilterFields,
  DsSortby,
  DsSearchIn,
  DsSearchAs,
  DsSortAs,
  DsScope,
} from '../typesTable'

/**
 * A renderless component that calculates and only provides the scope required to create data tables and grids
 */
export default defineComponent({
  name: 'BlitzTableOuter',
  props: {
    dsData: { type: Array as PropType<DsData>, default: () => [] },
    dsFilterFields: { type: Object as PropType<DsFilterFields>, default: () => ({}) },
    dsSortby: { type: Array as PropType<DsSortby>, default: () => [] },
    dsSearchIn: { type: Array as PropType<DsSearchIn>, default: () => [] },
    dsSearchAs: { type: Object as PropType<DsSearchAs>, default: () => ({}) },
    dsSortAs: { type: Object as PropType<DsSortAs>, default: () => ({}) },
  },
  setup(props) {
    const dsPage = ref(1)
    const dsSearch = ref('')
    const dsShowEntries = ref(10)
    const indexes = ref<number[]>([])

    const search = (value: string) => {
      dsSearch.value = value
    }

    const showEntries = async (value: number) => {
      const pagesBeforeChange = dsPages.value
      dsShowEntries.value = value
      await nextTick()
      const pagesAfterChange = dsPages.value
      if (pagesAfterChange.length < pagesBeforeChange.length) {
        setActive(pagesAfterChange[pagesAfterChange.length - 1] as number)
      }
    }

    const setActive = (value: number) => {
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
})
</script>

<template>
  <slot
    :ds="{
      dsData,
      dsIndexes,
      dsRows,
      dsShowEntries,
      dsResultsNumber,
      dsPage,
      dsPagecount,
      dsFrom,
      dsTo,
      dsPages,
      search,
      showEntries,
      setActive,
    }"
  ></slot>
</template>
