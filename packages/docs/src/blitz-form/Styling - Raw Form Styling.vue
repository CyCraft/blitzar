<script setup>
import { ref } from 'vue'

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

const showStyling = ref(true)
const formData = ref({
  name: 'Peace of Cake',
  powerOrigin: 'self',
  stamina: 5000,
  power: 9000,
  roleModel: 'Thor Odinson',
})
</script>

<template>
  <div>
    <button style="margin-bottom: 1rem" @click="showStyling = !showStyling">
      Toggle Custom Styling
    </button>

    <BlitzForm
      v-model="formData"
      :class="showStyling ? 'raw-form-data-style' : ''"
      labelPosition="left"
      :schema="schema"
      mode="raw"
      gridGap="0"
    />
  </div>
</template>

<style lang="scss">
.raw-form-data-style {
  background: #f6f9fc;
  border-radius: 8px;
  padding: 1rem;

  .blitz-field {
    border-bottom: 1px solid #d9e2f1;
    padding-top: 8px;
    padding-bottom: 8px;
    line-height: 24px;
  }
  .blitz-field__component {
    text-align: right;
  }
  ._title {
    font-weight: 600;
    border-bottom: none;
    padding: 0;
    line-height: 20px;
  }
}
</style>
