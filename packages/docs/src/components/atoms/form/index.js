import BlitzForm from './components/BlitzForm.vue'
import BlitzField from './components/BlitzField.vue'
import BlitzH from './components/BlitzH.vue'
import BlitzMiniForm from './components/BlitzMiniForm.vue'

import { validateFormPerSchema } from './helpers/validation.js'

export { BlitzForm, BlitzField, BlitzH, BlitzMiniForm, validateFormPerSchema }

export default {
  BlitzForm,
  BlitzField,
  BlitzH,
  BlitzMiniForm,

  validateFormPerSchema,

  install(Vue) {
    Vue.component(BlitzField.name, BlitzField)
    Vue.component(BlitzForm.name, BlitzForm)
    Vue.component(BlitzH.name, BlitzH)
    Vue.component(BlitzMiniForm.name, BlitzMiniForm)
  },
}
