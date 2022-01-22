<script setup>
import { ref } from 'vue'
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
      { component: 'option', value: '', slot: 'Select one', disabled: true },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
  },
  {
    id: 'stamina',
    component: 'input',
    type: 'range',
    label: 'Stamina',
    parseInput: (val) => Number(val),
    defaultValue: 50,
    min: 0,
    max: 100,
  },
  {
    id: 'consent',
    component: 'input',
    type: 'checkbox',
    label: 'Do you agree with our terms?',
    defaultValue: false,
  },
]

const mode = ref('readonly')
const formData = ref({
  name: 'Johnny Silverhand',
  powerOrigin: 'self',
})
</script>

<template>
  <div>
    mode:
    <select id="mode" v-model="mode" name="mode" style="margin-bottom: 1rem">
      <option value="edit">edit</option>
      <option value="readonly">readonly</option>
      <option value="disabled">disabled</option>
      <option value="raw">raw</option>
    </select>

    <BlitzForm v-model="formData" :schema="schema" :mode="mode" :columnCount="2" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
