import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      authority: ['admin'],
      icon: 'lucide:brain',
      order: 5,
      title: 'AI资产管理',
    },
    name: 'AdminAIAsset',
    path: '/admin-ai-asset',
    redirect: '/admin-ai-asset/model/preset',
    children: [
      {
        meta: {
          icon: 'lucide:box',
          title: '模型仓库',
        },
        name: 'AdminAIAssetModel',
        path: '/admin-ai-asset/model',
        redirect: '/admin-ai-asset/model/preset',
        children: [
          {
            component: () => import('#/views/admin-ai-asset/model-preset/index.vue'),
            meta: {
              icon: 'lucide:package',
              title: '预置模型',
            },
            name: 'AdminAIAssetModelPreset',
            path: 'preset',
          },
          {
            component: () => import('#/views/admin-ai-asset/model-custom/index.vue'),
            meta: {
              icon: 'lucide:package-plus',
              title: '自定义模型',
            },
            name: 'AdminAIAssetModelCustom',
            path: 'custom',
          },
        ],
      },
      {
        component: () => import('#/views/admin-ai-asset/model-market/index.vue'),
        meta: {
          icon: 'lucide:store',
          title: '模型服务市场',
        },
        name: 'AdminAIAssetMarket',
        path: '/admin-ai-asset/market',
      },
      {
        component: () => import('#/views/admin-ai-asset/dataset/index.vue'),
        meta: {
          icon: 'lucide:database',
          title: '数据集',
        },
        name: 'AdminAIAssetDataset',
        path: '/admin-ai-asset/dataset',
      },
      {
        meta: {
          icon: 'lucide:hard-drive',
          title: '镜像仓库',
        },
        name: 'AdminAIAssetImageRoot',
        path: '/admin-ai-asset/image',
        redirect: '/admin-ai-asset/image/repo',
        children: [
          {
            component: () => import('#/views/admin-ai-asset/image/index.vue'),
            meta: {
              icon: 'lucide:layers',
              title: '镜像仓库',
            },
            name: 'AdminAIAssetImageRepo',
            path: 'repo',
          },
          {
            component: () => import('#/views/admin-ai-asset/image-task/index.vue'),
            meta: {
              icon: 'lucide:list-checks',
              title: '镜像任务',
            },
            name: 'AdminAIAssetImageTask',
            path: 'task',
          },
        ],
      },
    ],
  },
];

export default routes;