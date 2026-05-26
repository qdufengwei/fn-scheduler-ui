import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    component: () => import('#/views/user-apikey/index.vue'),
    meta: {
      authority: ['user'],
      icon: 'lucide:key-round',
      order: 4,
      title: 'API KEY',
    },
    name: 'UserApiKey',
    path: '/user-apikey',
  },
  {
    component: () => import('#/views/user-task-monitor/index.vue'),
    meta: {
      authority: ['user'],
      icon: 'lucide:activity',
      order: 5,
      title: '任务监控',
    },
    name: 'UserTaskMonitor',
    path: '/user-task-monitor',
  },
  {
    component: () => import('#/views/user-terminal/index.vue'),
    meta: {
      authority: ['user'],
      icon: 'lucide:terminal',
      order: 6,
      title: '云终端',
    },
    name: 'UserTerminal',
    path: '/user-terminal',
  },
  {
    component: () => import('#/views/user-bill/index.vue'),
    meta: {
      authority: ['user'],
      icon: 'lucide:receipt',
      order: 7,
      title: '账单',
    },
    name: 'UserBill',
    path: '/user-bill',
  },
  {
    component: () => import('#/views/user-organization/index.vue'),
    meta: {
      authority: ['user'],
      icon: 'lucide:users',
      order: 8,
      title: '用户管理',
    },
    name: 'UserOrganization',
    path: '/user-organization',
  },
];

export default routes;