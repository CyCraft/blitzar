<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'
// All components that are used in the form need to be globally registered.
import { QInput, QSelect } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)
Vue.component('QSelect', QSelect)

const schema = []

export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
