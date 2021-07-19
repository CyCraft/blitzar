<script>
import { isArray, isPlainObject, isString } from 'is-what'
import { omit } from 'filter-anything'

/**
 * @typedef BlitzHOption
 * @type {{
  component: string,
  slot: any,
  events: {},
  class: string | Record<string, any> | (string | Record<string, any>)[],
  style: string | Record<string, any> | (string | Record<string, any>)[],
  [key: string]: any,
}}
 */

/**
 * I'm still thinking about the best syntax for BlitzH
 */
export default {
  name: 'BlitzH',
  functional: true,
  props: {
    /**
     * @type {string | BlitzHOption | BlitzHOption[]}
     */
    options: { type: [String, Object, Array] },
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
          attrs: omit(o, [
            'lang',
            'rules',
            'label',
            'hint',
            'readonly',
            'component',
            'slots',
            'class',
            'style',
            'events',
          ]),
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
