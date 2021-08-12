<template>
  <div>
    <BlitzForm :class="'text-white'" :schema="schema" v-model="formData" :columnCount="2" />

    <CodeBlock :content="parse(formData)" />
  </div>
</template>

<style lang="sass" scoped>
.text-white
  color: white
</style>

<script>
import { defineComponent } from 'vue'
import { CodeBlock } from '@planetar/code-block'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'
// import { BlitzForm } from '@blitzar/form'

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

/**
## Basic Example

Check out the template; script; style below to see how simple the code looks to render this form. The idea is that instead of a regular `input` you use your own Vue component like `MyInput`.
 */
export default defineComponent({
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
  methods: {
    parse(code) {
      return `// formData\n${JSON.stringify(code, undefined, 2)}`
    },
  },
})
</script>
