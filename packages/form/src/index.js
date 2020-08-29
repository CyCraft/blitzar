import BlitzForm from './components/BlitzForm.vue'
import BlitzField from './components/BlitzField.vue'

import BlitzBtn from './components/fields/BlitzBtn.vue'
import BlitzDiv from './components/fields/BlitzDiv.vue'
import BlitzMiniForm from './components/fields/BlitzMiniForm.vue'

import { validateFormPerSchema } from './helpers/validation.js'

export { BlitzForm, BlitzField, BlitzBtn, BlitzDiv, BlitzMiniForm, validateFormPerSchema }

export default {
  BlitzForm,
  BlitzField,

  BlitzBtn,
  BlitzDiv,
  BlitzMiniForm,

  validateFormPerSchema,

  install(Vue) {
    Vue.component(BlitzField.name, BlitzField)
    Vue.component(BlitzForm.name, BlitzForm)

    Vue.component(BlitzBtn.name, BlitzBtn)
    Vue.component(BlitzDiv.name, BlitzDiv)
    Vue.component(BlitzMiniForm.name, BlitzMiniForm)
  },
}
