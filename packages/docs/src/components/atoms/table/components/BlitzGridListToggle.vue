<template>
  <div class="blitz-grid-list-toggle" @click="$emit('input', !value)">
    <!-- grid icon -->
    <svg
      v-if="!value"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-grid"
    >
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
    <!-- list icon -->
    <svg
      v-if="value"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-list"
    >
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  </div>
</template>

<style lang="sass" scoped>
.blitz-grid-list-toggle
  display: flex
  color: black // fallback
  color: var(--q-color-primary, black)
  cursor: pointer
</style>

<script>
export default {
  name: 'BlitzGridListToggle',
  props: {
    /**
     * `value: true` represents "grid mode" so shows a "list icon"
     * `value: false` represents "list mode" so shows a "grid icon"
     */
    value: Boolean,
  },
  computed: {},
  methods: {},
}
</script>
