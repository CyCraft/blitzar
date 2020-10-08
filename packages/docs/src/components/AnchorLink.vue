<template>
  <a
    :class="['anchor-link', external ? '_external' : '']"
    :href="href"
    :target="external ? '_blank' : ''"
    :rel="external ? 'noopener noreferrer' : ''"
    v-on="$listeners"
  >
    <slot>{{ content }}</slot>
    <svg
      v-if="external"
      class="_svg q-ml-sm"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      width="15"
      height="15"
    >
      <path
        fill="currentColor"
        d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
      />
      <polygon
        fill="currentColor"
        points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
      />
    </svg>
  </a>
</template>

<style lang="sass">
.anchor-link
  color: #fbcc5a
  font-weight: 500
  text-decoration: none
  display: flex
  align-items: center
  &._external
    color: black
    font-weight: 600
  &:hover,
  &.is-active
    color: #fbcc5a !important
  ._svg
    color: #aaa
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AnchorLink',
  props: {
    content: { type: String, required: true },
    href: { type: String },
    external: { type: Boolean, default: false },
  },
})
</script>
