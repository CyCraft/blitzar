<script lang="ts" setup>
import { ref } from 'vue'
import BlitzPagination from '../BlitzPagination.vue'

const pageNrA = ref(1)
const pageNrB = ref(1)
const pageNrC = ref(1)
</script>

<template>
  pageNrA: <code>{{ pageNrA }}</code>
  <BlitzPagination v-model="pageNrA" :pageCount="3" />

  pageNrB: <code>{{ pageNrB }}</code>
  <BlitzPagination v-model="pageNrB" :pageCount="9" />

  pageNrC: <code>{{ pageNrC }}</code>
  <BlitzPagination v-model="pageNrC" :pageCount="100" />
</template>
