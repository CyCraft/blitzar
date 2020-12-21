<template>
  <v-app>
    <v-main style="padding: 1rem">
      <MyForm />
    </v-main>
  </v-app>
</template>

<style lang="sass">
// @import './styles/app.sass'
</style>

<script>
import MyForm from './components/MyForm'

export default {
  name: 'App',

  components: {
    MyForm,
  },

  data: () => ({
    //
  }),
}
</script>
