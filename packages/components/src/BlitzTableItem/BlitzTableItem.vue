<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import type { BlitzTableProps } from '@blitzar/types'

export default defineComponent({
  name: 'BlitzTableItem',
  props: {
    rows: { type: Array as PropType<BlitzTableProps['rows']>, required: true },
    fromIndex: { type: Number, required: true },
    toIndex: { type: Number, required: true },
    pageRowIndexes: { type: Array as PropType<number[]>, required: true },
  },
  setup(props) {
    const visibleIndexes = computed(() => {
      const arr = []
      for (let i = props.fromIndex; i < props.toIndex; i++) {
        arr.push(i)
      }
      return arr
    })

    return {
      visibleIndexes,
    }
  },
})
</script>

<template>
  <template v-for="(rowIndex, i) in pageRowIndexes">
    <slot :row="rows[rowIndex]" :rowIndex="rowIndex" :index="visibleIndexes[i]"></slot>
  </template>

  <slot v-if="!pageRowIndexes.length" name="noDataFound"></slot>
</template>
