import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      authority: ['user'],
      icon: 'lucide:list-todo',
      order: 2,
      title: '任务中心',
    },
    name: 'UserTaskCenter',
    path: '/user-task',
    children: [
      {
        meta: {
          icon: 'lucide:clock',
          title: '最新任务',
        },
        name: 'UserLatestTask',
        path: '/user-task/latest',
        redirect: '/user-task/latest/training',
        children: [
          {
            component: () => import('#/views/user-task/training/latest.vue'),
            meta: {
              icon: 'lucide:graduation-cap',
              title: '训练任务',
            },
            name: 'UserTrainingLatest',
            path: 'training',
          },
          {
            component: () => import('#/views/user-task/finetune/index.vue'),
            meta: {
              icon: 'lucide:sliders-horizontal',
              title: '模型微调',
            },
            name: 'UserFinetuneLatest',
            path: 'finetune',
          },
          {
            component: () => import('#/views/user-task/inference/index.vue'),
            meta: {
              icon: 'lucide:rocket',
              title: '推理服务',
            },
            name: 'UserInferenceLatest',
            path: 'inference',
          },
          {
            component: () => import('#/views/user-task/devbox/index.vue'),
            meta: {
              icon: 'lucide:monitor',
              title: '开发机',
            },
            name: 'UserDevboxLatest',
            path: 'devbox',
          },
        ],
      },
      {
        component: () => import('#/views/user-task/training/template.vue'),
        meta: {
          icon: 'lucide:file-text',
          title: '任务模板',
        },
        name: 'UserTaskTemplate',
        path: '/user-task/template',
      },
      {
        component: () => import('#/views/user-task/training/recycle.vue'),
        meta: {
          icon: 'lucide:trash-2',
          title: '任务回收站',
        },
        name: 'UserTaskRecycle',
        path: '/user-task/recycle',
      },
      // 隐藏的路由 - 创建页面
      {
        component: () => import('#/views/user-task/training/create.vue'),
        meta: {
          title: '创建训练任务',
          hideInMenu: true,
          hideInBreadcrumb: true,
          hideInTab: true,
        },
        name: 'UserTrainingCreate',
        path: '/user-task/latest/training/create',
      },
      {
        component: () => import('#/views/user-task/training/create-template.vue'),
        meta: {
          title: '创建任务模板',
          hideInMenu: true,
          hideInBreadcrumb: true,
          hideInTab: true,
        },
        name: 'UserTrainingTemplateCreate',
        path: '/user-task/template/create',
      },
      {
        component: () => import('#/views/user-task/finetune/create.vue'),
        meta: {
          title: '创建微调任务',
          hideInMenu: true,
          hideInBreadcrumb: true,
          hideInTab: true,
        },
        name: 'UserFinetuneCreate',
        path: '/user-task/latest/finetune/create',
      },
      {
        component: () => import('#/views/user-task/inference/create.vue'),
        meta: {
          title: '创建推理服务',
          hideInMenu: true,
          hideInBreadcrumb: true,
          hideInTab: true,
        },
        name: 'UserInferenceCreate',
        path: '/user-task/latest/inference/create',
      },
      {
        component: () => import('#/views/user-task/devbox/create.vue'),
        meta: {
          title: '创建开发机',
          hideInMenu: true,
          hideInBreadcrumb: true,
          hideInTab: true,
        },
        name: 'UserDevboxCreate',
        path: '/user-task/latest/devbox/create',
      },
      {
        component: () => import('#/views/user-task/training/detail.vue'),
        meta: {
          title: '任务详情',
          hideInMenu: true,
          hideInBreadcrumb: true,
          hideInTab: true,
          activeMenu: '/user-task/latest/training',
        },
        name: 'UserTrainingDetail',
        path: '/user-task/latest/training/detail/:id',
      },
    ],
  },
];

export default routes;