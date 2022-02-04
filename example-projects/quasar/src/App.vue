<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>

<template>
  <ul>
    <li><router-link to="/blitz-form">/blitz-form</router-link></li>
    <li><router-link to="/blitz-table">/blitz-table</router-link></li>
    <li><router-link to="/blitz-list-form">/blitz-list-form</router-link></li>
  </ul>
  <router-view />
</template>
