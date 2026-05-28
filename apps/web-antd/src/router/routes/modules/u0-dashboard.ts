import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    component: () => import('#/views/user-dashboard/index.vue'),
    meta: {
      authority: ['user'],
      icon: 'lucide:layout-dashboard',
      order: 0,
      title: '概览',
    },
    name: 'UserDashboard',
    path: '/user-dashboard',
  },
];

export default routes;
