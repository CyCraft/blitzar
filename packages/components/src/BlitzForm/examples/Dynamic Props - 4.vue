<script setup>
import BlitzForm from '../BlitzForm.vue'
import { ref } from 'vue'

const carData = [
  { year: '2015', make: 'Audi', model: 'A3', trim: '2.0' },
  { year: '2015', make: 'Audi', model: 'A3', trim: '1.8' },
  { year: '2015', make: 'Audi', model: 'A6', trim: '2.5' },
  { year: '2015', make: 'Audi', model: 'A6', trim: '3.0' },
  { year: '2015', make: 'BMW', model: 'M3', trim: 'b2.0' },
  { year: '2015', make: 'BMW', model: 'M3', trim: 'b1.8' },
  { year: '2015', make: 'BMW', model: 'M5', trim: 'b2.5' },
  { year: '2015', make: 'BMW', model: 'M5', trim: 'b3.0' },
  { year: '2016', make: 'Chevy', model: 'Impala', trim: 'c2.0' },
  { year: '2016', make: 'Chevy', model: 'Impala', trim: 'c1.8' },
  { year: '2016', make: 'Chevy', model: 'Malibu', trim: 'c2.5' },
  { year: '2016', make: 'Chevy', model: 'Malibu', trim: 'c3.0' },
  { year: '2016', make: 'Dodge', model: 'RAM', trim: 'd2.0' },
  { year: '2016', make: 'Dodge', model: 'RAM', trim: 'd1.8' },
  { year: '2016', make: 'Dodge', model: 'Challanger', trim: 'd2.5' },
  { year: '2016', make: 'Dodge', model: 'Challanger', trim: 'd3.0' },
]

const uniqueValues = (array) => ['', ...new Set(array)]

const clearFields = (fieldIds, updateField) => {
  fieldIds.forEach((id) => updateField({ id, value: '' }))
}

const schema = [
  {
    id: 'year',
    label: 'Year',
    component: 'select',
    events: {
      // clear fields right from input to prevent invalid data
      'update:modelValue': (val, { updateField }) =>
        clearFields(['make', 'model', 'trim'], updateField),
    },
    // component props:
    slot: uniqueValues(carData.map((d) => d.year)).map((value) => ({
      component: 'option',
      value,
      slot: value,
    })),
  },
  {
    id: 'make',
    label: 'Make',
    component: 'select',
    dynamicProps: ['slot'],
    events: {
      // clear fields right from input to prevent invalid data
      'update:modelValue': (val, { updateField }) => clearFields(['model', 'trim'], updateField),
    },
    // component props:
    slot: (val, { formData }) => {
      const { year } = formData || {}
      const makes = carData.filter((car) => car.year === year).map((d) => d.make)
      return uniqueValues(makes).map((value) => ({ component: 'option', value, slot: value }))
    },
  },
  {
    id: 'model',
    label: 'Model',
    component: 'select',
    dynamicProps: ['slot'],
    events: {
      // clear fields right from input to prevent invalid data
      'update:modelValue': (val, { updateField }) => clearFields(['trim'], updateField),
    },
    // component props:
    slot: (val, { formData }) => {
      const { year, make } = formData || {}
      const models = carData
        .filter((car) => car.year === year && car.make === make)
        .map((d) => d.model)
      return uniqueValues(models).map((value) => ({ component: 'option', value, slot: value }))
    },
  },
  {
    id: 'trim',
    label: 'Trim',
    component: 'select',
    dynamicProps: ['slot'],
    // component props:
    slot: (val, { formData }) => {
      const { year, make, model } = formData || {}
      const trims = carData
        .filter((car) => car.year === year && car.make === make && car.model === model)
        .map((d) => d.trim)
      return uniqueValues(trims).map((value) => ({ component: 'option', value, slot: value }))
    },
  },
]

const formData = ref({})
</script>

<template>
  <div>
    <BlitzForm v-model="formData" :schema="schema" :columnCount="4" />

    <pre><code>{{`// formData\n${JSON.stringify(formData, undefined, 2)}`}}</code></pre>
  </div>
</template>
