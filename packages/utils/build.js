/* eslint-disable */

// npm install rollup-plugin-typescript2 typescript --save-dev
import typescript from 'rollup-plugin-typescript2'

const pkg = require('./package.json')
const name = pkg.name
const className = name.replace(/(^\w|-\w)/g, (c) => c.replace('-', '').toUpperCase())
const external = Object.keys(pkg.dependencies || [])

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.es.js',
        format: 'esm',
        sourcemap: false,
        name: className,
        exports: 'named',
        preferConst: true,
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: false,
        name: className,
        exports: 'named',
        preferConst: true,
      },
    ],
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: { exclude: ['test/**/*'] },
      }),
    ],
    external,
  },
]
