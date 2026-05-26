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
        component: () => import('#/views/user-task/training/index.vue'),
        meta: {
          title: '训练任务',
        },
        name: 'UserTraining',
        path: '/user-task/training',
        redirect: '/user-task/training/latest',
        children: [
          {
            component: () => import('#/views/user-task/training/latest.vue'),
            meta: {
              title: '最新任务',
            },
            name: 'UserTrainingLatest',
            path: 'latest',
          },
          {
            component: () => import('#/views/user-task/training/template.vue'),
            meta: {
              title: '任务模板',
            },
            name: 'UserTrainingTemplate',
            path: 'template',
          },
          {
            component: () => import('#/views/user-task/training/recycle.vue'),
            meta: {
              title: '任务回收站',
            },
            name: 'UserTrainingRecycle',
            path: 'recycle',
          },
          {
            component: () => import('#/views/user-task/training/create.vue'),
            meta: {
              title: '创建训练任务',
              hideInMenu: true,
              hideInBreadcrumb: true,
              hideInTab: true,
            },
            name: 'UserTrainingCreate',
            path: 'create',
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
            path: 'template/create',
          },
        ],
      },
      {
        component: () => import('#/views/user-task/finetune/index.vue'),
        meta: {
          title: '模型微调',
        },
        name: 'UserFinetune',
        path: '/user-task/finetune',
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
        path: '/user-task/finetune/create',
      },
      {
        component: () => import('#/views/user-task/inference/index.vue'),
        meta: {
          title: '推理服务',
        },
        name: 'UserInference',
        path: '/user-task/inference',
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
        path: '/user-task/inference/create',
      },
      {
        component: () => import('#/views/user-task/devbox/index.vue'),
        meta: {
          title: '开发机',
        },
        name: 'UserDevbox',
        path: '/user-task/devbox',
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
        path: '/user-task/devbox/create',
      },
    ],
  },
];

export default routes;