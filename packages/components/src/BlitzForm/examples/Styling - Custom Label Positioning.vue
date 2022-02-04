<script setup>
import BlitzForm from '../BlitzForm.vue'
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
    subLabel: 'where the hero power is coming from',
  },
]

const showStyling = ref(true)
const formData = {
  name: 'Peace of Cake',
  powerOrigin: 'self',
}
</script>

<template>
  <div>
    <button style="margin-bottom: 1rem" @click="showStyling = !showStyling">
      Toggle Custom Styling
    </button>

    <BlitzForm
      v-model="formData"
      :class="showStyling ? 'custom-labels-example' : ''"
      :schema="schema"
    />
  </div>
</template>

<style lang="scss">
.custom-labels-example {
  .blitz-field {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'component label'
      'sub-label sub-label';
  }
  .blitz-field__label {
    grid-area: label;
  }
  .blitz-field__sub-label {
    grid-area: sub-label;
  }
  .blitz-field__component {
    grid-area: component;
  }
  /** overwrite position for the title label: */
  ._title .blitz-field__label {
    grid-column: 1 / -1;
    font-weight: 600;
  }
}
</style>
