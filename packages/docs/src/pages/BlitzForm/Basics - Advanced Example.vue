<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="2" gridGap="32px" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped>
// $

// .component-name
</style>

<script>
import { BlitzForm } from 'blitzar'
import Vue from 'vue'

const schema = [
  {
    id: 'name',
    span: 1,
    component: 'input',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
    required: true,
  },
  {
    id: 'powerOrigin',
    span: 1,
    component: 'SimpleOptionGroup',
    type: 'radio',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    options: [
      { label: 'Mutation', value: 'mutation' },
      { label: 'Self taught', value: 'self' },
      { label: 'By item', value: 'item' },
    ],
  },
  {
    id: 'stamina',
    span: 2,
    component: 'input',
    type: 'range',
    label: 'Stamina',
    parseInput: Number,
    default: 50,
    min: 0,
    max: 100,
  },
  {
    id: 'power',
    span: 1,
    component: 'input',
    label: 'Power',
    subLabel: 'Fill in a number. (this will get formatted as a number in the formData)',
    parseInput: Number,
    type: 'number',
  },
  {
    id: 'roleModel',
    span: 1,
    component: 'select',
    label: 'Role model',
    subLabel: 'Who do you look up to?',
    slot: [
      { component: 'option', value: 'captain-america', slot: 'Steve Rogers/Captain America' },
      { component: 'option', value: 'iron-man', slot: 'Tony Stark/Iron Man' },
      { component: 'option', value: 'thor-odinson', slot: 'Thor Odinson' },
      { component: 'option', value: 'the-hulk', slot: 'Bruce Banner/The Hulk' },
      { component: 'option', value: 'black-widow', slot: 'Natasha Romanoff/Black Widow' },
      { component: 'option', value: 'hawkeye', slot: 'Clint Barton/Hawkeye' },
      { component: 'option', value: 'quicksilver', slot: 'Pietro Maximoff/Quicksilver' },
      { component: 'option', value: 'scarlet-witch', slot: 'Wanda Maximoff/Scarlet Witch' },
      { component: 'option', value: 'the-vision', slot: 'The Vision' },
      { component: 'option', value: 'war-machine', slot: 'James Rhodes/War Machine' },
      { component: 'option', value: 'falcon', slot: 'Sam Wilson/Falcon' },
      { component: 'option', value: 'the-winter-soldier', slot: 'Bucky Barnes/The Winter Soldier' },
      { component: 'option', value: 'black-panther', slot: "T'Challa/Black Panther" },
      { component: 'option', value: 'doctor-strange', slot: 'Stephen Strange/Doctor Strange' },
      { component: 'option', value: 'spider-man', slot: 'Peter Parker/Spider-Man' },
      { component: 'option', value: 'ant-man', slot: 'Scott Lang/Ant-Man (Giant-Man)' },
      { component: 'option', value: 'wasp', slot: 'Hope van Dyne/Wasp' },
      { component: 'option', value: 'captain-marvel', slot: 'Carol Danvers/Captain Marvel' },
      { component: 'option', value: 'star-lord', slot: 'Peter Quill/Star-Lord' },
      { component: 'option', value: 'gamora', slot: 'Gamora' },
      { component: 'option', value: 'drax-the-destroyer', slot: 'Drax the Destroyer' },
      { component: 'option', value: 'rocket-raccoon', slot: 'Rocket (Raccoon)' },
      { component: 'option', value: 'groot', slot: '(Baby, Teenage) Groot' },
      { component: 'option', value: 'mantis', slot: 'Mantis' },
      { component: 'option', value: 'daredevil', slot: 'Matthew Murdock/Daredevil' },
      { component: 'option', value: 'jessica-jones', slot: 'Jessica Jones (Jewel)' },
      { component: 'option', value: 'luke-cage', slot: 'Carl Lucas/Luke Cage (Power Man)' },
      { component: 'option', value: 'iron-fist', slot: 'Danny Rand/Iron Fist' },
      { component: 'option', value: 'the-punisher', slot: 'Frank Castle/The Punisher' },
    ],
  },
  {
    id: 'powerUps',
    span: 1,
    component: 'SimpleOptionGroup',
    type: 'checkbox',
    label: 'Choose some power-ups',
    default: () => [],
    options: [
      {
        label: 'ISO-8 Chrystal',
        value: 'iso-8',
      },
      {
        label: 'Health potion',
        value: 'hp-potion',
      },
      {
        label: 'Energy drink',
        value: 'energy-potion',
      },
    ],
  },
  { span: 1 },
  {
    id: 'consent',
    component: 'input',
    type: 'checkbox',
    span: 1,
    label: 'Do you agree with our terms?',
    rules: [(val) => val || 'You must accept our terms'],
    default: false,
  },
  {
    id: 'submissionDate',
    span: 1,
    component: 'input',
    type: 'date',
    label: 'Date of submission',
  },
]

Vue.component('SimpleOptionGroup', {
  props: { id: String, value: [String, Array], type: String, options: Array },
  render(h) {
    const name = JSON.stringify(this.options)
    const emitInput = (o) => {
      if (this.type === 'radio') return this.$emit('input', o.value)
      const newValue = this.value.includes(o.value)
        ? this.value.filter((v) => v !== o.value)
        : [...this.value, o.value]
      this.$emit('input', newValue)
    }
    return h(
      'div',
      this.options.map((o) => [
        h('label', { on: { input: () => emitInput(o) } }, [
          h('input', { domProps: { type: this.type, value: o.value, name } }),
          [` ${o.label}`, h('div')],
        ]),
      ])
    )
  },
})

/**
## Advanced Example

Here you can see an advanced form rendered all with HTML5 form elements.

If you look at the "script" you will see it's easy to use regular HTML5 elements. The only thing we had to write a quick custom component for, was the radio and checkbox groups.

In reality however, you will probably use Blitzar with your custom Vue components, so feel free to ignore my quick implementation of 'SimpleOptionGroup' in the script tab of this example:
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
