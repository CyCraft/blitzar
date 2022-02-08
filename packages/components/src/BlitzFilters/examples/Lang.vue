<script lang="ts" setup>
import { ref } from 'vue'
import BlitzFilters from '../BlitzFilters.vue'
import { BlitzFilterOptions, FiltersState } from '@blitzar/types'
import { tableMetaExamplePayload, useTableMeta } from '../../BlitzTable/tableMeta'

const lang = ref<Record<string, string>>({
  color: 'color 🌈',
  red: 'red 🌶',
  blue: 'blue 🦕',
  yellow: 'yellow 🧀',
})

const filtersState = ref<FiltersState>({
  color: { in: new Set(['red']), 'not-in': new Set(['blue', 'yellow']) },
})

const filterOptions = ref<BlitzFilterOptions>({
  color: [
    { label: '!blue', value: 'blue' },
    { label: '!red', value: 'red' },
    { label: '!yellow', value: 'yellow' },
  ],
})

const tableMeta = useTableMeta(tableMetaExamplePayload({ filtersState: filtersState.value, lang }))
</script>

<template>
  <BlitzFilters v-model="filtersState" :tableMeta="tableMeta" :filterOptions="filterOptions" />

  <details style="margin-top: 1rem">
    <summary>modelValue</summary>
    <pre>{{ filtersState }}</pre>
  </details>
</template>
