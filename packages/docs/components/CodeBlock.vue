<template>
  <div :class="`language-${lang}`">
    <pre :class="`language-${lang}`"><code :class="`language-${lang}`"><slot /></code></pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CodeBlock',
  props: {
    lang: { type: String, default: 'js' },
  },
})
</script>
