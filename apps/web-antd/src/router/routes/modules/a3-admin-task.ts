import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      authority: ['admin'],
      icon: 'lucide:list-todo',
      order: 4,
      title: '任务中心',
    },
    name: 'AdminTaskCenter',
    path: '/admin-task',
    children: [
      {
        component: () => import('#/views/admin-task/latest/index.vue'),
        meta: {
          icon: 'lucide:clock',
          title: '最新任务',
        },
        name: 'AdminTaskLatest',
        path: '/admin-task/latest',
        redirect: '/admin-task/latest/training',
        children: [
          {
            component: () => import('#/views/admin-task/latest/training.vue'),
            meta: {
              icon: 'lucide:graduation-cap',
              title: '训练任务',
            },
            name: 'AdminTaskLatestTraining',
            path: 'training',
          },
          {
            component: () => import('#/views/admin-task/latest/finetune.vue'),
            meta: {
              icon: 'lucide:sliders-horizontal',
              title: '模型微调',
            },
            name: 'AdminTaskLatestFinetune',
            path: 'finetune',
          },
          {
            component: () => import('#/views/admin-task/latest/inference.vue'),
            meta: {
              icon: 'lucide:rocket',
              title: '推理服务',
            },
            name: 'AdminTaskLatestInference',
            path: 'inference',
          },
          {
            component: () => import('#/views/admin-task/latest/devbox.vue'),
            meta: {
              icon: 'lucide:monitor',
              title: '开发机',
            },
            name: 'AdminTaskLatestDevbox',
            path: 'devbox',
          },
          {
            component: () => import('#/views/admin-task/latest/detail.vue'),
            meta: {
              title: '任务详情',
              hideInMenu: true,
              hideInTab: true,
              activeMenu: '/admin-task/latest',
            },
            name: 'AdminTaskLatestDetail',
            path: 'detail/:id',
          },
        ],
      },
      {
        component: () => import('#/views/admin-task/template/index.vue'),
        meta: {
          icon: 'lucide:file-text',
          title: '任务模板',
        },
        name: 'AdminTaskTemplate',
        path: '/admin-task/template',
      },
      {
        component: () => import('#/views/admin-task/recycle/index.vue'),
        meta: {
          icon: 'lucide:trash-2',
          title: '任务回收站',
        },
        name: 'AdminTaskRecycle',
        path: '/admin-task/recycle',
      },
    ],
  },
];

export default routes;
