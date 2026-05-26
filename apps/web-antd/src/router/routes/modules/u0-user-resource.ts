import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    component: () => import('#/views/user-resource/index.vue'),
    meta: {
      authority: ['user'],
      icon: 'lucide:cpu',
      order: 1,
      title: '我的资源',
    },
    name: 'UserResource',
    path: '/user-resource',
  },
];

export default routes;