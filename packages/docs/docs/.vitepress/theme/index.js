// .vitepress/theme/index.js
import { defineCustomElement } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './variables.css'
import './styles.css'

import { BlitzForm, BlitzListForm, BlitzTable } from 'blitzar'
import '@blitzar/form/dist/style.css'
import '@blitzar/table/dist/style.css'
import '@blitzar/components/dist/style.css'

import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip'
import { CodeBlock } from '@planetar/code-block'

import CodeBlockComponent from '../../../components/CodeBlockComponent.vue'
import BaseInput from '../../../components/BaseInput.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component('BlitzForm', BlitzForm)
    app.component('BlitzListForm', BlitzListForm)
    app.component('BlitzTable', BlitzTable)
    app.component('CodeBlock', CodeBlock)
    app.component('CodeBlockComponent', CodeBlockComponent)
    app.component('BaseInput', BaseInput)
    app.component('VueCustomTooltip', VueCustomTooltip)
  },
}
