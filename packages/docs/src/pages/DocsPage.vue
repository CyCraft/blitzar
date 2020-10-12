<template>
  <q-page class="page-docs" padding>
    <DocPage
      :pathToChapterFiles="pathToChapterFiles"
      :chapterOrder="chapterOrder"
      :pathToApiCardSourceFile="pathToApiCardSourceFile"
      @TOC="(TOC) => $emit('set-toc', TOC)"
    />
  </q-page>
</template>

<style lang="sass">
// $
.page-docs
  .markdown
    +C(color, 'white')
  .planetar-example-card
    +C(color, 'black')
</style>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { DocPage } from 'planetar'
import { routeNamePageChaptersMap } from '../config/pageChapters'
import { ROUTE_NAMES } from '../router/routes'

export default defineComponent({
  components: { DocPage },
  props: {
    id: { type: String },
  },
  setup(props, options) {
    const routeName = options.root.$route.name as ROUTE_NAMES
    const pathToChapterFiles = 'pages/' + routeName
    const chapterOrder = computed((): string[] => routeNamePageChaptersMap[routeName])
    const pathToApiCardSourceFile = computed(() =>
      routeName === 'BlitzForm'
        ? 'components/atoms/form/components/BlitzForm.vue'
        : 'components/atoms/table/components/BlitzTable.vue'
    )

    return { pathToChapterFiles, chapterOrder, pathToApiCardSourceFile }
  },
})
</script>
