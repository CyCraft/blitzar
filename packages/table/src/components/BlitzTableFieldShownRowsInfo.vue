<template>
  <div class="blitz-table-field-shown-rows-info" v-bind="$attrs">
    {{ shownRowsInfoText }}
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'BlitzTableFieldShownRowsInfo',
  props: {
    showingFrom: Number,
    showingTo: Number,
    rowCountFiltered: Number,
    rowCountTotal: Number,
  },
  setup(props) {
    const shownRowsInfoText = computed(
      () => `${props.showingFrom} - ${props.showingTo} / ${props.rowCountFiltered}`
    )

    return {
      shownRowsInfoText,
    }
  },
})
</script>
