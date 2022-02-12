<script lang="ts" setup>
import { ref } from 'vue'
import BlitzFilters from '../BlitzFilters.vue'
import { BlitzFilterOptions, FiltersState } from '@blitzar/types'
import { tableMetaExamplePayload, useTableMeta } from '../../BlitzTable/tableMeta'

const filtersState = ref<FiltersState>({})

const filterOptions = ref<BlitzFilterOptions>({
  birthdate: [
    {
      label: 'Year',
      compareFn: (val: Date, userInput: number) => val.getFullYear() === userInput,
      component: 'input',
      defaultValue: 1945,
      type: 'number',
    },
    {
      label: 'Month (1 = Jan.)',
      compareFn: (val: Date, userInput: number) => val.getMonth() + 1 === userInput,
      component: 'input',
      defaultValue: new Date().getMonth(),
      type: 'number',
    },
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
