<script lang="ts" setup>
import { computed } from 'vue'
import { isFullString } from 'is-what'
import { ROW_SELECTION_ID } from '@blitzar/types'
import type { BlitzColumn, SortState } from '@blitzar/types'
import BlitzField from '../BlitzField/BlitzField.vue'

const props = defineProps<{
  /**
   * The BlitzField object used for the columns
   */
  column: BlitzColumn
  /**
   * Currently only compatible with 1 column sorted
   */
  sortState: SortState
  lang: Record<string, string>
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

const label = computed<string>(() => {
  const { label, id } = props.column
  if (isFullString(label)) return props.lang[label] || label
  if (isFullString(id)) return props.lang[id] || id
  return ''
})

const isSelectionCol = props.column.id === ROW_SELECTION_ID
</script>

<template>
  <th
    v-bind="$attrs"
    :class="[
      'blitz-field-th',
      column.sortable === true ? '_sortable' : '',
      column.id === sortState[0]?.id ? `_${sortState[0]?.direction}` : '',
    ]"
    @click="(e) => onClick(e)"
  >
    {{ label }}
    <i v-if="column.sortable === true" class="_sort-arrows"></i>
    <BlitzField v-if="isSelectionCol" v-bind="column" :label="undefined" />
  </th>
</template>

<style scoped>
._sort-arrows {
  float: right;
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(1);
  width: 22px;
  height: 22px;
}
._sort-arrows::after,
._sort-arrows::before {
  content: '';
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 8px;
  height: 8px;
  left: 7px;
  transform: rotate(-45deg);
}
._sort-arrows::before {
  border-left: 2px solid;
  border-bottom: 2px solid;
  bottom: 4px;
  opacity: 0.3;
}
._sort-arrows::after {
  border-right: 2px solid;
  border-top: 2px solid;
  top: 4px;
  opacity: 0.3;
}
.blitz-field-th._sortable {
  cursor: pointer;
  user-select: none;
}
.blitz-field-th._sortable._asc ._sort-arrows::after {
  opacity: 1;
}
.blitz-field-th._sortable._desc ._sort-arrows::before {
  opacity: 1;
}
</style>
