<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Pepicon } from 'vue-pepicons'
import BlitzSpinner from './BlitzSpinner.vue'

const kind = ['synced', 'error', 'loading'] as const
type Kind = typeof kind[number]

/**
 * Default colors are provided. Overwrite with CSS from the parent.
 */
export default defineComponent({
  name: 'BlitzIcon',
  components: { Pepicon, BlitzSpinner },
  props: {
    /**
     * The kind of the icon
     * e.g `synced, error, loading`
     */
    kind: { type: String as PropType<Kind>, required: true },
  },
  data() {
    return {}
  },
  computed: {
    name() {
      const { kind } = this
      if (kind === 'synced') return 'checkmark'
      if (kind === 'error') return 'exclamation'
      if (kind === 'loading') return 'minus'
      return 'question-mark'
    },
  },
  methods: {},
})
</script>

<template>
  <BlitzSpinner v-if="kind === 'loading'" :class="`blitz-icon _kind-loading`" size="18px" />

  <div v-else-if="kind === 'error'" :class="`blitz-icon _kind-error`">
    <svg style="color: inherit" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 2C11.1046 2 12 2.89543 12 4V11C12 12.1046 11.1046 13 10 13C8.89543 13 8 12.1046 8 11V4C8 2.89543 8.89543 2 10 2Z"
        fill="currentColor"
      />
      <path
        d="M12 16C12 17.1046 11.1046 18 10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16Z"
        fill="currentColor"
      />
    </svg>
  </div>

  <Pepicon v-else :class="`blitz-icon _kind-${kind}`" type="pop" :name="name" />
</template>

<style lang="sass" scoped>
.blitz-icon
  --c-primary: #0b3d92
  --c-accent-red: #F64D4D
  width: 18px
  height: 18px
  display: flex
  > *
    flex: 1
  &._kind-synced,
  &._kind-error
    color: white
    border-radius: 100%
    padding: 2px
  &._kind-synced
    background: var(--c-primary)
  &._kind-error
    background: var(--c-accent-red)
  &._kind-loading
    color: var(--c-primary)
</style>
