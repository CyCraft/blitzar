<template>
  <div>
    <BlitzForm class="custom-labels-example" :schema="schema" v-model="formData" />
  </div>
</template>

<style scoped>
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
</style>

<script>
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

export default {
  data() {
    return {
      schema,
      formData: {
        name: 'Peace of Cake',
        powerOrigin: 'self',
      },
    }
  },
}
</script>
