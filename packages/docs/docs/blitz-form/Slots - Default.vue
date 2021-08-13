<template>
  <div>
    <BlitzForm :schema="schema" />
  </div>
</template>

<script>
import { CodeBlock } from '@planetar/code-block'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'

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

export default {
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
}
</script>
