<template>
  <q-layout view="HHH Lpr fff">
    <q-header style="background: white; padding: 0.7rem 1.5rem" bordered class="row items-center">
      <q-btn
        class="xs"
        dense
        icon="menu"
        color="black"
        flat
        @click="() => (leftDrawerOpen = !leftDrawerOpen)"
      />
      <div class="q-ml-md text-h6 text-black">Blitzar ⚡️</div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import AnchorLink from 'components/AnchorLink.vue'
import RouteLink from 'components/RouteLink.vue'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MainLayout',
  components: { AnchorLink, RouteLink },
  setup() {
    return {}
  },
})
</script>
