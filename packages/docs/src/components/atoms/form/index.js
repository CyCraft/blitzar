import EasyForm from './components/EasyForm.vue'
import EasyField from './components/EasyField.vue'

import EfBtn from './components/fields/EfBtn.vue'
import EfDiv from './components/fields/EfDiv.vue'
import EfMiniForm from './components/fields/EfMiniForm.vue'

import dependencyMap from './meta/dependencyMap'
import { validateFormPerSchema } from './helpers/validation.js'

export { EasyForm, EasyField, EfBtn, EfDiv, EfMiniForm, dependencyMap, validateFormPerSchema }

export default {
  EasyForm,
  EasyField,

  EfBtn,
  EfDiv,
  EfMiniForm,

  dependencyMap,
  validateFormPerSchema,

  install(Vue) {
    Vue.component(EasyField.name, EasyField)
    Vue.component(EasyForm.name, EasyForm)

    Vue.component(EfBtn.name, EfBtn)
    Vue.component(EfDiv.name, EfDiv)
    Vue.component(EfMiniForm.name, EfMiniForm)
  },
}
