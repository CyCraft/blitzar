<script setup>
import BlitzForm from '../BlitzForm.vue'
import { ref, reactive } from 'vue'

const schema = [
  {
    label: 'Hero Details',
    class: '_title',
  },
  {
    id: 'name',
    component: 'input',
    label: 'Superhero name',
  },
  {
    id: 'powerOrigin',
    component: 'input',
    label: 'Power origin',
    subLabel: 'where the hero power is coming from',
    componentStyle: 'align-self: start',
  },
  {
    id: 'stamina',
    component: 'input',
    label: 'Stamina',
  },
  {
    id: 'power',
    component: 'input',
    label: 'Power',
  },
  {
    id: 'roleModel',
    component: 'input',
    label: 'Role model',
  },
]

const actionButtonsPosition = ref('top')

const actionButtons = ['delete', 'edit', 'cancel', 'save']

const formData = reactive({
  name: 'Peace of Cake',
  powerOrigin: 'self',
  stamina: 5000,
  power: 9000,
  roleModel: 'Thor Odinson',
})
</script>

<template>
  <div>
    <select v-model="actionButtonsPosition" style="margin-bottom: 1rem">
      <option value="top">top</option>
      <option value="bottom">bottom</option>
      <option value="right">right</option>
      <option value="left">left</option>
    </select>

    <BlitzForm
      v-model="formData"
      :actionButtonsPosition="actionButtonsPosition"
      :schema="schema"
      :actionButtons="actionButtons"
    />
  </div>
</template>
