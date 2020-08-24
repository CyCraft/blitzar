import { boot } from 'quasar/wrappers'
import PreviewCode from '../components/PreviewCode.vue'

export default boot(({ Vue }) => {
  Vue.component(PreviewCode.name, PreviewCode)
})
