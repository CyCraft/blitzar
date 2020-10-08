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
      <div class="q-ml-md text-h6 text-black cursor-pointer" @click="$router.push('/')">
        Blitzar ⚡️
      </div>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="260" :breakpoint="600">
      <div class="q-pa-md q-gutter-md" style="border: thin solid #eee">
        <AnchorLink
          href="https://github.com/cycraft/blitzar/releases"
          content="Changelog"
          external
        />
        <AnchorLink href="https://github.com/cycraft/blitzar" content="Github" external />
      </div>
      <TableOfContents :TOC="TOC" />
    </q-drawer>

    <q-page-container>
      <router-view @set-toc="setTOC" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from '@vue/composition-api'
import Vue from 'vue'
import { spaceCase, pascalCase } from 'case-anything'
import { TableOfContents } from 'planetar'
import AnchorLink from 'components/AnchorLink.vue'
import { routeNamePageChaptersMap } from '../config/pageChapters'
import { ROUTE_NAMES } from '../router/routes'

export default defineComponent({
  name: 'MainLayout',
  components: { AnchorLink, TableOfContents },
  setup(props, options) {
    const leftDrawerOpen = ref(true)

    const routeName = options.root.$route.name as ROUTE_NAMES
    const pageChapters = computed(() => routeNamePageChaptersMap[routeName])

    const TOC: Ref<any[]> = ref([])
    function setTOC(newTOC: any[]) {
      TOC.value.splice(0, TOC.value.length, ...newTOC)
    }

    return { leftDrawerOpen, routeName, pageChapters, spaceCase, pascalCase, setTOC, TOC }
  },
})
</script>
