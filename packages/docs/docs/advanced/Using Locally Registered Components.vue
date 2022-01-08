<script>
import { markRaw } from 'vue'
import BaseInput from '../../components/BaseInput.vue'

const schema = [
  {
    id: 'name',
    component: markRaw(BaseInput),
    label: 'Nickname',
    // component props:
    icon: 'person',
  },
  {
    id: 'height',
    component: markRaw(BaseInput),
    label: 'Height',
    // component props:
    suffix: 'cm',
    type: 'number',
  },
  {
    id: 'description',
    component: markRaw(BaseInput),
    label: 'Write something about yourself',
    span: 2,
    // component props:
    type: 'textarea',
    autogrow: true,
    icon: 'identification',
    clearable: true,
  },
]

export default {
  data() {
    return { schema, formData: {} }
  },
}
</script>

<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="2" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
