import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      authority: ['admin'],
      icon: 'lucide:server',
      order: 2,
      title: '集群资源',
    },
    name: 'ClusterResource',
    path: '/cluster-resource',
    children: [
      {
        component: () => import('#/views/resource/node/index.vue'),
        meta: {
          title: '节点管理',
        },
        name: 'ClusterNode',
        path: '/cluster-resource/node',
      },
      {
        component: () => import('#/views/cluster-resource/tenant/index.vue'),
        meta: {
          title: '租户资源',
        },
        name: 'ClusterTenant',
        path: '/cluster-resource/tenant',
      },
      {
        component: () => import('#/views/resource/vgpu/index.vue'),
        meta: {
          title: 'vGPU',
        },
        name: 'ClusterVgpu',
        path: '/cluster-resource/vgpu',
      },
      {
        component: () => import('#/views/cluster-resource/audit/index.vue'),
        meta: {
          title: '审计日志',
        },
        name: 'ClusterAudit',
        path: '/cluster-resource/audit',
      },
      {
        component: () => import('#/views/cluster-resource/service-config/index.vue'),
        meta: {
          title: '服务配置',
        },
        name: 'ServiceConfig',
        path: '/cluster-resource/service-config',
      },
    ],
  },
];

export default routes;
