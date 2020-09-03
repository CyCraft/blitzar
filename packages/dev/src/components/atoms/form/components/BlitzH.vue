<template>
  <span v-if="typeof options === 'string'">{{ options }}</span>
  <span v-else>
    <component
      v-for="(o ,i) in optionsArray"
      :key="i"
      :is="o.component"
      v-bind="o"
      v-on="o.events"
      :class="o.class"
      :style="o.style"
    >
      <slot>
        <BlitzH v-if="o.slots && o.slots.default" :options="o.slots.default" />
      </slot>
    </component>
  </span>
</template>

<script>
import { isArray } from 'is-what'
/**
 * BlitzH is not yet exposed, because I'm still thinking about the best syntax for everything
 */
export default {
  name: 'BlitzH',
  props: {
    options: { type: [Object, Array, String] },
  },
  data() {
    const optionsArray = isArray(this.options) ? this.options : [this.options]
    return { optionsArray }
  },
}
</script>
