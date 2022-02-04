<script setup>
import BlitzForm from '../BlitzForm.vue'
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
    // component props:
    component: 'select',
    slot: [
      { component: 'option', value: '', slot: 'Select one', disabled: true },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
  },
]

const formData = ref({
  name: 'Thor Odinson',
  powerOrigin: 'self',
})
let remountCounter = ref(0)

function clearFormData() {
  formData.value = {
    name: '',
    powerOrigin: '',
  }
}
function loadNewData() {
  formData.value = {
    name: 'Tony Stark',
    powerOrigin: 'gear',
  }
}
</script>

<template>
  <div>
    <div style="margin-bottom: 1rem">
      <button type="button" @click="clearFormData(), remountCounter++">
        Clear form data & remount
      </button>
      <button type="button" @click="loadNewData(), remountCounter++">
        Load new data & remount
      </button>
      <button type="button" style="color: crimson" @click="clearFormData">
        Clear form data - no remount!
      </button>
      <button type="button" style="color: crimson" @click="loadNewData">
        Load new data - no remount!
      </button>
    </div>

    <BlitzForm
      :key="JSON.stringify(remountCounter)"
      v-model="formData"
      :schema="schema"
      :columnCount="2"
    />
    <pre><code>{{`// formData\n${JSON.stringify(formData, undefined, 2)}`}}</code></pre>
  </div>
</template>
