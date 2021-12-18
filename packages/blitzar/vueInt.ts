/* eslint-disable */
const fs = require('fs-extra')

;(async () => {
  const mainFolder = '../../packages/blitzar'
  const folders = ['../../packages/form', '../../packages/table', '../../packages/components']

  try {
    await fs.mkdir(`${mainFolder}/dist/vetur`)
  } catch (error) {
    /** error */
  }

  const attributesObject = folders.reduce((carry, folder) => {
    const attributes = fs.readJsonSync(`${folder}/dist/vetur/attributes.json`)
    return { ...carry, ...attributes }
  }, {} as Record<string, any>)

  const tagsObject = folders.reduce((carry, folder) => {
    const tags = fs.readJsonSync(`${folder}/dist/vetur/tags.json`)
    return { ...carry, ...tags }
  }, {} as Record<string, any>)

  fs.writeFileSync(
    `${mainFolder}/dist/vetur/attributes.json`,
    JSON.stringify(attributesObject, undefined, 2)
  )
  fs.writeFileSync(`${mainFolder}/dist/vetur/tags.json`, JSON.stringify(tagsObject, undefined, 2))
})()

export {}
