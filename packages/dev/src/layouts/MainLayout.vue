<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round to="/" icon="home" v-if="$router.currentRoute.path !== '/'" />

        <q-toolbar-title>Blitzar ⚡️</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',

  data() {
    return {
      version: '0',
    }
  },
}
</script>
