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

export default {
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
}
</script>
