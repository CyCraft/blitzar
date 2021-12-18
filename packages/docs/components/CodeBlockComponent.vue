<template>
  <ClientOnly
    ><PCodeBlockComponent :importComponentInstanceFn="importFn" :importComponentRawFn="importFnRaw"
  /></ClientOnly>
</template>

<script>
import { CodeBlockComponent as PCodeBlockComponent } from '@planetar/code-block'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { PCodeBlockComponent },
  props: {
    /**
     * @example () => import(`../docs/Filename.vue`)
     */
    importFn: { type: Function, required: true },
    /**
     * @example () => import(`../docs/Filename.vue?raw`)
     */
    importFnRaw: { type: Function, required: true },
  },
  setup() {},
})
</script>
