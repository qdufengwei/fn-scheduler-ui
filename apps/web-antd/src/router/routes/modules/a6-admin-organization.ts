import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    component: () => import('#/views/admin-organization/index.vue'),
    meta: {
      authority: ['admin'],
      icon: 'lucide:building-2',
      order: 7,
      title: '组织管理',
    },
    name: 'AdminOrganization',
    path: '/admin-organization',
  },
];

export default routes;