<script lang="ts" setup>
import { ref } from 'vue'
import BlitzFilters from '../BlitzFilters.vue'
import { BlitzFilterOptions, FiltersState } from '@blitzar/types'
import { tableMetaExamplePayload, useTableMeta } from '../../BlitzTable/tableMeta'

const filtersState = ref<FiltersState>({})

const filterOptions = ref<BlitzFilterOptions>({
  balance: [
    { value: 100, op: '>' },
    { value: 200, op: '<' },
  ],
  birthdate: [
    { value: new Date(1945, 0, 1), op: '>' },
    { value: Date, op: '<' },
  ],
})

const tableMeta = useTableMeta(tableMetaExamplePayload({ filtersState: filtersState.value }))
</script>

<template>
  <BlitzFilters v-model="filtersState" :tableMeta="tableMeta" :filterOptions="filterOptions" />

  <details style="margin-top: 1rem">
    <summary>modelValue</summary>
    <pre>{{ filtersState }}</pre>
  </details>
</template>
