<script setup lang="ts">
import type { CreateForm, ImportForm } from '../types';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { ArrowLeft, Plus } from '@vben/icons';

import {
  Button,
  Checkbox,
  Form,
  FormItem,
  Input,
  message,
  Radio,
  Select,
  Space,
  Switch,
  Tag,
} from 'ant-design-vue';

import { PROJECT_OPTIONS } from '../constants';

// ============ Emits ============
const emit = defineEmits<{
  (e: 'saveCreate', form: CreateForm): void;
  (e: 'saveImport', form: ImportForm): void;
}>();

// 抽屉状态
const isImportMode = ref(false);

const createForm = ref<CreateForm>({
  directory: 'kubesphereio',
  name: '',
  version: '',
  isLatest: false,
  tags: [],
  buildType: 'Dockerfile',
  dockerfile: '',
  devboxName: undefined,
  pauseContainer: true,
  taskName: undefined,
  instanceInfo: undefined,
  containerSelect: undefined,
  pauseContainerRunning: true,
});

const importForm = ref<ImportForm>({
  targetProtocol: 'docker',
  targetProject: 'kubesphereio',
  targetName: '',
  targetVersion: '',
  sourceProtocol: 'docker',
  sourceAddress: '',
});

// 标签操作
const inputTagVisible = ref(false);
const newTagValue = ref('');
const tagInputRef = ref<HTMLInputElement | null>(null);

function showTagInput() {
  inputTagVisible.value = true;
  nextTick(() => {
    tagInputRef.value?.focus();
  });
}

function handleTagInputConfirm() {
  if (newTagValue.value && !createForm.value.tags.includes(newTagValue.value)) {
    createForm.value.tags.push(newTagValue.value);
  }
  inputTagVisible.value = false;
  newTagValue.value = '';
}

function removeTag(index: number) {
  createForm.value.tags.splice(index, 1);
}

function handleLatestChange() {
  createForm.value.version = createForm.value.isLatest ? 'latest' : '';
}

// 地址拼接
const targetImageConcat = computed(() => {
  const proj = importForm.value.targetProject || 'kubesphereio';
  const name = importForm.value.targetName || 'target_image';
  const version = importForm.value.targetVersion || 'version';
  return `docker://${proj}/${name}:${version}`;
});

const sourceImageConcat = computed(() => {
  const src = importForm.value.sourceAddress || 'source_image';
  return `docker://${src}`;
});

// 下拉选项
const devboxOptions = [
  { label: 'devbox-qwen2.5-coder', value: 'devbox-qwen2.5-coder' },
  { label: 'devbox-pytorch-2.1', value: 'devbox-pytorch-2.1' },
];

const taskNameOptions = [
  { label: 'qwen2.5-inference-01', value: 'qwen2.5-inference-01' },
  { label: 'deepseek-v3-infer-task', value: 'deepseek-v3-infer-task' },
];

const instanceOptions = [
  { label: 'pod-01 (Ready)', value: 'pod-01' },
  { label: 'pod-02 (Running)', value: 'pod-02' },
];

const containerOptions = [
  { label: 'main-container', value: 'main-container' },
  { label: 'sidecar-container', value: 'sidecar-container' },
];

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[840px]!',
  title: '',
});

function resetForms() {
  createForm.value = {
    directory: 'kubesphereio',
    name: '',
    version: '',
    isLatest: false,
    tags: [],
    buildType: 'Dockerfile',
    dockerfile: '',
    devboxName: undefined,
    pauseContainer: true,
    taskName: undefined,
    instanceInfo: undefined,
    containerSelect: undefined,
    pauseContainerRunning: true,
  };
  importForm.value = {
    targetProtocol: 'docker',
    targetProject: 'kubesphereio',
    targetName: '',
    targetVersion: '',
    sourceProtocol: 'docker',
    sourceAddress: '',
  };
}

function open() {
  isImportMode.value = false;
  resetForms();
  createDrawerApi.open();
}

function close() {
  createDrawerApi.close();
}

function handleSave() {
  if (isImportMode.value) {
    if (
      !importForm.value.targetName ||
      !importForm.value.targetVersion ||
      !importForm.value.sourceAddress
    ) {
      message.warning('请填写所有必填的导入字段');
      return;
    }
    emit('saveImport', { ...importForm.value });
  } else {
    if (
      !createForm.value.name ||
      (!createForm.value.isLatest && !createForm.value.version)
    ) {
      message.warning('请填写镜像名称及版本号');
      return;
    }
    if (
      createForm.value.buildType === 'Dockerfile' &&
      !createForm.value.dockerfile
    ) {
      message.warning('请填写 Dockerfile 内容');
      return;
    }
    emit('saveCreate', { ...createForm.value });
  }
  createDrawerApi.close();
}

defineExpose({
  open,
  close,
});
</script>

<template>
  <CreateDrawer>
    <template #title>
      <div class="flex items-center gap-3 select-none">
        <Button
          type="text"
          class="flex items-center justify-center p-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
          @click="createDrawerApi.close()"
        >
          <ArrowLeft class="size-5 text-gray-600 dark:text-zinc-400" />
        </Button>
        <span class="text-base font-bold text-gray-800 dark:text-zinc-200"
          >创建镜像</span
        >
      </div>
    </template>

    <div class="drawer-body-container py-2">
      <div class="mb-6 flex justify-start">
        <Radio.Group v-model:value="isImportMode" button-style="solid">
          <Radio.Button :value="false">创建镜像</Radio.Button>
          <Radio.Button :value="true">导入镜像</Radio.Button>
        </Radio.Group>
      </div>

      <!-- 创建模式 -->
      <Form v-if="!isImportMode" layout="vertical" :model="createForm">
        <h3 class="font-bold text-base mb-4 text-gray-800 dark:text-zinc-200">
          基础信息
        </h3>

        <FormItem label="镜像目录" required>
          <Select
            v-model:value="createForm.directory"
            style="width: 240px"
            :options="PROJECT_OPTIONS"
            placeholder="请选择"
          />
        </FormItem>

        <FormItem label="镜像名称及版本" required>
          <div class="flex items-center gap-2 max-w-[560px]">
            <Input
              v-model:value="createForm.name"
              placeholder="请填写镜像名称，例如: python"
              style="flex: 2"
            />
            <span class="text-gray-400">:</span>
            <Input
              v-model:value="createForm.version"
              placeholder="请填写镜像版本号"
              style="flex: 1"
              :disabled="createForm.isLatest"
            />
          </div>
          <div class="mt-2">
            <Checkbox
              v-model:checked="createForm.isLatest"
              @change="handleLatestChange"
            >
              作为latest版本
            </Checkbox>
          </div>
        </FormItem>

        <FormItem label="标签">
          <div class="flex flex-wrap gap-2 items-center">
            <Tag
              v-for="(tag, index) in createForm.tags"
              :key="tag"
              closable
              @close="removeTag(index)"
            >
              {{ tag }}
            </Tag>
            <Input
              v-if="inputTagVisible"
              ref="tagInputRef"
              v-model:value="newTagValue"
              type="text"
              size="small"
              style="width: 90px"
              @blur="handleTagInputConfirm"
              @keyup.enter="handleTagInputConfirm"
            />
            <Button
              v-else
              size="small"
              type="dashed"
              class="flex items-center gap-1"
              @click="showTagInput"
            >
              <Plus class="size-3" /> 添加标签
            </Button>
          </div>
        </FormItem>

        <div
          class="border-t border-solid border-gray-100 dark:border-zinc-800 my-6"
        ></div>

        <h3 class="font-bold text-base mb-4 text-gray-800 dark:text-zinc-200">
          构建方式
        </h3>

        <FormItem label="构建方式" required>
          <Radio.Group
            v-model:value="createForm.buildType"
            button-style="solid"
          >
            <Radio.Button value="Dockerfile">基于Dockerfile</Radio.Button>
            <Radio.Button value="DevBox">开发机</Radio.Button>
            <Radio.Button value="Task">任务</Radio.Button>
          </Radio.Group>
        </FormItem>

        <div v-if="createForm.buildType === 'Dockerfile'" class="mt-4">
          <FormItem label="Dockerfile" required>
            <div class="relative">
              <Input.TextArea
                v-model:value="createForm.dockerfile"
                placeholder="请输入Dockerfile内容..."
                :rows="12"
                class="font-mono"
              />
            </div>
          </FormItem>
        </div>

        <div
          v-else-if="createForm.buildType === 'DevBox'"
          class="mt-4 space-y-4"
        >
          <FormItem label="开发机名称" required>
            <Select
              v-model:value="createForm.devboxName"
              :options="devboxOptions"
              placeholder="请选择"
              style="width: 480px"
            />
          </FormItem>
          <FormItem label="暂停容器">
            <div class="flex items-center gap-3">
              <Switch v-model:checked="createForm.pauseContainer" />
              <span class="text-sm text-gray-500 dark:text-zinc-400">暂停</span>
            </div>
          </FormItem>
        </div>

        <div v-else-if="createForm.buildType === 'Task'" class="mt-4 space-y-4">
          <FormItem label="任务名称" required>
            <Select
              v-model:value="createForm.taskName"
              :options="taskNameOptions"
              placeholder="请选择任务"
              style="width: 480px"
            />
          </FormItem>
          <FormItem label="实例信息" required>
            <Select
              v-model:value="createForm.instanceInfo"
              :options="instanceOptions"
              placeholder="请选择实例"
              style="width: 480px"
            />
          </FormItem>
          <FormItem label="选择容器" required>
            <Select
              v-model:value="createForm.containerSelect"
              :options="containerOptions"
              placeholder="请选择容器"
              style="width: 480px"
            />
          </FormItem>
          <FormItem label="暂停容器运行">
            <div class="flex items-center gap-3">
              <Switch v-model:checked="createForm.pauseContainerRunning" />
              <span class="text-sm text-gray-500 dark:text-zinc-400">暂停</span>
            </div>
          </FormItem>
        </div>
      </Form>

      <!-- 导入模式 -->
      <Form v-else layout="vertical" :model="importForm">
        <h3 class="font-bold text-base mb-4 text-gray-800 dark:text-zinc-200">
          基础信息
        </h3>

        <FormItem label="目标镜像协议" required>
          <Input
            v-model:value="importForm.targetProtocol"
            disabled
            style="width: 240px"
          />
        </FormItem>

        <FormItem label="目标镜像项目" required>
          <Select
            v-model:value="importForm.targetProject"
            style="width: 240px"
            :options="PROJECT_OPTIONS"
            placeholder="请选择"
          />
        </FormItem>

        <FormItem label="目标镜像地址" required>
          <div class="flex items-center gap-2 max-w-[560px]">
            <Input
              v-model:value="importForm.targetName"
              placeholder="请输入仓库地址"
              style="flex: 2"
            />
            <span class="text-gray-400">:</span>
            <Input
              v-model:value="importForm.targetVersion"
              placeholder="请输入版本号"
              style="flex: 1"
            />
          </div>
        </FormItem>

        <FormItem label="源镜像协议" required>
          <Input
            v-model:value="importForm.sourceProtocol"
            disabled
            style="width: 240px"
          />
        </FormItem>

        <FormItem label="源镜像地址" required>
          <Input
            v-model:value="importForm.sourceAddress"
            placeholder="请输入源镜像地址"
            style="width: 480px"
          />
        </FormItem>

        <div
          class="border-t border-solid border-gray-100 dark:border-zinc-800 my-6"
        ></div>

        <h3 class="font-bold text-base mb-4 text-gray-800 dark:text-zinc-200">
          地址拼接
        </h3>
        <div
          class="space-y-4 max-w-[640px] bg-neutral-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80"
        >
          <div class="flex items-start gap-4">
            <span
              class="w-[100px] text-gray-500 dark:text-zinc-400 text-sm font-medium"
              >目标镜像地址</span
            >
            <span
              class="font-mono text-gray-800 dark:text-zinc-200 text-sm break-all"
              >{{ targetImageConcat }}</span
            >
          </div>
          <div class="flex items-start gap-4">
            <span
              class="w-[100px] text-gray-500 dark:text-zinc-400 text-sm font-medium"
              >源镜像地址</span
            >
            <span
              class="font-mono text-gray-800 dark:text-zinc-200 text-sm break-all"
              >{{ sourceImageConcat }}</span
            >
          </div>
        </div>
      </Form>
    </div>

    <template #footer>
      <Space>
        <Button @click="createDrawerApi.close()">取消</Button>
        <Button type="primary" @click="handleSave">确认</Button>
      </Space>
    </template>
  </CreateDrawer>
</template>
