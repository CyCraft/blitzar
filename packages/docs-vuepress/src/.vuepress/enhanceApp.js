/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */
import Quasar from 'quasar'
import { ExampleSection, PlanetarInput } from 'planetar'

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  Vue.use(Quasar)
  // Vue.component('PlanetarInput', PlanetarInput)
  Vue.component('ExampleSection', ExampleSection)
  // ...apply enhancements for the site.
}
