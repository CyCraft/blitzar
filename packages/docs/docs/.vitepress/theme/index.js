// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './variables.css'
import './styles.css'

import { BlitzForm } from '@blitzar/form'
import { CodeBlock } from '@planetar/code-block'
import CodeBlockComponent from '../../../components/CodeBlockComponent.vue'
import BaseInput from '../../../components/BaseInput.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component('BlitzForm', BlitzForm)
    app.component('CodeBlock', CodeBlock)
    app.component('CodeBlockComponent', CodeBlockComponent)
    app.component('BaseInput', BaseInput)
  },
}
