<template>
  <div class="basics">
    <EasyForm :schema="schema" v-model="value" />
  </div>
</template>

<style lang="stylus" scoped>
// $

// .basics
</style>

<script>
import vue from 'vue'
import { QInput, QBtnToggle } from 'quasar'
import { EasyForm } from '@blitzar/form'

vue.component('QInput', QInput)
vue.component('QBtnToggle', QBtnToggle)

export default {
  name: 'Basics',
  components: { EasyForm },
  data() {
    const schema = [
      {
        id: 'name',
        component: 'QInput',
        label: 'Superhero name',
        subLabel: 'Think of something cool.',
      },
      {
        id: 'powerOrigin',
        component: 'QBtnToggle',
        label: 'Power origin',
        subLabel: 'Where does your power come from?',
        // component props:
        options: [
          { label: 'Mutation', value: 'mutation' },
          { label: 'Self taught', value: 'self' },
          { label: 'By item', value: 'item' },
        ],
        spread: true,
      },
    ]
    return { schema, value: {} }
  },
  computed: {},
  methods: {},
}
</script>
