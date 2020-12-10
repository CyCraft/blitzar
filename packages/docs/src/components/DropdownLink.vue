<template>
  <div :class="['route-link']" v-on="$listeners">
    <QMenu :autoClose="true" content-class="bg-nasa pa-md border-white">
      <slot name="menu"></slot>
    </QMenu>
    <div class="_text">
      <slot>{{ text }}</slot
      ><span class="_arrow ml-sm"></span>
    </div>
  </div>
</template>

<style lang="sass">
// $
.border-white
  border: thin solid white
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
  ._text
    display: flex
    align-items: center
  ._arrow
    display: inline-block
    vertical-align: middle
    width: 0
    height: 0
    border-left: 4px solid transparent
    border-right: 4px solid transparent
    border-top: 5px solid #aaa
</style>

<script lang="ts">
import { QMenu } from 'quasar'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  components: { QMenu },
  name: 'DropdownLink',
  props: {
    text: { type: String, required: true },
  },
})
</script>
