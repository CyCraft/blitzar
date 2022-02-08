<script lang="ts" setup>
import { ref } from 'vue'
import BlitzFilters from '../BlitzFilters.vue'
import { BlitzFilterOptions, FiltersState } from '@blitzar/types'
import { useTableMeta } from '../../BlitzTable/tableMeta'

const filtersState = ref<FiltersState>({})

const filterOptions = ref<BlitzFilterOptions>({
  balance: [
    { label: '', value: 100, op: '>' },
    { label: '', value: 200, op: '<' },
  ],
  birthdate: [
    { label: '', value: new Date(1945, 0, 1), op: '>' },
    { label: '', value: new Date(1955, 11, 31), op: '<' },
  ],
})

const tableMeta = useTableMeta({
  emit: () => {},
  currentRowIndexes: ref([]),
  rows: ref([]),
  lang: ref({}),
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
