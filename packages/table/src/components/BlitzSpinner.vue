<script lang="ts">
import { defineComponent } from 'vue'

const sizeDict = { xs: 18, sm: 24, md: 32, lg: 38, xl: 46 }
type SizeDict = keyof typeof sizeDict

/**
 * Color of the spinner can be applied via CSS.
 */
export default defineComponent({
  name: 'BlitzSpinner',
  props: {
    /**
     * The size of the spinner
     * controls the width and height
     * e.g `xs, sm, md, lg, xl, 16, 24 etc`
     */
    size: { type: [Number, String], default: '1em' },
    thickness: { type: Number, default: 5 },
  },
  computed: {
    cSize() {
      const { size } = this
      return size in sizeDict ? `${sizeDict[size as SizeDict]}px` : size
    },
  },
})
</script>

<template>
  <svg class="blitz-spinner" :width="cSize" :height="cSize" viewBox="25 25 50 50">
    <circle
      class="path"
      cx="50"
      cy="50"
      r="20"
      fill="none"
      stroke="currentColor"
      :stroke-width="thickness"
      stroke-miterlimit="10"
    />
  </svg>
</template>

<style lang="sass" scoped>
.blitz-spinner
  animation: c-spin 2s linear infinite
  transform-origin: center center
  .path
    stroke-dasharray: 1, 200
    stroke-dashoffset: 0
    animation: c-mat-dash 1.5s ease-in-out infinite

@keyframes c-spin
  0%
    transform: rotate3d(0, 0, 1, 0deg)
  25%
    transform: rotate3d(0, 0, 1, 90deg)
  50%
    transform: rotate3d(0, 0, 1, 180deg)
  75%
    transform: rotate3d(0, 0, 1, 270deg)
  100%
    transform: rotate3d(0, 0, 1, 359deg)

@keyframes c-mat-dash
  0%
    stroke-dasharray: 1, 200
    stroke-dashoffset: 0
  50%
    stroke-dasharray: 89, 200
    stroke-dashoffset: -35px
  100%
    stroke-dasharray: 89, 200
    stroke-dashoffset: -124px
</style>
