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
        component: () => import('#/views/user-ai-asset/model/index.vue'),
        meta: {
          title: '模型仓库',
        },
        name: 'UserModel',
        path: '/user-ai-asset/model',
      },
      {
        component: () => import('#/views/user-ai-asset/model-market/index.vue'),
        meta: {
          title: '模型服务市场',
        },
        name: 'UserModelMarket',
        path: '/user-ai-asset/model-market',
      },
      {
        component: () => import('#/views/user-ai-asset/dataset/index.vue'),
        meta: {
          title: '数据集',
        },
        name: 'UserDataset',
        path: '/user-ai-asset/dataset',
      },
      {
        component: () => import('#/views/user-ai-asset/image/index.vue'),
        meta: {
          title: '镜像中心',
        },
        name: 'UserImage',
        path: '/user-ai-asset/image',
      },
      {
        component: () => import('#/views/user-ai-asset/storage/index.vue'),
        meta: {
          title: '存储管理',
        },
        name: 'UserStorage',
        path: '/user-ai-asset/storage',
      },
    ],
  },
];

export default routes;