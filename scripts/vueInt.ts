import * as fs from 'fs-extra'

const mainFolder = 'packages/blitzar'
const folders = ['packages/form', 'packages/table']

const attributesObject = folders.reduce((carry, folder) => {
  const attributes = fs.readJsonSync(`${folder}/vetur/attributes.json`)
  return { ...carry, ...attributes }
}, {} as Record<string, any>)

const tagsObject = folders.reduce((carry, folder) => {
  const tags = fs.readJsonSync(`${folder}/vetur/tags.json`)
  return { ...carry, ...tags }
}, {} as Record<string, any>)

fs.writeFileSync(
  `${mainFolder}/vetur/attributes.json`,
  JSON.stringify(attributesObject, undefined, 2)
)
fs.writeFileSync(`${mainFolder}/vetur/tags.json`, JSON.stringify(tagsObject, undefined, 2))
