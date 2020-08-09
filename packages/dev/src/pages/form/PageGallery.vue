<template>
  <q-page padding>
    <ComponentGallery
      :componentFilesList="require.context('src/components', true, /^\.\/.*(\.vue)$/).keys()"
    />
  </q-page>
</template>

<script>
import { ComponentGallery } from 'planetar'
export default {
  name: 'PageForm',
  components: { ComponentGallery },
}
</script>
