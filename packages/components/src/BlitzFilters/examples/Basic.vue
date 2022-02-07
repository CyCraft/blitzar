<script lang="ts" setup>
import { BlitzTableProps, FiltersState } from '@blitzar/types'
import { ref } from 'vue'
import BlitzFilters from '../BlitzFilters.vue'

const filtersState = ref<FiltersState>({})
const filters = ref<BlitzTableProps['filters']>({
  color: [
    { label: 'Blue', value: 'blue' },
    { label: 'Red', value: 'red', defaultValue: false },
    { label: 'Yellow', value: 'yellow' },
  ],
})
</script>

<template>
  <BlitzFilters v-model:filtersState="filtersState" :lang="{}" :filters="filters" />
  <pre>{{ filtersState }}</pre>
</template>
