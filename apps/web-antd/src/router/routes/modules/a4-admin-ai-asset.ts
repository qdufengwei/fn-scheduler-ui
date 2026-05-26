import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    component: () => import('#/views/admin-ai-asset/index.vue'),
    meta: {
      authority: ['admin'],
      icon: 'lucide:brain',
      order: 5,
      title: 'AI资产管理',
    },
    name: 'AdminAIAsset',
    path: '/admin-ai-asset',
  },
];

export default routes;
