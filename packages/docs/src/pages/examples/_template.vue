<template>
  <div>
    <EasyForm :schema="schema" v-model="formData" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="stylus" scoped></style>

<script>
import { EasyForm } from '@blitzar/form'
// All components that are used in the form need to be globally registered.
import { QInput, QSelect } from 'quasar'
import Vue from 'vue'
Vue.component('QInput', QInput)
Vue.component('QSelect', QSelect)

const schema = []

/** */
export default {
  components: { EasyForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
