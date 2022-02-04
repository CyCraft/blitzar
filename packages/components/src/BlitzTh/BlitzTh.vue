<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ROW_SELECTION_ID } from '@blitzar/types'
import BlitzField from '../BlitzField/BlitzField.vue'
import type { BlitzColumn, SortState } from '../typesTable'

export default defineComponent({
  name: 'BlitzTh',
  components: { BlitzField },
  props: {
    /**
     * The BlitzField object used for the columns
     */
    column: { type: Object as PropType<BlitzColumn>, required: true },
    sortState: { type: Object as PropType<SortState>, required: true },
  },
  emits: ['update:sortState'],
  setup(props, { emit }) {
    function onClick(e: MouseEvent) {
      if (!props.column.sortable) return

      e.stopPropagation()
      const id = props.column.id

      if (props.sortState.id !== id) {
        return emit('update:sortState', { id, direction: 'asc' })
      }
      if (props.sortState.id === id) {
        if (props.sortState.direction === 'asc') {
          return emit('update:sortState', { id, direction: 'desc' })
        } else {
          return emit('update:sortState', { id: null, direction: 'none' })
        }
      }
    }

    const isSelectionCol = props.column.id === ROW_SELECTION_ID

    return { onClick, isSelectionCol }
  },
})
</script>

<template>
  <th
    v-bind="$attrs"
    :class="[
      'blitz-field-th',
      column.sortable === true ? '_sortable' : '',
      column.id === sortState.id ? `_${sortState.direction}` : '',
    ]"
    @click="(e) => onClick(e)"
  >
    <slot />
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
