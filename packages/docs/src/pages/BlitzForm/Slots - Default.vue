<template>
  <div>
    <BlitzForm :schema="schema" />
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

const schema = [
  {
    component: 'h6',
    slot: 'You can use header tags in your forms (<h6> component)',
    componentStyle: 'color: black',
  },
  {
    component: 'a',
    href: 'https://google.com',
    slot: 'google.com (<a> component)',
    componentStyle: 'color: blue',
  },
  {
    label: `nested ol > li components`,
    component: 'ol',
    slot: [
      { component: 'li', slot: 'unos' },
      { component: 'li', slot: 'dos' },
      { component: 'li', slot: 'tres' },
    ],
  },
  {
    label: 'You can even use regular divs in your forms',
    component: 'div',
    slot: 'I am a div',
    componentStyle: 'border: dashed thin goldenrod; padding: 2em',
  },
  {
    label: 'a div in a div in a div',
    component: 'div',
    componentStyle: 'border: dashed thin slateblue; padding: 1em',
    slot: {
      component: 'div',
      style: 'border: dashed thin coral; padding: 1em',
      slot: {
        component: 'div',
        style: 'border: dashed thin olivedrab; padding: 1em',
        slot: 'nested div',
      },
    },
  },
]

/**
## default slot

You can use the prop called "slot" to pass content to a default slot.

This means that in between your fields in a schema, you could include just regular HTML elements / Vue components that need to use the default slot.

In the example below we first show how you can use the "default" slot to render basic HTML elements that require content in the default slot.
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
