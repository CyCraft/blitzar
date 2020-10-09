<template>
  <q-layout view="HHH Lpr fff">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    return {}
  },
})
</script>
