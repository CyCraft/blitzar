<script>
import { defineComponent, ref } from 'vue'
import { BlitzForm } from 'blitzar'
import 'blitzar/dist/style.css'

// Make sure QInput, QToggle, etc. are globally registered via `quasar.conf.js`!

const schema = [
  {
    id: 'name',
    span: 1,
    component: 'QInput', // make sure it's registered in `quasar.conf.js`
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
    required: true,
  },
  {
    id: 'powerOrigin',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    component: 'QSelect', // make sure it's registered in `quasar.conf.js`
    options: [
      { value: '', label: 'Select one', disabled: true },
      { value: 'mutation', label: 'Mutation' },
      { value: 'self', label: 'Self taught' },
      { value: 'item', label: 'Magic item' },
      { value: 'gear', label: 'Gear' },
    ],
  },
  {
    id: 'stamina',
    span: 2,
    component: 'QSlider', // make sure it's registered in `quasar.conf.js`
    label: 'Stamina',
    subLabel: (value) => `value: ${value}`,
    dynamicProps: ['subLabel'],
    parseInput: (val) => Number(val),
    defaultValue: 50,
    min: 0,
    max: 100,
  },
  {
    id: 'power',
    span: 1,
    component: 'QInput', // make sure it's registered in `quasar.conf.js`
    label: 'Power',
    subLabel: 'Fill in a number. (this will get formatted as a number in the formData)',
    parseInput: (val) => Number(val),
    type: 'number',
  },
  {
    id: 'roleModel',
    span: 1,
    component: 'QSelect', // make sure it's registered in `quasar.conf.js`
    label: 'Role model',
    subLabel: 'Who do you look up to?',
    options: [
      { value: '', label: 'Select one', disabled: true },
      { value: 'captain-america', label: 'Steve Rogers/Captain America' },
      { value: 'iron-man', label: 'Tony Stark/Iron Man' },
      { value: 'thor-odinson', label: 'Thor Odinson' },
      { value: 'the-hulk', label: 'Bruce Banner/The Hulk' },
      { value: 'black-widow', label: 'Natasha Romanoff/Black Widow' },
      { value: 'hawkeye', label: 'Clint Barton/Hawkeye' },
      { value: 'quicksilver', label: 'Pietro Maximoff/Quicksilver' },
      { value: 'scarlet-witch', label: 'Wanda Maximoff/Scarlet Witch' },
      { value: 'the-vision', label: 'The Vision' },
      { value: 'war-machine', label: 'James Rhodes/War Machine' },
      { value: 'falcon', label: 'Sam Wilson/Falcon' },
      { value: 'the-winter-soldier', label: 'Bucky Barnes/The Winter Soldier' },
      { value: 'black-panther', slot: "T'Challa/Black Panther" },
      { value: 'doctor-strange', label: 'Stephen Strange/Doctor Strange' },
      { value: 'spider-man', label: 'Peter Parker/Spider-Man' },
      { value: 'ant-man', label: 'Scott Lang/Ant-Man (Giant-Man)' },
      { value: 'wasp', label: 'Hope van Dyne/Wasp' },
      { value: 'captain-marvel', label: 'Carol Danvers/Captain Marvel' },
      { value: 'star-lord', label: 'Peter Quill/Star-Lord' },
      { value: 'gamora', label: 'Gamora' },
      { value: 'drax-the-destroyer', label: 'Drax the Destroyer' },
      { value: 'rocket-raccoon', label: 'Rocket (Raccoon)' },
      { value: 'groot', label: '(Baby, Teenage) Groot' },
      { value: 'mantis', label: 'Mantis' },
      { value: 'daredevil', label: 'Matthew Murdock/Daredevil' },
      { value: 'jessica-jones', label: 'Jessica Jones (Jewel)' },
      { value: 'luke-cage', label: 'Carl Lucas/Luke Cage (Power Man)' },
      { value: 'iron-fist', label: 'Danny Rand/Iron Fist' },
      { value: 'the-punisher', label: 'Frank Castle/The Punisher' },
    ],
  },
  {
    id: 'powerUps',
    span: 1,
    component: 'QOptionGroup', // make sure it's registered in `quasar.conf.js`
    type: 'checkbox',
    defaultValue: () => [],
    label: 'Choose some power-ups',
    columnCount: 3,
    options: [
      { value: 'iso-8', label: 'Magic crystal' },
      { value: 'hp-potion', label: 'Health potion' },
      { value: 'energy-potion', label: 'Energy drink' },
    ],
  },
  { span: 1 },
  {
    id: 'consent',
    component: 'QToggle', // make sure it's registered in `quasar.conf.js`
    span: 1,
    label: 'Do you agree with our terms?',
    rules: [(val) => val || 'You must accept our terms'],
    defaultValue: false,
  },
  {
    id: 'submissionDate',
    span: 1,
    component: 'QInput', // make sure it's registered in `quasar.conf.js`
    type: 'date',
    label: 'Date of submission',
  },
]

export default defineComponent({
  components: { BlitzForm },
  setup() {
    const formData = ref({})
    return { formData, schema }
  },
})
</script>

<template>
  <div class="col flex-center q-pa-xl">
    <BlitzForm
      v-model="formData"
      :schema="schema"
      :columnCount="2"
      :internalLabels="true"
      gridGap="2rem"
    />

    <div class="q-mt-md bg-black text-white q-pa-md">
      <pre><code>{{`// formData\n${JSON.stringify(formData, undefined, 2)}`}}</code></pre>
    </div>
  </div>
</template>
