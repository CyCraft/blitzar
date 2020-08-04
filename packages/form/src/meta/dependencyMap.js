import { merge } from 'merge-anything'
import { QBtn, QInput } from './quasarPropsJson'

export const dependencyMap = {
  QInput: {
    componentName: 'QInput',
    component: 'QInput',
    passedProps: { QInput },
  },
  EfBtn: {
    componentName: 'EfBtn',
    component: 'EfBtn',
    passedProps: { QBtn },
  },
  EfDiv: {
    componentName: 'EfDiv',
    component: 'EfDiv',
    passedProps: {},
  },
  EfMiniForm: {
    componentName: 'EfMiniForm',
    component: 'EfMiniForm',
    passedProps: {},
  },
}

export function getPassedProps(component) {
  const info = dependencyMap[component] || {}
  const { passedProps } = info
  return merge(...Object.values(passedProps))
}

export default { ...dependencyMap, getPassedProps }
