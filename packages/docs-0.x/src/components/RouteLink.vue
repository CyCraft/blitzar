<template>
  <router-link :class="['route-link']" :to="to" v-on="$listeners">
    <slot>{{ text }}</slot>
  </router-link>
</template>

<style lang="sass">
// $
.route-link
  color: white
  font-weight: 500
  text-decoration: none
  display: flex
  align-items: center
  cursor: pointer
  &:hover
    +C(color, primary)
  &.is-active
    +C(color, primary)
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'RouteLink',
  props: {
    text: { type: String, required: true },
    to: { type: String, required: true },
  },
})
</script>
