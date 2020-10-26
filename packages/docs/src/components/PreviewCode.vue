<template>
  <div class="preview-code q-mt-xl">
    <pre
      class="_codeblock language-js"
    ><code>{{ comment ? `/** ${comment} */\n` : '' }}<slot /></code></pre>
  </div>
</template>

<style lang="sass" scoped>
// $

.preview-code
  > ._codeblock
    +C(background, code-space)
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'PreviewCode',
  props: {
    comment: String,
  },
})
</script>
