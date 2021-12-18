<script lang="ts">
import { inject, computed, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const indexes = computed(() => {
      const dsFrom = (inject('dsFrom') as any).value as number
      const dsTo = (inject('dsTo') as any).value as number

      const arr = []
      for (let i = dsFrom; i < dsTo; i++) {
        arr.push(i)
      }
      return arr
    })

    return {
      dsData: inject('dsData') as Record<string, any>[],
      dsRows: inject('dsRows') as number[],
      indexes,
    }
  },
})
</script>

<template>
  <template v-for="(rowIndex, i) in dsRows">
    <slot :row="dsData[rowIndex]" :rowIndex="rowIndex" :index="indexes[i]"></slot>
  </template>
  <slot v-if="!dsRows.length" name="noDataFound"></slot>
</template>
