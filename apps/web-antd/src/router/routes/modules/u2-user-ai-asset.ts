import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      authority: ['user'],
      icon: 'lucide:brain',
      order: 3,
      title: 'AI资产管理',
    },
    name: 'UserAIAsset',
    path: '/user-ai-asset',
    children: [
      {
        meta: {
          icon: 'lucide:box',
          title: '模型仓库',
        },
        name: 'UserModelRoot',
        path: '/user-ai-asset/model',
        children: [
          {
            component: () => import('#/views/user-ai-asset/model/preset.vue'),
            meta: {
              icon: 'lucide:package',
              title: '预置模型',
            },
            name: 'UserModelPreset',
            path: '/user-ai-asset/model/preset',
          },
          {
            component: () => import('#/views/user-ai-asset/model/custom.vue'),
            meta: {
              icon: 'lucide:package-plus',
              title: '自定义模型',
            },
            name: 'UserModelCustom',
            path: '/user-ai-asset/model/custom',
          },
        ],
      },
      {
        component: () => import('#/views/user-ai-asset/model-market/index.vue'),
        meta: {
          icon: 'lucide:store',
          title: '模型服务市场',
        },
        name: 'UserModelMarket',
        path: '/user-ai-asset/model-market',
      },
      {
        component: () => import('#/views/user-ai-asset/dataset/index.vue'),
        meta: {
          icon: 'lucide:database',
          title: '数据集',
        },
        name: 'UserDataset',
        path: '/user-ai-asset/dataset',
      },
      {
        meta: {
          icon: 'lucide:image',
          title: '镜像中心',
        },
        name: 'UserImageRoot',
        path: '/user-ai-asset/image',
        children: [
          {
            component: () => import('#/views/user-ai-asset/image/index.vue'),
            meta: {
              icon: 'lucide:box',
              title: '镜像仓库',
            },
            name: 'UserImageRepo',
            path: '/user-ai-asset/image/repo',
          },
          {
            component: () => import('#/views/user-ai-asset/image/task.vue'),
            meta: {
              icon: 'lucide:list-todo',
              title: '镜像任务',
            },
            name: 'UserImageTask',
            path: '/user-ai-asset/image/task',
          },
        ],
      },
      {
        component: () => import('#/views/user-ai-asset/storage/index.vue'),
        meta: {
          icon: 'lucide:hard-drive',
          title: '存储管理',
        },
        name: 'UserStorage',
        path: '/user-ai-asset/storage',
      },
    ],
  },
];

export default routes;
