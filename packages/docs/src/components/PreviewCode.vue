<template>
  <div class="preview-code q-mt-xl">
    <pre class="language-js"><code>{{ comment ? `/** ${comment} */\n` : '' }}<slot /></code></pre>
  </div>
</template>

<style lang="sass" scoped>
// $

// .preview-code
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
