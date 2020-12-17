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
/** Either set a minimum or fixed width like so: */
.styling-left-labels
  .blitz-field__label,
  .blitz-field__sub-label
    width: 150px

/** OR set the width of the columns like so: */
.styling-left-labels
  .blitz-field
    grid-template-columns: 150px 1fr
</style>

<script>
import { BlitzForm } from 'blitzar'

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

/**
## Left Labels

It's easy to position all labels on the left side! Just set `labelPosition="left"` on the BlitzForm.

When using left labels, by default, the label only takes up as much width as needed. It's really easy however to align all labels to be the same width. See the _**style tab**_ how this is done for the example below.
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
