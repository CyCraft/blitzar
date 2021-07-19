<template>
  <PComponentCodeBlock
    :importComponentInstanceFn="() => import(`../docs/${filename}.vue`)"
    :importComponentRawFn="() => import(`../docs/${filename}.vue?raw`)"
  />
</template>

<script>
import { ComponentCodeBlock as PComponentCodeBlock } from '@planetar/component-code-block'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComponentCodeBlock',
  components: { PComponentCodeBlock },
  props: {
    filename: { type: String },
  },
  setup() {},
})
</script>
