<script lang="ts" setup>
import { BlitzTableProps, FiltersState } from '@blitzar/types'
import { ref } from 'vue'
import BlitzFilters from '../BlitzFilters.vue'

const lang = ref<Record<string, string>>({
  color: 'color 🌈',
  red: 'red 🌶',
  blue: 'blue 🦕',
  yellow: 'yellow 🧀',
})
const filtersState = ref<FiltersState>({
  color: new Map([
    ['blue', false],
    ['red', true],
    ['yellow', false],
  ]),
})
const filters = ref<BlitzTableProps['filters']>({
  color: [
    { label: '!blue', value: 'blue' },
    { label: '!red', value: 'red' },
    { label: '!yellow', value: 'yellow' },
  ],
})
</script>

<template>
  <BlitzFilters v-model:filtersState="filtersState" :lang="lang" :filters="filters" />
</template>
