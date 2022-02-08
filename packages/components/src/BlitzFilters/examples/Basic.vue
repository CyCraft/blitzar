<script lang="ts" setup>
import { ref } from 'vue'
import BlitzFilters from '../BlitzFilters.vue'
import { BlitzFilterOptions, FiltersState } from '@blitzar/types'
import { tableMetaExamplePayload, useTableMeta } from '../../BlitzTable/tableMeta'

const filtersState = ref<FiltersState>({})

const filterOptions = ref<BlitzFilterOptions>({
  color: [
    { label: 'Blue', value: 'blue' },
    { label: 'Red', value: 'red', op: '!==' },
    { label: 'Yellow', value: 'yellow' },
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
