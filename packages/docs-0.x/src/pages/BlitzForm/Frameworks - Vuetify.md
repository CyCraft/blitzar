## Vuetify

All fields used in this example are Vuetify components.

Please note that Vuetify cannot auto-detect the use of Vuetify components in Blitzar. So you need to register them as global Vue components like so:

```js
import { VTextField } from 'vuetify/lib'

Vue.component('VTextField', VTextField)
```
