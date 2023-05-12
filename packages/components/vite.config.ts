import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteplay from '@viteplay/plugin'
import path from 'path'
import pkg from './package.json'

const nameCamel = pkg.name
const namePascal = nameCamel.replace(/(^\w|-\w)/g, (c) => c.replace('-', '').toUpperCase())
const dependencies = Object.keys(pkg.dependencies || [])

export default defineConfig((ctx) => {
  const DEV = ctx.mode === 'development'

  return {
    plugins: [
      vue(),
      DEV &&
        viteplay({
          // Path to extract components from to create dev pages for
          components: './src/*/*.vue',
          // Path to extract component examples from to put on each dev page
          componentExamples: './examples/*.vue',
          base: '/dev',
        }),
    ],
    build: {
      minify: false,
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
  }
})
