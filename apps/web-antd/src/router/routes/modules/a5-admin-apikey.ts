import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    component: () => import('#/views/admin-apikey/index.vue'),
    meta: {
      authority: ['admin'],
      icon: 'lucide:key-round',
      order: 6,
      title: 'API KEY',
    },
    name: 'AdminApiKey',
    path: '/admin-apikey',
  },
];

export default routes;