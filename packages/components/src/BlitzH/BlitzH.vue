<script lang="ts">
import { defineComponent, h, resolveDynamicComponent, PropType } from 'vue'
import { isArray, isString } from 'is-what'
import { omit } from 'filter-anything'
import { pascalCase } from 'case-anything'

type BlitzHOption = {
  component: string
  slot: any
  events?: Record<string, (...args: any[]) => any>
  class: string | Record<string, any> | (string | Record<string, any>)[]
  style: string | Record<string, any> | (string | Record<string, any>)[]
  [key: string]: any
}

/**
 * I'm still thinking about the best syntax for BlitzH
 */
const BlitzH = defineComponent({
  name: 'BlitzH',
  functional: true,
  props: {
    options: {
      type: [String, Object, Array] as PropType<string | BlitzHOption | (string | BlitzHOption)[]>,
      required: true,
    },
  },
  render() {
    const optionsArray: (string | BlitzHOption)[] = isArray(this.options)
      ? this.options
      : [this.options]

    // return the render function
    return optionsArray.map((o) => {
      if (isString(o)) return o
      const Component = resolveDynamicComponent(o.component) as any
      let children: any[]
      if (o.slot) {
        children = [h(BlitzH, { options: o.slot })]
      } else if (o.slots && o.slots.default) {
        children = [h(BlitzH, { options: o.slots.default })]
      }
      return h(
        Component,
        {
          ...omit(o, ['events', 'lang', 'rules', 'hint', 'readonly', 'component', 'slot', 'slots']),
          ...Object.entries(o.events || {}).reduce<{ [key in string]: any }>(
            (carry, [eventName, handler]) => {
              carry[`on${pascalCase(eventName)}`] = handler
              return carry
            },
            {}
          ),
        },
        {
          default() {
            return children
          },
        }
      )
    })
  },
})

export default BlitzH
</script>
