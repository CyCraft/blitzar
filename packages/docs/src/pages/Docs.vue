<template>
  <q-page class="page-docs" padding>
    <div class="text-h2">{{ id }}</div>
    <div class="column items-strech">
      <ExampleSection
        :key="id"
        :filePath="`pages/content/${id}.vue`"
        style="width: 100%"
        :hideTitle="true"
      />
    </div>
  </q-page>
</template>

<style lang="sass">
// .page-docs
</style>

<script>
import { ExampleSection } from 'planetar'

export default {
  components: { ExampleSection },
  props: {
    id: { type: String },
  },
  data() {
    return {}
  },
}
</script>
