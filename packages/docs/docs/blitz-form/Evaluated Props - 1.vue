<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
const schema = [
  {
    id: 'color',
    span: true,
    component: 'select',
    label: 'What is your favorite color?',
    evaluatedProps: ['subLabel'],
    subLabel: (val) =>
      val === 'red'
        ? 'like the sun'
        : val === 'blue'
        ? 'like the sky'
        : val === 'green'
        ? 'green is not a creative color'
        : val === 'other'
        ? 'oh, come on, just pick one'
        : 'pick a color!',
    // component props:
    slot: [
      { component: 'option', value: '', slot: 'Select one', disabled: true },
      { component: 'option', value: 'red', slot: 'red' },
      { component: 'option', value: 'blue', slot: 'blue' },
      { component: 'option', value: 'green', slot: 'green' },
      { component: 'option', value: 'other', slot: 'other' },
    ],
    spread: true,
  },
]

export default {
  data() {
    return { schema, formData: {} }
  },
}
</script>
