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
    id: 'input',
    label: 'Type something',
    component: 'input',
  },
  {
    label: 'a div showing the same content as the input',
    component: 'div',
    slot: (val, { formData }) => formData.input,
    evaluatedProps: ['slot'],
    componentStyle: 'border: dashed thin goldenrod; padding: 2em',
  },
]

/**
## Evaluated Slots
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
