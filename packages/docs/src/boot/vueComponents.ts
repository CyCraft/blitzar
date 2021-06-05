import { boot } from 'quasar/wrappers'
import PreviewCode from '../components/PreviewCode.vue'
import VueFinalModal from 'vue-final-modal'

export default boot(({ Vue }) => {
  Vue.component(PreviewCode.name, PreviewCode)
  Vue.use(VueFinalModal())
})
