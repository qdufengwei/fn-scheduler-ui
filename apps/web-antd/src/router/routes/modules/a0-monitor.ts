import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      authority: ['admin'],
      icon: 'lucide:monitor',
      order: 1,
      title: '监控',
    },
    name: 'Monitor',
    path: '/monitor',
    children: [
      {
        component: () => import('#/views/monitor/cluster/index.vue'),
        meta: {
          icon: 'lucide:layout-grid',
          title: '集群监控',
        },
        name: 'ClusterMonitor',
        path: '/monitor/cluster',
      },
      {
        component: () => import('#/views/resource/monitor/index.vue'),
        meta: {
          icon: 'lucide:server',
          title: '节点监控',
        },
        name: 'NodeMonitor',
        path: '/monitor/node',
      },
      {
        component: () => import('#/views/monitor/rental/index.vue'),
        meta: {
          icon: 'lucide:chart-bar',
          title: '租售监控',
        },
        name: 'RentalMonitor',
        path: '/monitor/rental',
      },
      {
        component: () => import('#/views/monitor/task/index.vue'),
        meta: {
          icon: 'lucide:list-checks',
          title: '任务监控',
        },
        name: 'TaskMonitor',
        path: '/monitor/task',
      },
    ],
  },
];

export default routes;