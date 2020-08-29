<template>
  <q-page class="page-docs" padding>
    <!-- example card sections -->
    <div v-for="eg in pageSections" :key="routeName + eg" class="mb-xxxl">
      <h1 :id="eg">{{ spaceCase(pascalCase(eg)) }}</h1>
      <div class="column items-strech">
        <ExampleSection
          :filePath="`pages/${routeName}/${eg}.vue`"
          style="width: 100%"
          :hideTitle="true"
        />
      </div>
    </div>
    <!-- api card section -->
    <div class="mb-xxxl">
      <ApiComponentExample id="api-card" :filePath="filePathToCarbonCopySourceCode" />
    </div>
  </q-page>
</template>

<style lang="sass">
// .page-docs
</style>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { ExampleSection, ApiComponentExample } from 'planetar'
import { spaceCase, pascalCase } from 'case-anything'
import { routeNamePageSectionsMap } from '../config/pageSections'
import { ROUTE_NAMES } from '../router/routes'

export default defineComponent({
  components: { ExampleSection, ApiComponentExample },
  props: {
    id: { type: String },
  },
  setup(props, options) {
    const routeName = options.root.$route.name as ROUTE_NAMES
    const pageSections = computed(() => routeNamePageSectionsMap[routeName])

    const filePathToCarbonCopySourceCode = computed(() =>
      routeName === 'BlitzForm'
        ? 'components/atoms/form/components/BlitzForm.vue'
        : 'components/atoms/table/components/BlitzTable.vue'
    )

    return { routeName, pageSections, spaceCase, pascalCase, filePathToCarbonCopySourceCode }
  },
})
</script>
