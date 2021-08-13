<template>
  <div>
    <BlitzForm
      class="raw-form-data-style"
      labelPosition="left"
      :schema="schema"
      mode="raw"
      v-model="formData"
      gridGap="0"
    />
  </div>
</template>

<style lang="sass">
.raw-form-data-style
  background: #F6F9FC
  border-radius: 8px
  padding: 1rem
  .blitz-field
    border-bottom: 1px solid #D9E2F1
    padding-top: 8px
    padding-bottom: 8px
    line-height: 24px
  .blitz-field__component
    text-align: right
  ._title
    font-weight: 600
    border-bottom: none
    padding: 0
    line-height: 20px
</style>

<script>
import { CodeBlock } from '@planetar/code-block'
import BlitzForm from '../../../form/src/components/BlitzForm.vue'

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

export default {
  components: { BlitzForm, CodeBlock },
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
