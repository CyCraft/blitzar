import { createRouter, createWebHistory } from 'vue-router'
import { pages } from '@viteplay/vue/client'

console.log(`%c 🛣`, 'font-size: 2rem', `VitePlay generated routes → `, pages)

export const router = createRouter({
  history: createWebHistory(),
  routes: [...pages],
})

let initialPageRender = true

router.beforeEach((to, from, next) => {
  if (initialPageRender && to.path === '/') {
    initialPageRender = false
    next('/dev')
    return
  }
  return next()
})
