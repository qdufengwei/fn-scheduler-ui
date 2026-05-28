import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      authority: ['admin'],
      icon: 'lucide:wallet',
      order: 3,
      title: '计费管理',
    },
    name: 'Billing',
    path: '/billing',
    children: [
      {
        component: () => import('#/views/billing/revenue/index.vue'),
        meta: {
          icon: 'lucide:trending-up',
          title: '收益',
        },
        name: 'Revenue',
        path: '/billing/revenue',
      },
      {
        component: () => import('#/views/billing/pricing/index.vue'),
        meta: {
          icon: 'lucide:tag',
          title: '商品定价',
        },
        name: 'Pricing',
        path: '/billing/pricing',
      },
    ],
  },
];

export default routes;
