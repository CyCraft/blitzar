<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { TableMeta } from '../typesTable'

export default defineComponent({
  name: 'BlitzTableItem',
  props: {
    rows: { type: Array as PropType<Record<string, any>[]>, required: true },
    shownFrom: { type: Number, required: true },
    shownTo: { type: Number, required: true },
    shownRows: { type: Array as PropType<number[]>, required: true },
  },
  setup(props) {
    const visibleIndexes = computed(() => {
      const arr = []
      for (let i = props.shownFrom; i < props.shownTo; i++) {
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
  <template v-for="(rowIndex, i) in shownRows">
    <slot :row="rows[rowIndex]" :rowIndex="rowIndex" :index="visibleIndexes[i]"></slot>
  </template>

  <slot v-if="!shownRows.length" name="noDataFound"></slot>
</template>
