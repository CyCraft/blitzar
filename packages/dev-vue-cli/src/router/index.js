import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import BlitzarForm from '../views/BlitzarForm.vue'
import BlitzarTable from '../views/BlitzarTable.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/blitzar-form',
    name: 'BlitzarForm',
    component: BlitzarForm,
  },
  {
    path: '/blitzar-table',
    name: 'BlitzarTable',
    component: BlitzarTable,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
