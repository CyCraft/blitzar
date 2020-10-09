<template>
  <q-layout view="HHH Lpr fff">
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
