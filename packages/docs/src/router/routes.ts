import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/LandingPageLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/docs/blitz-form',
    component: () => import('layouts/DocsBlitzFormLayout.vue'),
    children: [
      {
        path: '',
        props: true,
        component: () => import('pages/DocsBlitzForm.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
