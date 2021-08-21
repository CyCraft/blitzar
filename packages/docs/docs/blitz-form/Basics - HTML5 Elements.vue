<template>
  <div>
    <BlitzForm :schema="schema" />
  </div>
</template>

<script>
const schema = [
  {
    component: 'h4',
    slot: 'You can use header tags in your forms (this is an <h4>)',
    style: 'color: black',
  },
  {
    component: 'a',
    href: 'https://google.com',
    slot: 'google.com (this is an <a> component)',
    style: 'font-weight: bold',
  },
  {
    label: `you can use an ol > with nested li`,
    component: 'ol',
    slot: [
      { component: 'li', slot: 'unos' },
      { component: 'li', slot: 'dos' },
      { component: 'li', slot: 'tres' },
    ],
  },
  {
    component: 'div',
    slot: `You can even use regular divs in your forms!\n\nI'm a div!`,
    style: 'border: dashed thin goldenrod; padding: 1em',
  },
  {
    label: 'Or nested divs!',
    component: 'div',
    // 'style' would be applied to the entire field
    // 'componentStyle' is applied to just the component
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
  {
    label: 'And images of course!',
    component: 'img',
    src: 'https://i.imgur.com/C87xx6T.jpeg',
  },
]

export default {
  data() {
    return { schema, formData: {} }
  },
}
</script>
