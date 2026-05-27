import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      authority: ['admin'],
      icon: 'lucide:building-2',
      order: 7,
      title: '组织管理',
    },
    name: 'AdminOrganization',
    path: '/admin-organization',
    redirect: '/admin-organization/tenant',
    children: [
      {
        component: () => import('#/views/admin-organization/tenant.vue'),
        meta: {
          icon: 'lucide:settings',
          title: '租户管理',
        },
        name: 'AdminOrganizationTenant',
        path: '/admin-organization/tenant',
      },
      {
        component: () => import('#/views/admin-organization/user.vue'),
        meta: {
          icon: 'lucide:users',
          title: '用户管理',
        },
        name: 'AdminOrganizationUser',
        path: '/admin-organization/user',
      },
    ],
  },
];

export default routes;