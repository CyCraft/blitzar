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

export default {
  data() {
    return {
      showStyling: true,
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

<template>
  <div>
    <button @click="showStyling = !showStyling" style="margin-bottom: 1rem">
      Toggle Custom Styling
    </button>

    <BlitzForm
      :class="showStyling ? 'left-labels-example' : ''"
      labelPosition="left"
      :schema="schema"
      v-model="formData"
    />
  </div>
</template>

<style lang="scss">
.left-labels-example {
  /** Either set a minimum or fixed width like so: */
  .blitz-field__label,
  .blitz-field__sub-label {
    width: 150px;
  }

  /** OR set the width of the columns like so: */
  .blitz-field {
    grid-template-columns: 150px 1fr;
  }
}
</style>
