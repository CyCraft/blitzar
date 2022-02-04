import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '',
    component: () => import('src/pages/BlitzFormExample.vue'),
  },
  {
    path: '/',
    component: () => import('src/pages/BlitzFormExample.vue'),
  },
  {
    path: '/blitz-form',
    component: () => import('src/pages/BlitzFormExample.vue'),
  },
  {
    path: '/blitz-table',
    component: () => import('src/pages/BlitzFormExample.vue'),
  },
  {
    path: '/blitz-list-form',
    component: () => import('src/pages/BlitzFormExample.vue'),
  },
]

export default route(function (/* { store, ssrContext } */) {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  })

  return Router
})
