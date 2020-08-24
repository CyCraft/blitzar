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
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="260" :breakpoint="600">
      <div class="q-pa-md q-gutter-md" style="border: thin solid #eee">
        <AnchorLink href="https://github.com/mesqueeb/blitzar" content="Changelog" external />
        <AnchorLink href="https://github.com/mesqueeb/blitzar" content="Github" external />
      </div>
      <router-link v-for="link in pageNames" :key="link" :to="link">{{link}}</router-link>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import AnchorLink from 'components/AnchorLink.vue'

// @ts-ignore
const links = require.context('../pages/content').keys()
const pageNames = [...new Set(links.map((l) => l.replace('./', '').replace('.vue', '')))]
console.log(`links → `, links)
console.log(`pageNames → `, pageNames)

import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink, AnchorLink },
  setup() {
    const leftDrawerOpen = ref(true)

    return { leftDrawerOpen, pageNames }
  },
})
</script>
