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
    label: 'a div component example (see script tab)',
    component: 'div',
    slots: { default: 'I am a div' },
    componentStyle: 'border: dashed thin goldenrod; padding: 2em',
  },
  {
    label: 'an H6 example',
    component: 'h6',
    slots: { default: 'I am an h6' },
  },
  {
    label: `nested ol > li components`,
    component: 'ol',
    slots: {
      default: [
        { component: 'li', slots: { default: 'unos' } },
        { component: 'li', slots: { default: 'dos' } },
        { component: 'li', slots: { default: 'tres' } },
      ],
    },
  },
  {
    label: 'a div in a div in a div',
    component: 'div',
    componentStyle: 'border: dashed thin slateblue; padding: 1em',
    slots: {
      default: {
        component: 'div',
        style: 'border: dashed thin coral; padding: 1em',
        slots: {
          default: {
            component: 'div',
            style: 'border: dashed thin olivedrab; padding: 1em',
            slots: {
              default: 'nested div',
            },
          },
        },
      },
    },
  },
]

/**
Any field in a BlitzForm schema can also accept slots!

Currently there are two supported "slots" per field:
- default
- label

> PLEASE NOTE, this feature is still experimental and is prone to change while we are in beta!!

## default slot

In the example below we first show how you can use the "default" slot to render basic HTML elements that require content in the default slot.

This means that in between your fields in a schema, you can include just regular input
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
