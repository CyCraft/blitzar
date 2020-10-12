<script>
import { isArray, isString } from 'is-what'

/**
 * I'm still thinking about the best syntax for BlitzH
 */
export default {
  name: 'BlitzH',
  functional: true,
  props: {
    /**
     * @type {{ [key: string]: any, events: {}, slot: any, class: string | Record<string, any> | (string | Record<string, any>)[], style: string | Record<string, any> | (string | Record<string, any>)[] }}
     */
    options: { type: [Object, Array, String] },
  },
  render(h, ctx) {
    const optionsArray = isArray(ctx.props.options) ? ctx.props.options : [ctx.props.options]
    return optionsArray.map((o) => {
      if (isString(o)) return ctx._v(o)
      let children
      if (o.slot) {
        children = [h('BlitzH', { props: { options: o.slot } })]
      } else if (o.slots && o.slots.default) {
        children = [h('BlitzH', { props: { options: o.slots.default } })]
      }
      return h(
        o.component,
        {
          props: o,
          on: o.events,
          class: o.class,
          style: o.style,
        },
        children
      )
    })
  },
}
</script>
