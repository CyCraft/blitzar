<template>
  <div>
    Mode:
    <select name="mode" id="mode" v-model="mode" class="q-mb-md">
      <option value="edit">edit</option>
      <option value="view">view</option>
      <option value="disabled">disabled</option>
      <option value="raw">raw</option>
    </select>
    <BlitzForm :schema="schema" v-model="formData" :mode="mode" :columnCount="2" />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
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
    // make field "disabled" when the mode is 'view':
    dynamicProps: ['disabled'],
    disabled: (val, { mode }) => ['view', 'disabled'].includes(mode),
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
    // make field "disabled" when the mode is 'view':
    dynamicProps: ['disabled'],
    disabled: (val, { mode }) => ['view', 'disabled'].includes(mode),
  },
  {
    id: 'consent',
    component: 'input',
    type: 'checkbox',
    label: 'Do you agree with our terms?',
    defaultValue: false,
    // make field "disabled" when the mode is 'view':
    dynamicProps: ['disabled'],
    disabled: (val, { mode }) => ['view', 'disabled'].includes(mode),
  },
]

export default {
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
