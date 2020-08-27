<template>
  <q-page class="page-docs-blitz-form" padding>
    <!-- example card sections -->
    <div v-for="eg in exampleOrder" :key="eg" class="mb-xxxl">
      <h1 :id="eg">{{ spaceCase(pascalCase(eg)) }}</h1>
      <div class="column items-strech">
        <ExampleSection
          :filePath="`pages/examples/BlitzForm/${eg}.vue`"
          style="width: 100%"
          :hideTitle="true"
        />
      </div>
    </div>
    <!-- api card section -->
    <div class="mb-xxxl">
      <ApiComponentExample
        id="api-easy-form"
        filePath="components/atoms/form/components/EasyForm.vue"
      />
    </div>
  </q-page>
</template>

<style lang="sass">
// .page-docs-blitz-form
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { ExampleSection, ApiComponentExample } from 'planetar'
import { spaceCase, pascalCase } from 'case-anything'
import { exampleOrderBlitzForm } from '../config/exampleOrder'

export default defineComponent({
  components: { ExampleSection, ApiComponentExample },
  props: {
    id: { type: String },
  },
  data() {
    return { exampleOrder: exampleOrderBlitzForm }
  },
  methods: { spaceCase, pascalCase },
})
</script>
