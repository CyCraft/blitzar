// .vitepress/theme/index.js
import { defineCustomElement } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './variables.css'
import './styles.css'

import { BlitzForm, BlitzListForm, BlitzTable, BlitzInput } from 'blitzar'
import 'blitzar/dist/style.css'

import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip'
import { CodeBlock } from '@planetar/code-block'

import CodeBlockComponent from './CodeBlockComponent.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component('BlitzForm', BlitzForm)
    app.component('BlitzListForm', BlitzListForm)
    app.component('BlitzTable', BlitzTable)
    app.component('BlitzInput', BlitzInput)
    app.component('CodeBlock', CodeBlock)
    app.component('CodeBlockComponent', CodeBlockComponent)
    app.component('VueCustomTooltip', VueCustomTooltip)
  },
}
