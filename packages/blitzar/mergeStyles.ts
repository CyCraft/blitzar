/* eslint-disable */
import * as fs from 'fs-extra'
;(async () => {
  const mainFolder = '../../packages/blitzar'
  const folders = ['../../packages/form', '../../packages/table', '../../packages/components']

  const content = folders.reduce<string>((carry, folder) => {
    const style = fs.readFileSync(`${folder}/dist/style.css`)
    return `${carry}
${style}`
  }, '')

  fs.writeFileSync(`${mainFolder}/dist/style.css`, content)
})()

export {}
