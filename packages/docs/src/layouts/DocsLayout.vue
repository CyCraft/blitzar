<template>
  <q-layout view="HHH Lpr fff" class="docs-layout">
    <q-header style="padding: 0.7rem 1.5rem" class="_layout-header row items-center">
      <q-btn
        class="xs"
        dense
        icon="menu"
        color="white"
        flat
        @click="() => (leftDrawerOpen = !leftDrawerOpen)"
      />
      <div class="text-h6 cursor-pointer flex items-center" @click="$router.push('/')">
        <q-img src="media/blitzar-logo-white.svg" style="width: 20px" class="mr-xs gt-xs" />
        <div class="ml-lg">{{ $route.name }} Docs</div>
      </div>
      <div class="ml-auto flex q-gutter-md">
        <DropdownLink text="Components" class="px-sm gt-xs">
          <template slot="menu">
            <div class="q-gutter-md">
              <RouteLink text="BlitzForm" to="/docs/blitz-form" class="_link" />
              <RouteLink text="BlitzTable" to="/docs/blitz-table" class="_link" />
              <RouteLink text="BlitzListForm" to="/docs/blitz-list-form" class="_link" />
            </div>
          </template>
        </DropdownLink>
        <AnchorLink href="https://github.com/cycraft/blitzar/releases" text="Changelog" external />
        <AnchorLink href="https://github.com/cycraft/blitzar" text="Github" external />
      </div>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="260"
      :breakpoint="599"
      content-class="_layout-side"
      dark
    >
      <div class="_toc-top xs">
        <div class="text-h6 pb-md">Components</div>
        <div class="pl-md q-gutter-md">
          <RouteLink text="BlitzForm" to="/docs/blitz-form" class="_link" />
          <RouteLink text="BlitzTable" to="/docs/blitz-table" class="_link" />
          <RouteLink text="BlitzListForm" to="/docs/blitz-list-form" class="_link" />
        </div>
      </div>
      <TableOfContents :TOC="TOC" />
    </q-drawer>

    <q-page-container>
      <router-view @set-toc="setTOC" :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
// $
.docs-layout
  ._layout-header
    +C(background, nasa)
    color: white
    border-bottom: thin solid white
  .q-drawer
    +C(background, nasa)
  ._toc-top
    +px($lg)
    +py($md)
    border-bottom: thin solid white
    ._link
      font-weight: 400
</style>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { TableOfContents } from 'planetar'
import AnchorLink from '../components/AnchorLink.vue'
import DropdownLink from '../components/DropdownLink.vue'
import RouteLink from '../components/RouteLink.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { AnchorLink, DropdownLink, TableOfContents, RouteLink },
  setup() {
    const leftDrawerOpen = ref(true)

    const TOC: Ref<any[]> = ref([])
    function setTOC(newTOC: any[]) {
      TOC.value.splice(0, TOC.value.length, ...newTOC)
    }

    return { leftDrawerOpen, setTOC, TOC }
  },
})
</script>
