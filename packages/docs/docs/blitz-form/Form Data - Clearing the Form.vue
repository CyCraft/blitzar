<script>
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
      { component: 'option', value: '', slot: 'Select one', disabled: true },
      { component: 'option', value: 'mutation', slot: 'Mutation' },
      { component: 'option', value: 'self', slot: 'Self taught' },
      { component: 'option', value: 'item', slot: 'Magic item' },
      { component: 'option', value: 'gear', slot: 'Gear' },
    ],
  },
]

export default {
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

<template>
  <div>
    <div style="margin-bottom: 1rem">
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

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>
