<template>
  <div>
    <BlitzForm :schema="schema" v-model="formData" :columnCount="2" />
    <PreviewCode comment="formData">{{ formData }}</PreviewCode>
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzForm } from 'blitzar'

const schema = [
  {
    id: 'under18',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
    label: 'Are you under 18?',
  },
  {
    id: 'parentalConsent',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
    label: 'Do you have parental consent?',
    subLabel: 'Only applicable when under 18',
    evaluatedProps: ['disabled'],
    // component props:
    disabled: (val, { formData }) => !formData.under18,
  },
]

/**
## Dynamic Prop Based on the Value of "Another" Field

Eg. `disabled: (val, {formData}) => !formData.under18`
 */
export default {
  components: { BlitzForm },
  data() {
    return { schema, formData: {} }
  },
}
</script>
