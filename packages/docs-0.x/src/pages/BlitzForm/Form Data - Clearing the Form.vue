<template>
  <div>
    <div class="q-gutter-sm mb-xl">
      <button @click="clearFormData(), remountCounter++" type="button">
        Clear form data & remount
      </button>
      <button @click="loadNewData(), remountCounter++" type="button">
        Load new data & remount
      </button>
      <button @click="clearFormData" type="button" style="color: crimson">
        Clear form data - no remount!
      </button>
      <button @click="loadNewData" type="button" style="color: crimson">
        Load new data - no remount!
      </button>
    </div>

    <BlitzForm :key="remountCounter" :schema="schema" v-model="formData" :columnCount="2" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

const schema = [
  {
    id: 'name',
    component: 'input',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
  },
  {
    id: 'powerOrigin',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    component: 'select',
    slot: [
      { component: 'option', value: '', slot: '' },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
  },
]

/**
## Clearing the Form

In order to _**clear**_ the form data _or_ to _**load new data**_ into the form, you will need to re-mount the form vue component!

BlitzForm copies the formData into its local state on mount, but it does not watch for all changes to `formData` (meaning the `v-model` or `value` prop). This is to achieve better performance.

Therefore you need to manually re-mount as seen in the example below. Watch what happens when clearing & loading data with and without remounting.
 */
export default {
  components: { BlitzForm },
  data() {
    const formData = {
      name: 'Thor Odinson',
      powerOrigin: 'self',
    }
    return {
      remountCounter: 0,
      schema,
      formData,
    }
  },
  methods: {
    clearFormData() {
      this.formData = {
        name: '',
        powerOrigin: '',
      }
    },
    loadNewData() {
      this.formData = {
        name: 'Tony Stark',
        powerOrigin: 'gear',
      }
    },
  },
}
</script>
