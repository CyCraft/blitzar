<template>
  <div>
    Mode:
    <select name="mode" id="mode" v-model="mode" class="q-mb-md">
      <option value="edit">edit</option>
      <option value="view">view</option>
      <option value="disabled">disabled</option>
      <option value="raw">raw</option>
      <option value="add">add</option>
    </select>
    <BlitzForm :schema="schema" v-model="formData" :mode="mode" :columnCount="2" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

import Vue from 'vue'

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
    component: 'select',
    slot: [
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
    ],
    // make field "disabled" when the mode is 'view':
    evaluatedProps: ['disabled'],
    disabled: (val, { mode }) => mode === 'view',
  },
  {
    id: 'stamina',
    component: 'input',
    type: 'range',
    label: 'Stamina',
    parseInput: Number,
    default: 50,
    min: 0,
    max: 100,
    // make field "disabled" when the mode is 'view':
    evaluatedProps: ['disabled'],
    disabled: (val, { mode }) => mode === 'view',
  },
  {
    id: 'consent',
    component: 'input',
    type: 'checkbox',
    label: 'Do you agree with our terms?',
    default: false,
    // make field "disabled" when the mode is 'view':
    evaluatedProps: ['disabled'],
    disabled: (val, { mode }) => mode === 'view',
  },
]

/**
## Disable fields on view mode

It's also possible you just use the "disabled" prop for fields that don't handle "readonly".

In this example below you can see how easy this is by using an evaluated prop for "disabled". (Read more on [evaluated props](#evaluated-props) down below)

However, in reality it's cleaner you just add the "readonly" prop to your Vue components, or if you use a component library, create a wrapper components for them.
 */
export default {
  components: { BlitzForm },
  data() {
    return {
      schema,
      mode: 'view',
      formData: {
        name: 'Johnny Silverhand',
        powerOrigin: 'self',
      },
    }
  },
}
</script>
