// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './variables.css'
import './styles.css'

import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip'
import { BlitzForm, BlitzListForm } from '@blitzar/form'
import { CodeBlock } from '@planetar/code-block'
import CodeBlockComponent from '../../../components/CodeBlockComponent.vue'
import BaseInput from '../../../components/BaseInput.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component('BlitzForm', BlitzForm)
    app.component('BlitzListForm', BlitzListForm)
    app.component('CodeBlock', CodeBlock)
    app.component('CodeBlockComponent', CodeBlockComponent)
    app.component('BaseInput', BaseInput)
    app.component('VueCustomTooltip', VueCustomTooltip)
  },
}
