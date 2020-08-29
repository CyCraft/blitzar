import { merge }from 'merge-anything'
import { QTable } from './quasarPropsJson'

export const dependencyMap = {
  EasyTable: {
    QTable,
  },
}

export function getPassedProps (tagName) {
  const inheritedComponents = dependencyMap[tagName] || {}
  return merge(...Object.values(inheritedComponents))
}

export default { ...dependencyMap, getPassedProps }
