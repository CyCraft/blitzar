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
    logupdateField(eventPayload) {
      showToast('@updateField', eventPayload)
    },
    logFormInput(eventPayload, origin) {
      showToast('@update:modelValue', eventPayload, origin)
    },
  },
}
</script>

<template>
  <div>
    <BlitzForm
      :schema="schema"
      :columnCount="3"
      v-model="formData"
      @updateField="logupdateField"
      @update:modelValue="logFormInput"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
