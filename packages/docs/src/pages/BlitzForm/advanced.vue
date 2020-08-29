<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="2" gridGap="32px" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped>
// $

// .component-name
</style>

<script>
import { BlitzForm } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput, QBtnToggle, QSlider, QSelect, QOptionGroup, QToggle, date } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)
Vue.component('QBtnToggle', QBtnToggle)
Vue.component('QSlider', QSlider)
Vue.component('QSelect', QSelect)
Vue.component('QOptionGroup', QOptionGroup)
Vue.component('QToggle', QToggle)

const schema = [
  {
    id: 'name',
    span: 1,
    component: 'QInput',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
    required: true,
  },
  {
    id: 'powerOrigin',
    span: 1,
    component: 'QBtnToggle',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    spread: true,
    options: [
      { label: 'Mutation', value: 'mutation' },
      { label: 'Self taught', value: 'self' },
      { label: 'By item', value: 'item' },
    ],
  },
  {
    id: 'stamina',
    span: 2,
    component: 'QSlider',
    label: 'Stamina',
    default: 50,
    // component props:
    min: 0,
    max: 100,
    labelAlways: true,
  },
  {
    id: 'power',
    span: 1,
    component: 'QInput',
    label: 'Power',
    subLabel: 'Fill in a number. (this will get formatted as a number in the formData)',
    parseInput: Number,
    // component props:
    type: 'number',
    suffix: 'PW',
  },
  {
    id: 'roleModel',
    span: 1,
    component: 'QSelect',
    label: 'Role model',
    subLabel: 'Who do you look up to?',
    // component props:
    options: [
      { label: 'Steve Rogers/Captain America', value: 'captain-america' },
      { label: 'Tony Stark/Iron Man', value: 'iron-man' },
      { label: 'Thor Odinson', value: 'thor-odinson' },
      { label: 'Bruce Banner/The Incredible Hulk', value: 'the-incredible-hulk' },
      { label: 'Natasha Romanoff/Black Widow', value: 'black-widow' },
      { label: 'Clint Barton/Hawkeye', value: 'hawkeye' },
      { label: 'Pietro Maximoff/Quicksilver', value: 'quicksilver' },
      { label: 'Wanda Maximoff/Scarlet Witch', value: 'scarlet-witch' },
      { label: 'The Vision', value: 'the-vision' },
      { label: 'James Rhodes/War Machine (Iron Patriot)', value: 'war-machine' },
      { label: 'Sam Wilson/Falcon', value: 'falcon' },
      { label: 'Bucky Barnes/The Winter Soldier (White Wolf)', value: 'the-winter-soldier' },
      { label: "T'Challa/Black Panther", value: 'black-panther' },
      { label: 'Stephen Strange/Doctor Strange', value: 'doctor-strange' },
      { label: 'Peter Parker/Spider-Man', value: 'spider-man' },
      { label: 'Scott Lang/Ant-Man (Giant-Man)', value: 'ant-man' },
      { label: 'Hope van Dyne/Wasp', value: 'wasp' },
      { label: 'Carol Danvers/Captain Marvel', value: 'captain-marvel' },
      { label: 'Peter Quill/Star-Lord', value: 'star-lord' },
      { label: 'Gamora', value: 'gamora' },
      { label: 'Drax the Destroyer', value: 'drax-the-destroyer' },
      { label: 'Rocket (Raccoon)', value: 'rocket-raccoon' },
      { label: '(Baby, Teenage) Groot', value: 'groot' },
      { label: 'Mantis', value: 'mantis' },
      { label: 'Matthew Murdock/Daredevil', value: 'daredevil' },
      { label: 'Jessica Jones (Jewel)', value: 'jessica-jones' },
      { label: 'Carl Lucas/Luke Cage (Power Man)', value: 'luke-cage' },
      { label: 'Danny Rand/Iron Fist', value: 'iron-fist' },
      { label: 'Frank Castle/The Punisher', value: 'the-punisher' },
    ],
  },
  {
    id: 'checkboxes',
    span: 1,
    component: 'QOptionGroup',
    label: 'Check some boxes',
    default: () => [], // 'QOptionGroup' might not work without a default array
    // component props:
    type: 'checkbox',
    options: [
      {
        label: 'Option 1',
        value: 'op1',
      },
      {
        label: 'Option 2',
        value: 'op2',
      },
      {
        label: 'Option 3',
        value: 'op3',
      },
    ],
  },
  { span: 1 },
  {
    id: 'consent',
    component: 'QToggle',
    span: 1,
    label: 'Do you agree with our terms?',
    rules: [(val) => val || 'You must accept our terms'],
    default: false,
  },
  {
    id: 'submissionDate',
    span: 1,
    component: 'QInput',
    label: 'Date of submission',
    parseInput: (val) => new Date(val),
    parseValue: (val) => date.formatDate(val, 'YYYY/MM/DD'),
    // component props:
    mask: '####/##/##',
    placeholder: 'YYYY/MM/DD',
  },
]

/**
 * This is a more advanced example so you can see the full power of BlitzForms. All fields you see here are just regular Quasar components.
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
