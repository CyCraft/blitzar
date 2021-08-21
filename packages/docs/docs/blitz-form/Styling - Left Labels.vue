<template>
  <div>
    <BlitzForm
      class="left-labels-example"
      labelPosition="left"
      :schema="schema"
      v-model="formData"
    />
  </div>
</template>


<style scoped>
/** Either set a minimum or fixed width like so: */
.blitz-field__label,
.blitz-field__sub-label {
  width: 150px;
}

/** OR set the width of the columns like so: */
.blitz-field {
  grid-template-columns: 150px 1fr;
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

export default {
  data() {
    return {
      schema,
      formData: {
        name: 'Peace of Cake',
        powerOrigin: 'self',
        stamina: 5000,
        power: 9000,
        roleModel: 'Thor Odinson',
      },
    }
  },
}
</script>
