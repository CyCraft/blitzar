import { RouteConfig } from 'vue-router'

export enum ROUTE_NAMES {
  FORM = 'BlitzForm',
  TABLE = 'BlitzTable',
}

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/LandingPageLayout.vue'),
    children: [{ path: '', component: () => import('pages/LandingPage.vue') }],
  },
  {
    path: '/docs',
    component: () => import('layouts/DocsLayout.vue'),
    children: [
      {
        path: 'blitz-form',
        name: ROUTE_NAMES.FORM,
        component: () => import('pages/DocsPage.vue'),
      },
      {
        path: 'blitz-table',
        name: ROUTE_NAMES.TABLE,
        component: () => import('pages/DocsPage.vue'),
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
