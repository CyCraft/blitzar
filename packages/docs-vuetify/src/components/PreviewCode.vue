<template>
  <div class="preview-code">
    <pre
      class="_codeblock language-js"
    ><code>{{ comment ? `/** ${comment} */\n` : '' }}<slot /></code></pre>
  </div>
</template>

<style lang="sass" scoped>
// $
$c-code-space: #02122d

.preview-code
  margin-top: 2rem
  > ._codeblock
    background: $c-code-space
    padding: 1rem
    code
      background: none
      color: white
</style>

<script>
export default {
  name: 'PreviewCode',
  props: {
    comment: String,
  },
}
</script>
