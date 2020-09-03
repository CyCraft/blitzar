<template>
  <div>
    <BlitzForm :schema="schema" />
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

const schema = [
  {
    id: 'input',
    label: 'Type something',
    component: 'input',
  },
  {
    label: 'a div component example (see script tab)',
    component: 'div',
    slots: (val, { formData }) => ({ default: formData.input }),
    evaluatedProps: ['slots'],
    componentStyle: 'border: dashed thin goldenrod; padding: 2em',
  },
]

/**
## Evaluated slots
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
