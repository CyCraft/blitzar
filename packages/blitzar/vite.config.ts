/* eslint-disable */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import pkg from './package.json'

const nameCamel = pkg.name
const namePascal = nameCamel.replace(/(^\w|-\w)/g, (c) => c.replace('-', '').toUpperCase())
const dependencies = Object.keys(pkg.dependencies || [])

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: namePascal,
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'index.es.js'
        if (format === 'cjs') return 'index.cjs'
        return ''
      },
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', ...dependencies],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
