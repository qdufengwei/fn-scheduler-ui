<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { Button, Checkbox, Col, Form, FormItem, Input, Pagination, Popconfirm, Radio, Row, Select, Space, Switch, Table, Tag, message } from 'ant-design-vue';
import { ref, computed, nextTick } from 'vue';
import { ArrowLeft, Copy, Info, Plus, Trash2 } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

// 筛选条件
const imageScope = ref('public');
const project = ref('kubesphereio');
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref<any[]>([]);

// 详情页状态
const showDetail = ref(false);
const selectedImage = ref<any>(null);
const detailPage = ref(1);
const detailPageSize = ref(10);

// 镜像数据
const rows = ref([
  { id: 1, name: 'kubesphereio/lmsysorg/sglang', count: 1, pulls: 5, created: '2026-03-12 08:57:23', updated: '2026-03-12 09:43:58', isPublic: true },
  { id: 2, name: 'kubesphereio/rbgs-controller', count: 1, pulls: 4, created: '2026-03-12 08:05:38', updated: '2026-03-15 05:44:25', isPublic: true },
  { id: 3, name: 'kubesphereio/dcgm', count: 1, pulls: 2, created: '2026-03-03 08:08:36', updated: '2026-03-11 03:19:07', isPublic: true },
  { id: 4, name: 'kubesphereio/k8s-rdma-shared-dev-plugin', count: 1, pulls: 1, created: '2026-03-03 07:43:06', updated: '2026-03-03 07:43:34', isPublic: true },
  { id: 5, name: 'kubesphereio/coredns', count: 1, pulls: 2, created: '2026-03-03 07:35:42', updated: '2026-03-03 07:38:34', isPublic: true },
  { id: 6, name: 'kubesphereio/vllm-openai', count: 1, pulls: 1, created: '2026-03-03 07:22:28', updated: '2026-03-03 11:12:45', isPublic: true },
  { id: 7, name: 'kubesphereio/aicloud-webide-gateway', count: 2, pulls: 2, created: '2026-03-03 06:43:35', updated: '2026-03-03 12:52:46', isPublic: true },
  { id: 8, name: 'kubesphereio/aicloud-backend', count: 1, pulls: 2, created: '2026-03-03 06:43:27', updated: '2026-05-21 01:10:06', isPublic: true },
  { id: 9, name: 'kubesphereio/code-server', count: 2, pulls: 7, created: '2026-02-18 05:44:09', updated: '2026-03-04 06:44:44', isPublic: true },
  { id: 10, name: 'kubesphereio/base-notebook', count: 2, pulls: 4, created: '2026-02-18 05:41:31', updated: '2026-03-04 06:45:54', isPublic: true },
  { id: 11, name: 'private/custom-llm', count: 1, pulls: 0, created: '2026-03-10 10:00:00', updated: '2026-03-10 10:00:00', isPublic: false },
]);

// 详情数据
const detailRows = ref([
  {
    id: 101,
    name: 'sha256:7eb35eb1d311d52e0010ac5f05913925f244a0001b9b7ba05a0ff03546aeecb5',
    tags: ['com.nvidia.cudnn.version', 'org.opencontainers.image.ref.name'],
    size: '16835.17MB',
    address: '',
    created: '2026-03-12 08:57:23',
  },
  {
    id: 102,
    name: 'glm5-hopper',
    tags: [],
    size: '16835.17MB',
    address: 'harbor.local.clusters/kubesphereio/lmsysorg/sglang:glm5-hopper',
    created: '2026-03-12 08:57:23',
  },
]);

// 抽屉状态
const isImportMode = ref(false);

const createForm = ref({
  directory: 'kubesphereio',
  name: '',
  version: '',
  isLatest: false,
  tags: [] as string[],
  buildType: 'Dockerfile' as 'Dockerfile' | 'DevBox' | 'Task',
  dockerfile: '',
  devboxName: undefined as string | undefined,
  pauseContainer: true,
  taskName: undefined as string | undefined,
  instanceInfo: undefined as string | undefined,
  containerSelect: undefined as string | undefined,
  pauseContainerRunning: true,
});

const importForm = ref({
  targetProtocol: 'docker',
  targetProject: 'kubesphereio',
  targetName: '',
  targetVersion: '',
  sourceProtocol: 'docker',
  sourceAddress: '',
});

// 下拉选项
const projectOptions = [
  { label: 'kubesphereio', value: 'kubesphereio' },
  { label: 'test01', value: 'test01' },
  { label: 'library', value: 'library' },
];

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

// 标签操作
const inputTagVisible = ref(false);
const newTagValue = ref('');
const tagInputRef = ref<any>(null);

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
  if (createForm.value.isLatest) {
    createForm.value.version = 'latest';
  } else {
    createForm.value.version = '';
  }
}

const notify = (text: string) => message.success(text);

function handleCreateImage() {
  isImportMode.value = false;
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
  createDrawerApi.open();
}

function handleSave() {
  if (isImportMode.value) {
    if (!importForm.value.targetName || !importForm.value.targetVersion || !importForm.value.sourceAddress) {
      message.warning('请填写所有必填的导入字段');
      return;
    }
    const newName = `${importForm.value.targetProject}/${importForm.value.targetName}`;
    const newId = rows.value.length + 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    rows.value.unshift({
      id: newId,
      name: newName,
      count: 1,
      pulls: 0,
      created: now,
      updated: now,
      isPublic: imageScope.value === 'public',
    });
    notify(`成功导入镜像 [${newName}:${importForm.value.targetVersion}]`);
  } else {
    if (!createForm.value.name || (!createForm.value.isLatest && !createForm.value.version)) {
      message.warning('请填写镜像名称及版本号');
      return;
    }
    if (createForm.value.buildType === 'Dockerfile' && !createForm.value.dockerfile) {
      message.warning('请填写 Dockerfile 内容');
      return;
    }
    const newName = `${createForm.value.directory}/${createForm.value.name}`;
    const newId = rows.value.length + 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    rows.value.unshift({
      id: newId,
      name: newName,
      count: 1,
      pulls: 0,
      created: now,
      updated: now,
      isPublic: imageScope.value === 'public',
    });
    notify(`成功提交构建镜像任务 [${newName}:${createForm.value.isLatest ? 'latest' : createForm.value.version}]`);
  }
  createDrawerApi.close();
}

function handleDelete(record: any) {
  rows.value = rows.value.filter((item) => item.id !== record.id);
  notify(`删除镜像 ${record.name} 成功`);
}

function handleBatchDelete() {
  rows.value = rows.value.filter((item) => !selectedRowKeys.value.includes(item.id));
  notify(`批量删除 ${selectedRowKeys.value.length} 个镜像成功`);
  selectedRowKeys.value = [];
}

function handleSelectionChange(keys: any[]) {
  selectedRowKeys.value = keys;
}

function handleViewDetail(record: any) {
  selectedImage.value = record;
  showDetail.value = true;
}

function handleDeleteImageRepo() {
  if (selectedImage.value) {
    rows.value = rows.value.filter((item) => item.id !== selectedImage.value.id);
    notify(`删除镜像仓库 ${selectedImage.value.name} 成功`);
    showDetail.value = false;
  }
}

function handleDeleteDetailRow(record: any) {
  detailRows.value = detailRows.value.filter((item) => item.id !== record.id);
  notify(`删除版本 ${record.name} 成功`);
}

function copyText(text: string) {
  navigator.clipboard.writeText(text);
  message.success('已复制镜像地址到剪贴板');
}

// 筛选后的镜像数据
const filteredRows = computed(() => {
  let data = rows.value.filter((r) =>
    imageScope.value === 'public' ? r.isPublic : !r.isPublic,
  );
  if (project.value) {
    data = data.filter((r) => r.name.startsWith(project.value + '/'));
  }
  if (keyword.value) {
    data = data.filter((r) => r.name.toLowerCase().includes(keyword.value.toLowerCase()));
  }
  return data;
});

// 分页后的镜像数据
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRows.value.slice(start, end);
});

const columns = [
  { title: '镜像名称', dataIndex: 'name', key: 'name', width: 280 },
  { title: '镜像数量', dataIndex: 'count', key: 'count', width: 100 },
  { title: '拉取次数', dataIndex: 'pulls', key: 'pulls', width: 100, sorter: (a: any, b: any) => a.pulls - b.pulls },
  { title: '创建时间', dataIndex: 'created', key: 'created', width: 180 },
  { title: '更新时间', dataIndex: 'updated', key: 'updated', width: 180 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
];

const detailColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 340 },
  { title: '标签', dataIndex: 'tags', key: 'tags', width: 240 },
  { title: '大小', dataIndex: 'size', key: 'size', width: 120 },
  { title: '镜像地址', dataIndex: 'address', key: 'address', width: 280 },
  { title: '创建时间', dataIndex: 'created', key: 'created', width: 160 },
  { title: '操作', key: 'action', width: 80 },
];

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[840px]!',
  title: '',
});
</script>

<template>
  <div class="p-4">
    <transition name="fade-slide" mode="out-in">
      <!-- 镜像列表视图 -->
      <div v-if="!showDetail" key="list">
        <ListPageLayout>
          <template #filters>
            <div class="flex flex-wrap items-center gap-4">
              <Radio.Group v-model:value="imageScope" button-style="solid">
                <Radio.Button value="public">公共镜像</Radio.Button>
                <Radio.Button value="private">私有镜像</Radio.Button>
              </Radio.Group>
              <Select v-model:value="project" style="width: 180px" :options="projectOptions" />
              <Input v-model:value="keyword" placeholder="请输入镜像名称" style="width: 220px" />
            </div>
          </template>

          <template #filterActions>
            <Space>
              <Button type="primary">筛选</Button>
              <Button @click="keyword = ''; imageScope = 'public'; project = 'kubesphereio'">重置</Button>
            </Space>
          </template>

          <template #toolbar>
            <Button type="primary" @click="handleCreateImage">
              <template #icon><Plus class="size-4" /></template>
              创建镜像
            </Button>
            <Popconfirm title="确认批量删除选中的镜像？" ok-text="确认" cancel-text="取消" @confirm="handleBatchDelete">
              <Button danger :disabled="selectedRowKeys.length === 0">
                <template #icon><Trash2 class="size-4" /></template>
                批量删除
              </Button>
            </Popconfirm>
          </template>

          <Table
            row-key="id"
            :data-source="paginatedRows"
            :columns="columns"
            :pagination="false"
            :row-selection="{ selectedRowKeys, onChange: handleSelectionChange }"
            :scroll="{ x: 1000 }"
            size="middle"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <a class="text-blue-600 hover:text-blue-700 font-semibold" @click="handleViewDetail(record)">
                  {{ record.name }}
                </a>
              </template>
              <template v-if="column.key === 'action'">
                <Popconfirm title="确认删除该镜像？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record)">
                  <a class="text-red-500">删除</a>
                </Popconfirm>
              </template>
            </template>
          </Table>

          <div class="fn-list-pagination flex items-center justify-end mt-4">
            <Pagination
              v-model:current="currentPage"
              v-model:pageSize="pageSize"
              :total="filteredRows.length"
              :show-size-changer="true"
              :show-quick-jumper="true"
              :page-size-options="['10', '20', '50', '100']"
            />
          </div>
        </ListPageLayout>
      </div>

      <!-- 镜像详情视图 -->
      <div v-else key="detail" class="space-y-4">
        <div class="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Button type="text" class="flex items-center justify-center p-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer" @click="showDetail = false">
                <ArrowLeft class="size-5 text-gray-600 dark:text-zinc-400" />
              </Button>
              <span class="text-lg font-bold text-gray-800 dark:text-zinc-200 select-all">{{ selectedImage.name }}</span>
            </div>
            <Popconfirm title="确认删除该镜像仓库？" ok-text="确认" cancel-text="取消" @confirm="handleDeleteImageRepo">
              <Button danger>删除</Button>
            </Popconfirm>
          </div>

          <div class="border-t border-solid border-neutral-100 dark:border-neutral-800/50 my-4" />

          <div class="bg-neutral-50/60 dark:bg-zinc-900/40 border border-solid border-neutral-100 dark:border-neutral-800/80 rounded-xl p-6">
            <Row :gutter="[48, 16]">
              <Col :span="12">
                <div class="flex items-center justify-between py-1 pr-12 border-b border-dashed border-neutral-100 dark:border-neutral-800">
                  <span class="text-sm text-gray-400 dark:text-zinc-500 w-24">镜像数量</span>
                  <span class="text-sm font-semibold text-gray-800 dark:text-zinc-200">{{ selectedImage.count }}</span>
                </div>
              </Col>
              <Col :span="12">
                <div class="flex items-center justify-between py-1 pr-12 border-b border-dashed border-neutral-100 dark:border-neutral-800">
                  <span class="text-sm text-gray-400 dark:text-zinc-500 w-24">创建时间</span>
                  <span class="text-sm font-semibold text-gray-800 dark:text-zinc-200">{{ selectedImage.created }}</span>
                </div>
              </Col>
              <Col :span="12">
                <div class="flex items-center justify-between py-1 pr-12">
                  <span class="text-sm text-gray-400 dark:text-zinc-500 w-24">拉取次数</span>
                  <span class="text-sm font-semibold text-gray-800 dark:text-zinc-200">{{ selectedImage.pulls }}</span>
                </div>
              </Col>
              <Col :span="12">
                <div class="flex items-center justify-between py-1 pr-12">
                  <span class="text-sm text-gray-400 dark:text-zinc-500 w-24">仓库名称</span>
                  <span class="text-sm font-semibold text-gray-800 dark:text-zinc-200">{{ selectedImage.name.split('/')[0] }}</span>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <div class="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-gray-800 dark:text-zinc-200">镜像详情</h3>
          <Table
            row-key="id"
            :data-source="detailRows"
            :columns="detailColumns"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <span class="text-sm text-gray-800 dark:text-zinc-300 font-mono select-all break-all">{{ record.name }}</span>
              </template>
              <template v-if="column.key === 'tags'">
                <div class="flex flex-wrap gap-1.5">
                  <Tag v-for="tag in record.tags" :key="tag" class="rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 border-none px-2.5 py-0.5 text-xs">
                    {{ tag }}
                  </Tag>
                  <span v-if="!record.tags || record.tags.length === 0" class="text-gray-400">-</span>
                </div>
              </template>
              <template v-if="column.key === 'address'">
                <div v-if="record.address" class="flex items-center gap-1.5">
                  <span class="text-sm text-gray-600 dark:text-zinc-400 font-mono break-all">{{ record.address }}</span>
                  <Button type="link" size="small" class="p-0 h-auto" @click="copyText(record.address)">
                    <Copy class="size-3" />
                  </Button>
                </div>
                <span v-else class="text-gray-400">-</span>
              </template>
              <template v-if="column.key === 'created'">
                <span class="text-sm text-gray-600 dark:text-zinc-400">{{ record.created }}</span>
              </template>
              <template v-if="column.key === 'action'">
                <Popconfirm title="确认删除该镜像？" ok-text="确认" cancel-text="取消" @confirm="handleDeleteDetailRow(record)">
                  <a class="text-red-500 text-sm">删除</a>
                </Popconfirm>
              </template>
            </template>
          </Table>

          <div class="flex items-center justify-end mt-4 pt-4 border-t border-solid border-neutral-100 dark:border-neutral-800">
            <Pagination
              v-model:current="detailPage"
              v-model:pageSize="detailPageSize"
              :total="detailRows.length"
              :show-size-changer="true"
              :show-quick-jumper="true"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- 创建镜像抽屉 -->
    <CreateDrawer>
      <template #title>
        <div class="flex items-center gap-3 select-none">
          <Button type="text" class="flex items-center justify-center p-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer" @click="createDrawerApi.close()">
            <ArrowLeft class="size-5 text-gray-600 dark:text-zinc-400" />
          </Button>
          <span class="text-base font-bold text-gray-800 dark:text-zinc-200">创建镜像</span>
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
          <h3 class="font-bold text-base mb-4 text-gray-800 dark:text-zinc-200">基础信息</h3>

          <FormItem label="镜像目录" required>
            <Select v-model:value="createForm.directory" style="width: 240px" :options="projectOptions" placeholder="请选择" />
          </FormItem>

          <FormItem label="镜像名称及版本" required>
            <div class="flex items-center gap-2 max-w-[560px]">
              <Input v-model:value="createForm.name" placeholder="请填写镜像名称，例如: python" style="flex: 2" />
              <span class="text-gray-400">:</span>
              <Input v-model:value="createForm.version" placeholder="请填写镜像版本号" style="flex: 1" :disabled="createForm.isLatest" />
            </div>
            <div class="mt-2">
              <Checkbox v-model:checked="createForm.isLatest" @change="handleLatestChange">作为latest版本</Checkbox>
            </div>
          </FormItem>

          <FormItem label="标签">
            <div class="flex flex-wrap gap-2 items-center">
              <Tag v-for="(tag, index) in createForm.tags" :key="index" closable @close="removeTag(index)">
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
              <Button v-else size="small" type="dashed" class="flex items-center gap-1" @click="showTagInput">
                <Plus class="size-3" /> 添加标签
              </Button>
            </div>
          </FormItem>

          <div class="border-t border-solid border-gray-100 dark:border-zinc-800 my-6" />

          <h3 class="font-bold text-base mb-4 text-gray-800 dark:text-zinc-200">构建方式</h3>

          <FormItem label="构建方式" required>
            <Radio.Group v-model:value="createForm.buildType" button-style="solid">
              <Radio.Button value="Dockerfile">基于Dockerfile</Radio.Button>
              <Radio.Button value="DevBox">开发机</Radio.Button>
              <Radio.Button value="Task">任务</Radio.Button>
            </Radio.Group>
            <div class="text-xs text-gray-400 dark:text-zinc-500 mt-2 flex items-start gap-1">
              <Info class="size-3.5 mt-0.5 text-blue-500" />
              <span v-if="createForm.buildType === 'Dockerfile'">Dockerfile 文件包含了构建镜像所需的指令和说明</span>
              <span v-else>请确保所选任务和实例在生成期间保持在"运行"状态。</span>
            </div>
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

          <div v-else-if="createForm.buildType === 'DevBox'" class="mt-4 space-y-4">
            <FormItem label="开发机名称" required>
              <Select v-model:value="createForm.devboxName" :options="devboxOptions" placeholder="请选择" style="width: 480px" />
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
              <Select v-model:value="createForm.taskName" :options="taskNameOptions" placeholder="请选择任务" style="width: 480px" />
            </FormItem>
            <FormItem label="实例信息" required>
              <Select v-model:value="createForm.instanceInfo" :options="instanceOptions" placeholder="请选择实例" style="width: 480px" />
            </FormItem>
            <FormItem label="选择容器" required>
              <Select v-model:value="createForm.containerSelect" :options="containerOptions" placeholder="请选择容器" style="width: 480px" />
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
          <h3 class="font-bold text-base mb-4 text-gray-800 dark:text-zinc-200">基础信息</h3>

          <FormItem label="目标镜像协议" required>
            <Input v-model:value="importForm.targetProtocol" disabled style="width: 240px" />
          </FormItem>

          <FormItem label="目标镜像项目" required>
            <Select v-model:value="importForm.targetProject" style="width: 240px" :options="projectOptions" placeholder="请选择" />
          </FormItem>

          <FormItem label="目标镜像地址" required>
            <div class="flex items-center gap-2 max-w-[560px]">
              <Input v-model:value="importForm.targetName" placeholder="请输入仓库地址" style="flex: 2" />
              <span class="text-gray-400">:</span>
              <Input v-model:value="importForm.targetVersion" placeholder="请输入版本号" style="flex: 1" />
            </div>
          </FormItem>

          <FormItem label="源镜像协议" required>
            <Input v-model:value="importForm.sourceProtocol" disabled style="width: 240px" />
          </FormItem>

          <FormItem label="源镜像地址" required>
            <Input v-model:value="importForm.sourceAddress" placeholder="请输入源镜像地址" style="width: 480px" />
          </FormItem>

          <div class="border-t border-solid border-gray-100 dark:border-zinc-800 my-6" />

          <h3 class="font-bold text-base mb-4 text-gray-800 dark:text-zinc-200">地址拼接</h3>
          <div class="space-y-4 max-w-[640px] bg-neutral-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80">
            <div class="flex items-start gap-4">
              <span class="w-[100px] text-gray-500 dark:text-zinc-400 text-sm font-medium">目标镜像地址</span>
              <span class="font-mono text-gray-800 dark:text-zinc-200 text-sm break-all">{{ targetImageConcat }}</span>
            </div>
            <div class="flex items-start gap-4">
              <span class="w-[100px] text-gray-500 dark:text-zinc-400 text-sm font-medium">源镜像地址</span>
              <span class="font-mono text-gray-800 dark:text-zinc-200 text-sm break-all">{{ sourceImageConcat }}</span>
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
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease-in-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>