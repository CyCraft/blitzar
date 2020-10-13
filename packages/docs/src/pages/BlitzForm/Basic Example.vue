<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

const schema = [
  {
    id: 'name',
    component: 'input',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
  },
  {
    id: 'powerOrigin',
    component: 'select',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    name: 'powerOrigin',
    slot: [
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
    ],
  },
]

/**
## Basic example

Check out the template; script; style below to see how simple the code looks to render this form:
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
