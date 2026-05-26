import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    component: () => import('#/views/admin-task/index.vue'),
    meta: {
      authority: ['admin'],
      icon: 'lucide:list-todo',
      order: 4,
      title: '任务中心',
    },
    name: 'AdminTaskCenter',
    path: '/admin-task',
  },
];

export default routes;
