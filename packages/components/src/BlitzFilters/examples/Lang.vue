<script lang="ts" setup>
import { ref } from 'vue'
import BlitzFilters from '../BlitzFilters.vue'
import { BlitzFilterOptions, FiltersState } from '@blitzar/types'
import { useTableMeta } from '../../BlitzTable/tableMeta'

const lang = ref<Record<string, string>>({
  color: 'color 🌈',
  red: 'red 🌶',
  blue: 'blue 🦕',
  yellow: 'yellow 🧀',
})

const filtersState = ref<FiltersState>({
  color: new Map([
    ['blue', '!=='],
    ['red', '==='],
    ['yellow', '!=='],
  ]),
})

const filterOptions = ref<BlitzFilterOptions>({
  color: [
    { label: '!blue', value: 'blue' },
    { label: '!red', value: 'red' },
    { label: '!yellow', value: 'yellow' },
  ],
})

const tableMeta = useTableMeta({
  emit: () => {},
  currentRowIndexes: ref([]),
  rows: ref([]),
  lang,
  sortState: [],
  filtersState: filtersState.value,
  rowsPerPage: 0,
  pageNr: 1,
  searchValue: '',
  searchablePropIds: ref([]),
  parseValueDic: ref({}),
})
</script>

<template>
  <BlitzFilters v-model="filtersState" :tableMeta="tableMeta" :filterOptions="filterOptions" />
</template>
