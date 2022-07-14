<script setup lang="ts">
import { defineComponent, defineProps, PropType } from 'vue'
import { Pepicon } from '@pepicons/vue'
import BlitzSpinner from '../BlitzSpinner/BlitzSpinner.vue'

type Kind = 'synced' | 'error' | 'loading'

defineComponent({ name: 'BlitzIcon' })
/**
 * Default colors are provided. Overwrite with CSS from the parent.
 */
defineProps({
  /**
   * The kind of the icon
   * e.g `synced, error, loading`
   */
  kind: {
    type: String as PropType<Kind>,
    required: true,
  },
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

  <Pepicon v-else :class="`blitz-icon _kind-${kind}`" type="pop" :name="'checkmark'" />
</template>

<style scoped>
.blitz-icon,
.blitz-icon * {
  box-sizing: border-box;
}

.blitz-icon {
  --c-primary: #0b3d92;
  --c-accent-red: #f64d4d;
  width: 18px;
  height: 18px;
  display: flex;
}
.blitz-icon > * {
  flex: 1;
}
.blitz-icon._kind-synced,
.blitz-icon._kind-error {
  color: white;
  border-radius: 100%;
  padding: 2px;
}
.blitz-icon._kind-synced {
  background: var(--c-primary);
}
.blitz-icon._kind-error {
  background: var(--c-accent-red);
}
.blitz-icon._kind-loading {
  color: var(--c-primary);
}
</style>
