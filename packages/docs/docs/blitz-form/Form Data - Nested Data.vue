<template>
  <div>
    <BlitzForm
      :schema="schema"
      :columnCount="3"
      v-model="formData"
      @field-input="logFieldInput"
      @input="logFormInput"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
import { showToast } from '../../components/toasts'

const schema = [
  {
    id: 'size.width',
    label: 'Width',
    component: 'input',
    parseInput: (val) => Number(val),
    // component props:
    type: 'number',
  },
  {
    id: 'size.depth',
    label: 'Depth',
    component: 'input',
    parseInput: (val) => Number(val),
    // component props:
    type: 'number',
  },
  {
    id: 'size.height',
    label: 'Height',
    component: 'input',
    parseInput: (val) => Number(val),
    // component props:
    type: 'number',
  },
]

export default {
  data() {
    return { schema, formData: {} }
  },
  methods: {
    logFieldInput(eventPayload) {
      showToast('@field-input', eventPayload)
    },
    logFormInput(eventPayload, origin) {
      showToast('@input', eventPayload, origin)
    },
  },
}
</script>
