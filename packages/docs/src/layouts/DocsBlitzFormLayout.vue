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
        <AnchorLink
          href="https://github.com/mesqueeb/blitzar/releases"
          content="Changelog"
          external
        />
        <AnchorLink href="https://github.com/mesqueeb/blitzar" content="Github" external />
      </div>
      <scrollactive class="q-pa-md column q-gutter-md" :offset="80">
        <AnchorLink
          v-for="eg in exampleOrder"
          :key="eg"
          :content="spaceCase(pascalCase(eg))"
          :href="`#${eg}`"
          class="text-black scrollactive-item"
        />
        <AnchorLink
          key="api"
          content="Api EasyForm"
          href="#api-easy-form"
          class="text-black scrollactive-item"
        />
      </scrollactive>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import AnchorLink from 'components/AnchorLink.vue'
import { defineComponent, ref } from '@vue/composition-api'
import { spaceCase, pascalCase } from 'case-anything'
import { exampleOrderBlitzForm } from '../config/exampleOrder'
import Vue from 'vue'
import VueScrollactive from 'vue-scrollactive'

Vue.use(VueScrollactive)

export default defineComponent({
  name: 'MainLayout',
  components: { AnchorLink },
  setup() {
    const leftDrawerOpen = ref(true)

    return { leftDrawerOpen, exampleOrder: exampleOrderBlitzForm }
  },
  methods: {
    spaceCase,
    pascalCase,
  },
})
</script>
