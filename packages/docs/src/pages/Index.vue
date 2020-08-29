<template>
  <q-page class="column items-center justify-evenly">
    <div>
      <h1 class="mb-xxxl text-center">⚡️ Blitzar</h1>
      <div class="pa-md q-gutter-xl flex">
        <RouteLink content="BlitzForm" to="/docs/blitz-form" />
        <RouteLink content="BlitzTable" to="/docs/blitz-table" />
        <AnchorLink
          href="https://github.com/cycraft/blitzar/releases"
          content="Changelog"
          external
        />
        <AnchorLink href="https://github.com/cycraft/blitzar" content="Github" external />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import AnchorLink from 'components/AnchorLink.vue'
import RouteLink from 'components/RouteLink.vue'

export default defineComponent({
  name: 'PageIndex',
  components: { AnchorLink, RouteLink },
  setup() {
    return {}
  },
})
</script>
