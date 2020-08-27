<template>
  <router-link :class="['route-link']" :to="to" v-on="$listeners">
    <slot>{{ content }}</slot>
  </router-link>
</template>

<style lang="sass">
.route-link
  color: black
  font-weight: 500
  text-decoration: none
  display: flex
  align-items: center
  &:hover
    color: #fbcc5a
  &.is-active
    color: #fbcc5a
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AnchorLink',
  props: {
    content: { type: String, required: true },
    to: { type: String, required: true },
  },
})
</script>
