---
editLink: true
head:
- - link
  - rel: stylesheet
    type: text/css
    href: https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons
- - link
  - rel: stylesheet
    type: text/css
    href: https://cdn.jsdelivr.net/npm/quasar@2.1.0/dist/quasar.prod.css
- - script
  - src: https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js
- - script
  - src: https://cdn.jsdelivr.net/npm/quasar@2.1.0/dist/quasar.umd.prod.js
---

# Quasar Framework Examples

## Quasar Framework + BlitzForm

Be sure to first read the BlitzForm [basics](/blitz-form/).

All fields used in this example are Quasar components.

Please note that Quasar cannot auto-detect the use of Quasar components in Blitzar. So you need to register them as global Vue components in `quasar.conf.js` OR manually like so:

```js
import { QInput } from 'quasar'

app.component('QInput', QInput)
```

<CodeBlockComponent filename="example-quasar/BlitzForm" />



--

<!-- ### Vuetify

All fields used in this example are Vuetify components.

Please note that Vuetify cannot auto-detect the use of Vuetify components in Blitzar. So you need to register them as global Vue components like so:

```js
import { VTextField } from 'vuetify/lib'

Vue.component('VTextField', VTextField)
```

<CodeBlockComponent filename="blitz-form/Frameworks - Vuetify" /> -->
