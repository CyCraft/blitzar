<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="4" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QSelect } from 'quasar'
import Vue from 'vue'
Vue.component('QSelect', QSelect)

const carData = [
  { year: 2015, make: 'Audi', model: 'A3', trim: '2.0' },
  { year: 2015, make: 'Audi', model: 'A3', trim: '1.8' },
  { year: 2015, make: 'Audi', model: 'A6', trim: '2.5' },
  { year: 2015, make: 'Audi', model: 'A6', trim: '3.0' },
  { year: 2015, make: 'BMW', model: 'M3', trim: 'b2.0' },
  { year: 2015, make: 'BMW', model: 'M3', trim: 'b1.8' },
  { year: 2015, make: 'BMW', model: 'M5', trim: 'b2.5' },
  { year: 2015, make: 'BMW', model: 'M5', trim: 'b3.0' },
  { year: 2016, make: 'Chevy', model: 'Impala', trim: 'c2.0' },
  { year: 2016, make: 'Chevy', model: 'Impala', trim: 'c1.8' },
  { year: 2016, make: 'Chevy', model: 'Malibu', trim: 'c2.5' },
  { year: 2016, make: 'Chevy', model: 'Malibu', trim: 'c3.0' },
  { year: 2016, make: 'Dodge', model: 'RAM', trim: 'd2.0' },
  { year: 2016, make: 'Dodge', model: 'RAM', trim: 'd1.8' },
  { year: 2016, make: 'Dodge', model: 'Challanger', trim: 'd2.5' },
  { year: 2016, make: 'Dodge', model: 'Challanger', trim: 'd3.0' },
]
const uniqueValues = (array) => [...new Set(array)]
const mapForQSelect = (value) => ({ value, label: value })

const clearFields = (fieldIds, fieldInput) => {
  fieldIds.forEach((id) => fieldInput({ id, value: '' }))
}

const schema = [
  {
    id: 'year',
    label: 'Year',
    component: 'QSelect',
    events: {
      // clear fields right from input to prevent invalid data
      input: (val, { fieldInput }) => clearFields(['make', 'model', 'trim'], fieldInput),
    },
    // component props:
    options: uniqueValues(carData.map((d) => d.year)).map(mapForQSelect),
    emitValue: true,
  },
  {
    id: 'make',
    label: 'Make',
    component: 'QSelect',
    evaluatedProps: ['options'],
    events: {
      // clear fields right from input to prevent invalid data
      input: (val, { fieldInput }) => clearFields(['model', 'trim'], fieldInput),
    },
    // component props:
    options: (val, { formData }) => {
      const { year } = formData || {}
      return uniqueValues(carData.filter((car) => car.year === year).map((d) => d.make)).map(
        mapForQSelect
      )
    },
    emitValue: true,
  },
  {
    id: 'model',
    label: 'Model',
    component: 'QSelect',
    evaluatedProps: ['options'],
    events: {
      // clear fields right from input to prevent invalid data
      input: (val, { fieldInput }) => clearFields(['trim'], fieldInput),
    },
    // component props:
    options: (val, { formData }) => {
      const { year, make } = formData || {}
      return uniqueValues(
        carData.filter((car) => car.year === year && car.make === make).map((d) => d.model)
      ).map(mapForQSelect)
    },
    emitValue: true,
  },
  {
    id: 'trim',
    label: 'Trim',
    component: 'QSelect',
    evaluatedProps: ['options'],
    // component props:
    options: (val, { formData }) => {
      const { year, make, model } = formData || {}
      return uniqueValues(
        carData
          .filter((car) => car.year === year && car.make === make && car.model === model)
          .map((d) => d.trim)
      ).map(mapForQSelect)
    },
    emitValue: true,
  },
]

/**
## Dynamic "options" of a select-field
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
