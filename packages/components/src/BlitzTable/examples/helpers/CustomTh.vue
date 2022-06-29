<script lang="ts" setup>
import { BlitzColumn, SortState } from '@blitzar/types'

const props = defineProps<{
  /**
   * The BlitzField object used for the columns
   */
  column: BlitzColumn
  /**
   * Currently only compatible with 1 column sorted
   */
  sortState: SortState
}>()

const emit = defineEmits<{
  (e: 'update:sortState', payload: SortState): void
}>()

function onClick(e: MouseEvent) {
  const { id, sortable } = props.column
  if (!sortable || !id) return

  e.stopPropagation()

  if (props.sortState[0]?.id !== id) {
    return emit('update:sortState', [{ id, direction: 'asc' }])
  }
  if (props.sortState[0]?.id === id) {
    if (props.sortState[0]?.direction === 'asc') {
      return emit('update:sortState', [{ id, direction: 'desc' }])
    } else {
      return emit('update:sortState', [])
    }
  }
}
</script>

<template>
  <th @click="(e) => onClick(e)">
    <div style="display: flex; cursor: ns-resize; user-select: none">
      {{ column.label }}
      <template v-if="column.sortable && sortState[0]?.id === column.id">
        <template v-if="sortState[0]?.direction === 'desc'">
          <div style="color: black">↑</div>
          <div style="color: lightgrey">↓</div>
        </template>
        <template v-if="sortState[0]?.direction === 'asc'">
          <div style="color: lightgrey">↑</div>
          <div style="color: black">↓</div>
        </template>
      </template>
      <template v-else-if="column.sortable">
        <div style="color: lightgrey">↑</div>
        <div style="color: lightgrey">↓</div>
      </template>
    </div>
  </th>
</template>
