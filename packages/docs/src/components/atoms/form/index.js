import BlitzForm from './components/BlitzForm.vue'
import BlitzField from './components/BlitzField.vue'
import BlitzH from './components/BlitzH.vue'
import BlitzListForm from './components/BlitzListForm.vue'

import { validateFormPerSchema } from './helpers/validation.js'

export { BlitzForm, BlitzField, BlitzH, BlitzListForm, validateFormPerSchema }

export default {
  BlitzForm,
  BlitzField,
  BlitzH,
  BlitzListForm,

  validateFormPerSchema,

  install(Vue) {
    Vue.component(BlitzField.name, BlitzField)
    Vue.component(BlitzForm.name, BlitzForm)
    Vue.component(BlitzH.name, BlitzH)
    Vue.component(BlitzListForm.name, BlitzListForm)
  },
}
