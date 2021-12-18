<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { DsScope } from './types'

export default defineComponent({
  name: 'BlitzTableItem',
  props: {
    dsFrom: { type: Number, required: true },
    dsTo: { type: Number, required: true },
    dsData: { type: Array as PropType<Record<string, any>[]>, required: true },
    dsRows: { type: Array as PropType<number[]>, required: true },
  },
  setup(props) {
    const visibleIndexes = computed(() => {
      const arr = []
      for (let i = props.dsFrom; i < props.dsTo; i++) {
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
  <template v-for="(rowIndex, i) in dsRows">
    <slot :row="dsData[rowIndex]" :rowIndex="rowIndex" :index="visibleIndexes[i]"></slot>
  </template>

  <slot v-if="!dsRows.length" name="noDataFound"></slot>
</template>
