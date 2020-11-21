<template>
  <div :class="['route-link']" v-on="$listeners">
    <slot>{{ text }}</slot>
  </div>
</template>

<style lang="sass">
// $
.route-link
  color: white
  font-weight: 500
  text-decoration: none
  display: flex
  align-items: center
  &:hover
    +C(color, primary)
  &.is-active
    +C(color, primary)
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'DropdownLink',
  props: {
    text: { type: String, required: true },
  },
})
</script>
