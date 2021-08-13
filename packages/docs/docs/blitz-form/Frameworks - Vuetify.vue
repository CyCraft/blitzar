<template>
  <div>
    <BlitzForm
      :schema="schema"
      v-model="formData"
      :columnCount="2"
      gridGap="32px"
      :internalErrorsFor="['VInput']"
    />

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<style lang="sass">
// Don't forget to import the required styles after Vuetify Styles but before your project's custom styles.
@import 'blitzar/styles.sass'
</style>

<script>
import { CodeBlock } from '@planetar/code-block'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'
import Vue from 'vue'

import { VTextField, VRadioGroup, VRadio, VSlider, VCheckbox, VSwitch, VSelect } from 'vuetify/lib'
// All components that are used in the form need to be globally registered.
Vue.component('VTextField', VTextField)
Vue.component('VRadioGroup', VRadioGroup)
Vue.component('VRadio', VRadio)
Vue.component('VSlider', VSlider)
Vue.component('VCheckbox', VCheckbox)
Vue.component('VSwitch', VSwitch)
Vue.component('VSelect', VSelect)

const schema = [
  {
    id: 'name',
    span: 1,
    component: 'VTextField',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
    required: true,
  },
  {
    id: 'powerOrigin',
    span: 1,
    component: 'VRadioGroup',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    slot: [
      { component: 'VRadio', label: 'Mutation', value: 'mutation' },
      { component: 'VRadio', label: 'Self taught', value: 'self' },
      { component: 'VRadio', label: 'By item', value: 'item' },
    ],
  },
  {
    id: 'stamina',
    span: 2,
    component: 'VSlider',
    label: 'Stamina',
    defaultValue: 50,
    // component props:
    min: 0,
    max: 100,
    thumbLabel: 'always',
  },
  {
    id: 'power',
    span: 1,
    component: 'VTextField',
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
    component: 'VSelect',
    label: 'Role model',
    subLabel: 'Who do you look up to?',
    // component props:
    items: [
      { text: 'Steve Rogers/Captain America', value: 'captain-america' },
      { text: 'Tony Stark/Iron Man', value: 'iron-man' },
      { text: 'Thor Odinson', value: 'thor-odinson' },
      { text: 'Bruce Banner/The Incredible Hulk', value: 'the-incredible-hulk' },
      { text: 'Natasha Romanoff/Black Widow', value: 'black-widow' },
      { text: 'Clint Barton/Hawkeye', value: 'hawkeye' },
      { text: 'Pietro Maximoff/Quicksilver', value: 'quicksilver' },
      { text: 'Wanda Maximoff/Scarlet Witch', value: 'scarlet-witch' },
      { text: 'The Vision', value: 'the-vision' },
      { text: 'James Rhodes/War Machine (Iron Patriot)', value: 'war-machine' },
      { text: 'Sam Wilson/Falcon', value: 'falcon' },
      { text: 'Bucky Barnes/The Winter Soldier (White Wolf)', value: 'the-winter-soldier' },
      { text: "T'Challa/Black Panther", value: 'black-panther' },
      { text: 'Stephen Strange/Doctor Strange', value: 'doctor-strange' },
      { text: 'Peter Parker/Spider-Man', value: 'spider-man' },
      { text: 'Scott Lang/Ant-Man (Giant-Man)', value: 'ant-man' },
      { text: 'Hope van Dyne/Wasp', value: 'wasp' },
      { text: 'Carol Danvers/Captain Marvel', value: 'captain-marvel' },
      { text: 'Peter Quill/Star-Lord', value: 'star-lord' },
      { text: 'Gamora', value: 'gamora' },
      { text: 'Drax the Destroyer', value: 'drax-the-destroyer' },
      { text: 'Rocket (Raccoon)', value: 'rocket-raccoon' },
      { text: '(Baby, Teenage) Groot', value: 'groot' },
      { text: 'Mantis', value: 'mantis' },
      { text: 'Matthew Murdock/Daredevil', value: 'daredevil' },
      { text: 'Jessica Jones (Jewel)', value: 'jessica-jones' },
      { text: 'Carl Lucas/Luke Cage (Power Man)', value: 'luke-cage' },
      { text: 'Danny Rand/Iron Fist', value: 'iron-fist' },
      { text: 'Frank Castle/The Punisher', value: 'the-punisher' },
    ],
  },
  // the example of multiple checkboxes below can ideally be much shorter and cleaner if you prepare
  // a wrapper Vue component that renders multiple VCheckboxes and emits an array for the 'input' event on each change
  {
    id: 'powerUps',
    span: 1,
    component: 'div',
    label: 'Choose some power-ups',
    defaultValue: () => [],
    evaluatedProps: ['slot'],
    // component props:
    slot: (powerUpsArray, { fieldInput }) => {
      const change = (value) => (bool) => {
        if (!bool) fieldInput({ id: 'powerUps', value: powerUpsArray.filter((v) => v !== value) })
        if (bool) fieldInput({ id: 'powerUps', value: [...powerUpsArray, value] })
      }
      return [
        {
          component: 'VCheckbox',
          label: 'ISO-8 Chrystal',
          value: 'iso-8',
          events: { change: change('iso-8') },
        },
        {
          component: 'VCheckbox',
          label: 'Health potion',
          value: 'hp-potion',
          events: { change: change('hp-potion') },
        },
        {
          component: 'VCheckbox',
          label: 'Energy drink',
          value: 'energy-potion',
          events: { change: change('energy-potion') },
        },
      ]
    },
  },
  { span: 1 },
  {
    id: 'consent',
    component: 'VSwitch',
    span: 1,
    label: 'Do you agree with our terms?',
    rules: [(val) => val || 'You must accept our terms'],
    defaultValue: false,
  },
  {
    id: 'submissionDate',
    span: 1,
    component: 'VTextField',
    label: 'Date of submission',
    subLabel: 'Will convert input to a Date when typing eg. `2020/01/01`',
    parseInput: (val) => {
      if (isNaN(new Date(val))) return val
      if (val.length < 10) return val
      return new Date(val)
    },
    parseValue: (val) => {
      if (typeof val === 'string' && val.length < 10) return val
      if (isNaN(new Date(val))) return val
      const d = new Date(val)
      const yyyy = d.getFullYear()
      const mm = `${d.getMonth() + 1}`.padStart(2, '0')
      const dd = `${d.getDate()}`.padStart(2, '0')
      return `${yyyy}/${mm}/${dd}`
    },
    // component props:
    placeholder: 'YYYY/MM/DD',
    prependIcon: 'mdi-calendar',
  },
]

export default {
  components: { BlitzForm, CodeBlock },
  data() {
    return { schema, formData: {} }
  },
}
</script>
