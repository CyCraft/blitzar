<template>
  <div>
    <BlitzForm
      class="styling-left-labels"
      labelPosition="left"
      :schema="schema"
      v-model="formData"
    />
  </div>
</template>

<style lang="sass">
.styling-left-labels
  .blitz-field__label
    min-width: 120px
</style>

<script>
import { BlitzForm } from 'blitzar'
// All components that are used in the form need to be globally registered.

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

/**
## Left Labels

When using left labels, it's adviced to set `.blitz-field__label` to a minimum width as per the example below.
 */
export default {
  components: { BlitzForm },
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
