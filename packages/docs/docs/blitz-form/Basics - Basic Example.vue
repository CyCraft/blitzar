<template>
  <div>
    <BlitzForm :class="'text-white'" :schema="schema" v-model="formData" :columnCount="2" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<style scoped>
.text-white {
  color: white;
}
</style>

<script>
import { CodeBlock } from '@planetar/code-block'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'

const schema = [
  {
    id: 'name',
    component: 'input',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
  },
  {
    id: 'powerOrigin',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    component: 'select',
    slot: [
      { component: 'option', value: '', slot: '' },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
  },
]

export default {
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
}
</script>
