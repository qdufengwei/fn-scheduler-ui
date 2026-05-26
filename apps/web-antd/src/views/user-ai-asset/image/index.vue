<script setup lang="ts">
import {
  Button,
  Input,
  Pagination,
  Popconfirm,
  Segmented,
  Select,
  Space,
  Table,
  Tag,
  Drawer,
  Form,
  FormItem,
  Checkbox,
  Radio,
  Switch,
  Row,
  Col,
  message
} from 'ant-design-vue';
import { ref, computed, nextTick } from 'vue';
import { Plus, Trash2, ArrowLeft, Info, Expand, ChevronRight, Copy } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const imageScope = ref('public');
const project = ref('kubesphereio');
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref<any[]>([]);

// Detail View state
const showDetail = ref(false);
const selectedImage = ref<any>(null);
const detailPage = ref(1);
const detailPageSize = ref(10);

const rows = ref([
  { id: 1, name: 'kubesphereio/lmsysorg/sglang', count: 1, pulls: 5, created: '2026-03-12 08:57:23', updated: '2026-03-12 08:57:23' },
  { id: 2, name: 'kubesphereio/train-runtime', count: 12, pulls: 3401, created: '2026-05-02 11:20:14', updated: '2026-05-25 15:45:10' },
  { id: 3, name: 'tenant/test01-custom', count: 3, pulls: 412, created: '2026-05-10 14:15:22', updated: '2026-05-23 09:30:11' },
  { id: 4, name: 'kubesphereio/inference-base', count: 8, pulls: 1205, created: '2026-04-15 08:00:00', updated: '2026-05-20 18:22:05' },
]);

const detailRows = ref([
  {
    id: 101,
    name: 'sha256:7eb35eb1d311d52e0010ac5f05913925f244a0001b9b7ba05a0ff03546aeecb5',
    tags: ['com.nvidia.cudnn.version', 'org.opencontainers.image.ref.name', 'org.opencontainers.image.version'],
    size: '16835.17MB',
    address: '',
    created: '2026-03-12 08:57:23',
    children: [
      { id: 1011, name: 'layer 1: sha256:8f2ad615fb', tags: [], size: '2542.4MB', address: '', created: '2026-03-12 08:50:00' },
      { id: 1012, name: 'layer 2: sha256:5d1ee55b2a', tags: [], size: '14292.77MB', address: '', created: '2026-03-12 08:55:00' }
    ]
  },
  {
    id: 102,
    name: 'glm5-hopper',
    tags: [],
    size: '16835.17MB',
    address: 'harbor.local.clusters/kubesphereio/lmsysorg/sglang:glm5-hopper',
    created: '2026-03-12 08:57:23'
  }
]);

const detailColumns = [
  { title: '', dataIndex: 'expand', width: 50 },
  { title: '名称', dataIndex: 'name', width: 340 },
  { title: '标签', dataIndex: 'tags', width: 240 },
  { title: '大小', dataIndex: 'size', width: 120 },
  { title: '镜像地址', dataIndex: 'address', width: 280 },
  { title: '创建时间', dataIndex: 'created', width: 160 },
  { title: '操作', dataIndex: 'action', width: 80 }
];

// Drawer state
const drawerVisible = ref(false);
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
  pauseContainerRunning: true
});

const importForm = ref({
  targetProtocol: 'docker',
  targetProject: 'kubesphereio',
  targetName: '',
  targetVersion: '',
  sourceProtocol: 'docker',
  sourceAddress: ''
});

// Dropdown options
const projectOptions = [
  { label: 'kubesphereio', value: 'kubesphereio' },
  { label: 'test01', value: 'test01' },
  { label: 'library', value: 'library' }
];

const devboxOptions = [
  { label: 'devbox-qwen2.5-coder', value: 'devbox-qwen2.5-coder' },
  { label: 'devbox-pytorch-2.1', value: 'devbox-pytorch-2.1' },
  { label: 'devbox-ubuntu-base', value: 'devbox-ubuntu-base' }
];

const taskNameOptions = [
  { label: 'qwen2.5-inference-01', value: 'qwen2.5-inference-01' },
  { label: 'deepseek-v3-infer-task', value: 'deepseek-v3-infer-task' },
  { label: 'train-mnist-run', value: 'train-mnist-run' }
];

const instanceOptions = [
  { label: 'pod-01 (Ready)', value: 'pod-01' },
  { label: 'pod-02 (Running)', value: 'pod-02' }
];

const containerOptions = [
  { label: 'main-container', value: 'main-container' },
  { label: 'sidecar-container', value: 'sidecar-container' }
];

// Address Concatenation
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

// Tag actions
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

// Global actions
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
    pauseContainerRunning: true
  };
  importForm.value = {
    targetProtocol: 'docker',
    targetProject: 'kubesphereio',
    targetName: '',
    targetVersion: '',
    sourceProtocol: 'docker',
    sourceAddress: ''
  };
  drawerVisible.value = true;
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
      updated: now
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
    if (createForm.value.buildType === 'DevBox' && !createForm.value.devboxName) {
      message.warning('请选择开发机');
      return;
    }
    if (createForm.value.buildType === 'Task' && (!createForm.value.taskName || !createForm.value.instanceInfo || !createForm.value.containerSelect)) {
      message.warning('请完整选择任务、实例及容器');
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
      updated: now
    });
    notify(`成功提交构建镜像任务 [${newName}:${createForm.value.isLatest ? 'latest' : createForm.value.version}]`);
  }
  drawerVisible.value = false;
}

// Delete and Batch actions
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

// Detail functions
function handleViewDetail(record: any) {
  selectedImage.value = record;
  showDetail.value = true;
}

// Delete image repository
function handleDeleteImageRepo() {
  if (selectedImage.value) {
    rows.value = rows.value.filter(item => item.id !== selectedImage.value.id);
    notify(`删除镜像仓库 ${selectedImage.value.name} 成功`);
    showDetail.value = false;
  }
}

function handleDeleteDetailRow(record: any) {
  detailRows.value = detailRows.value.filter(item => item.id !== record.id);
  notify(`删除版本 ${record.name} 成功`);
}

function copyText(text: string) {
  navigator.clipboard.writeText(text);
  message.success('已复制镜像地址到剪贴板');
}
</script>

<template>
  <div class="p-4">
    <transition name="fade-slide" mode="out-in">
      <!-- Image List View -->
      <div v-if="!showDetail" key="list">
        <ListPageLayout>
          <template #filters>
            <div class="flex flex-wrap items-center gap-4">
              <Segmented v-model:value="imageScope" :options="[{ label: '公共镜像', value: 'public' }, { label: '私有镜像', value: 'private' }]" />
              <Select v-model:value="project" style="width: 180px" :options="projectOptions" />
              <Input v-model:value="keyword" placeholder="请输入镜像名称" style="width: 220px" />
            </div>
          </template>

          <template #filterActions>
            <Space>
              <Button type="primary" @click="notify('已筛选')">筛选</Button>
              <Button @click="keyword = ''; imageScope = 'public'; project = 'kubesphereio'">重置</Button>
            </Space>
          </template>

          <template #toolbar>
            <Button type="primary" @click="handleCreateImage">
              <template #icon><Plus class="size-4" /></template>
              创建镜像
            </Button>
            <Popconfirm
              title="确认批量删除选中的镜像？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleBatchDelete"
            >
              <Button danger :disabled="selectedRowKeys.length === 0">
                <template #icon><Trash2 class="size-4" /></template>
                批量删除
              </Button>
            </Popconfirm>
            <Button @click="notify('刷新成功')">刷新</Button>
          </template>

          <Table
            row-key="id"
            :data-source="rows.filter((r) => !keyword || r.name.toLowerCase().includes(keyword.toLowerCase()))"
            :pagination="false"
            :columns="[
              { title: '镜像名称', dataIndex: 'name' },
              { title: '镜像数量', dataIndex: 'count' },
              { title: '拉取次数', dataIndex: 'pulls' },
              { title: '创建时间', dataIndex: 'created' },
              { title: '更新时间', dataIndex: 'updated' },
              { title: '操作', dataIndex: 'action' },
            ]"
            :row-selection="{ selectedRowKeys, onChange: handleSelectionChange }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'name'">
                <a class="text-blue-600 hover:text-blue-700 font-semibold" @click="handleViewDetail(record)">
                  {{ record.name }}
                </a>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <Space :size="0">
                  <Popconfirm title="确认删除该镜像？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record)">
                    <a class="text-red-500">删除</a>
                  </Popconfirm>
                </Space>
              </template>
            </template>
          </Table>

          <div class="fn-list-pagination flex items-center justify-end mt-4">
            <Pagination
              v-model:current="currentPage"
              v-model:pageSize="pageSize"
              :total="rows.length"
              :show-size-changer="true"
              :show-quick-jumper="true"
              :page-size-options="['10', '20', '50', '100']"
            />
          </div>
        </ListPageLayout>
      </div>

      <!-- Image Detail View -->
      <div v-else key="detail" class="space-y-4">
        <!-- Header & Info Card -->
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

        <!-- Detail Table Card -->
        <div class="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-gray-800 dark:text-zinc-200">镜像详情</h3>
          <Table
            row-key="id"
            :data-source="detailRows"
            :columns="detailColumns"
            :pagination="false"
            :expand-icon-column-index="0"
          >
            <template #expandIcon="slotProps">
              <span v-if="(slotProps as any).record?.children && (slotProps as any).record?.children.length > 0" class="mr-2 inline-block align-middle">
                <ChevronRight
                  class="size-4 text-gray-400 cursor-pointer transition-transform duration-200"
                  :class="(slotProps as any).expanded ? 'rotate-90' : ''"
                  @click="e => (slotProps as any).onExpand((slotProps as any).record, e)"
                />
              </span>
              <span v-else class="inline-block w-6" />
            </template>

            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'name'">
                <span class="text-sm text-gray-800 dark:text-zinc-300 font-mono select-all break-all">{{ record.name }}</span>
              </template>
              <template v-if="column.dataIndex === 'tags'">
                <div class="flex flex-wrap gap-1.5">
                  <Tag v-for="tag in record.tags" :key="tag" class="rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 border-none px-2.5 py-0.5 text-xs">
                    {{ tag }}
                  </Tag>
                  <span v-if="!record.tags || record.tags.length === 0" class="text-gray-400">-</span>
                </div>
              </template>
              <template v-if="column.dataIndex === 'size'">
                <span class="text-sm text-gray-600 dark:text-zinc-400">{{ record.size }}</span>
              </template>
              <template v-if="column.dataIndex === 'address'">
                <div v-if="record.address" class="flex items-center gap-1.5">
                  <span class="text-sm text-gray-600 dark:text-zinc-400 font-mono break-all">{{ record.address }}</span>
                  <Button type="link" size="small" class="p-0 h-auto" @click="copyText(record.address)">
                    <Copy class="size-3" />
                  </Button>
                </div>
                <span v-else class="text-gray-400">-</span>
              </template>
              <template v-if="column.dataIndex === 'created'">
                <span class="text-sm text-gray-600 dark:text-zinc-400">{{ record.created }}</span>
              </template>
              <template v-if="column.dataIndex === 'action'">
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

    <!-- Create / Import Image Drawer -->
    <Drawer
      v-model:open="drawerVisible"
      placement="right"
      :width="840"
      :closable="false"
      :footer-style="{ textAlign: 'right' }"
    >
      <template #title>
        <div class="flex items-center gap-3 select-none">
          <Button type="text" class="flex items-center justify-center p-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer" @click="drawerVisible = false">
            <ArrowLeft class="size-5 text-gray-600 dark:text-zinc-400" />
          </Button>
          <span class="text-base font-bold text-gray-800 dark:text-zinc-200">创建镜像</span>
        </div>
      </template>

      <!-- Content -->
      <div class="drawer-body-container py-2">
        <!-- 模式选择 -->
        <div class="mb-6 flex justify-start">
          <Radio.Group v-model:value="isImportMode" button-style="solid">
            <Radio.Button :value="false">创建镜像</Radio.Button>
            <Radio.Button :value="true">导入镜像</Radio.Button>
          </Radio.Group>
        </div>

        <!-- 1. CREATE MODE -->
        <Form v-if="!isImportMode" layout="vertical" :model="createForm">
          <!-- 基础信息 -->
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

          <!-- 构建方式 -->
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
              <span v-else>请确保所选任务 and 实例在生成期间保持在“运行”状态。在构建完成之前，不要修改或重新启动实例。</span>
            </div>
          </FormItem>

          <!-- Based on Dockerfile -->
          <div v-if="createForm.buildType === 'Dockerfile'" class="mt-4">
            <FormItem label="Dockerfile" required>
              <div class="relative">
                <Input.TextArea
                  v-model:value="createForm.dockerfile"
                  placeholder="请输入Dockerfile内容..."
                  :rows="12"
                  class="font-mono bg-slate-900 text-slate-100 p-4 rounded-lg focus:bg-slate-900 border-none select-text"
                />
                <div class="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer bg-slate-800 p-1 rounded">
                  <Expand class="size-4" />
                </div>
              </div>
            </FormItem>
          </div>

          <!-- Based on DevBox -->
          <div v-else-if="createForm.buildType === 'DevBox'" class="mt-4 space-y-4">
            <FormItem label="开发机名称" required>
              <Select v-model:value="createForm.devboxName" :options="devboxOptions" placeholder="请选择" style="width: 480px" />
            </FormItem>
            <FormItem label="暂停容器">
              <div class="flex items-center gap-3">
                <Switch v-model:checked="createForm.pauseContainer" />
                <span class="text-sm text-gray-500 dark:text-zinc-400">暂停</span>
              </div>
              <div class="text-xs text-gray-400 dark:text-zinc-500 mt-1 flex items-start gap-1">
                <Info class="size-3.5 mt-0.5 text-blue-500" />
                <span>打包时会暂停容器，避免打包后的镜像文件系统数据不一致</span>
              </div>
            </FormItem>
          </div>

          <!-- Based on Task -->
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
              <div class="text-xs text-gray-400 dark:text-zinc-500 mt-1 flex items-start gap-1">
                <Info class="size-3.5 mt-0.5 text-blue-500" />
                <span>打包时会暂停容器，避免打包后的镜像文件系统数据不一致</span>
              </div>
            </FormItem>
          </div>
        </Form>

        <!-- 2. IMPORT MODE -->
        <Form v-else layout="vertical" :model="importForm">
          <!-- 基础信息 -->
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

          <!-- 地址拼接 -->
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
          <Button @click="drawerVisible = false">取消</Button>
          <Button type="primary" @click="handleSave">确认</Button>
        </Space>
      </template>
    </Drawer>
  </div>
</template>

<style scoped>
/* Page Transition Animations */
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
