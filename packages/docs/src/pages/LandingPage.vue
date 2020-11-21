<template>
  <q-page class="landing-page column items-center justify-evenly">
    <div>
      <div class="mb-xxxl column items-center">
        <q-img src="media/blitzar-logo-white.svg" style="width: 118px" />
        <h1 class="text-logo mt-md">Blitzar</h1>
      </div>
      <div class="pa-md q-gutter-xl flex">
        <RouteLink text="BlitzForm" to="/docs/blitz-form" />
        <RouteLink text="BlitzTable" to="/docs/blitz-table" />
        <RouteLink text="BlitzListForm" to="/docs/blitz-list-form" />
        <AnchorLink href="https://github.com/cycraft/blitzar/releases" text="Changelog" external />
        <AnchorLink href="https://github.com/cycraft/blitzar" text="Github" external />
      </div>
    </div>
  </q-page>
</template>

<style lang="sass">
// $
.landing-page
  +C(background, nasa)
</style>

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
