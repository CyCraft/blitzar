<template>
  <div class="preview-code q-mt-xl">
    <pre class="language-js"><code>/** {{ comment }} */
{{ code }}</code></pre>
  </div>
</template>

<style lang="stylus" scoped>
// $

// .preview-code
</style>

<script>
export default {
  name: 'PreviewCode',
  props: {
    comment: String,
    code: String,
  },
}
</script>
