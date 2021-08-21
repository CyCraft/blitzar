---
editLink: true
---

# Advanced

## Using Locally Registered Components

Using a custom component in `BlitzForm` requires it to be registered globally. The idea is that a BlitzForm schema is saved in a Database, so we want to avoid using component instances etc.

However, if you still prefer to use locally registered components you can do so by simply passing the instance directly and wrapping it in `markRaw`.

```js
import { markRaw } from 'vue'
import BaseInput from './BaseInput.vue'

const schema = [
  {
    id: 'name',
    label: 'Name',
    component: markRaw(BaseInput),
  },
]
```

The example below uses this method:

<CodeBlockComponent filename="advanced/Using Locally Registered Components" />
