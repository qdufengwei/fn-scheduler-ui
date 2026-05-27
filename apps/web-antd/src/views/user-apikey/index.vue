<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { Button, Checkbox, DatePicker, Dropdown, Form, FormItem, Input, Menu, Modal, Pagination, Popconfirm, Radio, Select, Space, Table, Tag, message } from 'ant-design-vue';
import { ref, computed } from 'vue';
import { Plus, Trash2, Copy, Info, LockKeyhole, Check, Inbox } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

interface BoundTask {
  tenant: string;
  taskName: string;
}

interface ApiKey {
  id: string;
  name: string;
  permissions: string[];
  expireType: 'never' | 'custom';
  expireDate: string | null;
  status: '运行' | '禁用';
  owner: string;
  created: string;
  lastUsed: string;
  boundTasks: BoundTask[];
}

const isEdit = ref(false);
const keyword = ref('');
const userFilter = ref<string>();
const currentPage = ref(1);
const pageSize = ref(10);

const form = ref({
  id: '',
  name: '',
  permissions: [] as string[],
  expireType: 'never' as 'never' | 'custom',
  expireDate: undefined as string | undefined,
  boundTasks: [] as Array<{ tenant: string | undefined, taskName: string | undefined }>
});

// Mock task database
const tenantOptions = [
  { label: 'test01', value: 'test01' },
  { label: '租户A', value: '租户A' },
  { label: '租户B', value: '租户B' }
];

const taskOptionsMap: Record<string, Array<{ label: string, value: string }>> = {
  test01: [
    { label: 'qwen2.5-inference-01', value: 'qwen2.5-inference-01' },
    { label: 'deepseek-v3-infer-task', value: 'deepseek-v3-infer-task' },
    { label: 'chatglm4-web-service', value: 'chatglm4-web-service' }
  ],
  租户A: [
    { label: 'llama3-eval-infer', value: 'llama3-eval-infer' },
    { label: 'stable-diffusion-task', value: 'stable-diffusion-task' }
  ],
  租户B: [
    { label: 'resnet-ocr-service', value: 'resnet-ocr-service' }
  ]
};

const rows = ref<ApiKey[]>([
  {
    id: 'ak_live_001',
    name: 'default-infer',
    permissions: ['推理服务：读取', '推理服务：写入/执行'],
    expireType: 'never',
    expireDate: null,
    status: '运行',
    owner: 'test01',
    created: '2026-05-21 10:24:15',
    lastUsed: '2026-05-26 14:02:11',
    boundTasks: [
      { tenant: 'test01', taskName: 'qwen2.5-inference-01' },
      { tenant: 'test01', taskName: 'deepseek-v3-infer-task' }
    ]
  },
  {
    id: 'ak_test_002',
    name: 'tmp-key',
    permissions: ['推理服务：读取'],
    expireType: 'custom',
    expireDate: '2026-06-30 23:59:59',
    status: '禁用',
    owner: 'test01',
    created: '2026-05-01 08:12:30',
    lastUsed: '-',
    boundTasks: []
  },
  {
    id: 'ak_live_003',
    name: 'train-key',
    permissions: ['推理服务：读取', '推理服务：写入/执行'],
    expireType: 'never',
    expireDate: null,
    status: '运行',
    owner: 'test02',
    created: '2026-05-15 16:45:00',
    lastUsed: '2026-05-25 19:33:04',
    boundTasks: [
      { tenant: 'test01', taskName: 'chatglm4-web-service' }
    ]
  }
]);

const notify = (text: string) => message.success(text);

const resetFilters = () => {
  keyword.value = '';
  userFilter.value = undefined;
  currentPage.value = 1;
};

const handleSearch = () => {
  currentPage.value = 1;
};

// Filtered data calculation
const filteredData = computed(() => {
  return rows.value.filter((item) => {
    const matchKeyword = !keyword.value || 
      item.name.toLowerCase().includes(keyword.value.toLowerCase()) || 
      item.id.toLowerCase().includes(keyword.value.toLowerCase());
    const matchUser = !userFilter.value || item.owner === userFilter.value;
    return matchKeyword && matchUser;
  });
});

// Paginated data for display
const displayedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.value.slice(start, end);
});

// Stats counters
const totalKeys = computed(() => rows.value.length);
const activeKeys = computed(() => rows.value.filter(r => r.status === '运行').length);

function handleToggleStatus(record: any) {
  record.status = record.status === '运行' ? '禁用' : '运行';
  notify(`${record.status === '运行' ? '启用' : '禁用'} API KEY ${record.name} 成功`);
}

function handleCreate() {
  isEdit.value = false;
  form.value = {
    id: '',
    name: '',
    permissions: [] as string[],
    expireType: 'never',
    expireDate: undefined,
    boundTasks: []
  };
  createDrawerApi.open();
}

function handleEdit(record: any) {
  isEdit.value = true;
  form.value = {
    id: record.id,
    name: record.name,
    permissions: [...record.permissions],
    expireType: record.expireType,
    expireDate: record.expireDate || undefined,
    boundTasks: record.boundTasks.map((t: any) => ({ tenant: t.tenant, taskName: t.taskName }))
  };
  createDrawerApi.open();
}

function handleDelete(record: any) {
  rows.value = rows.value.filter(item => item.id !== record.id);
  notify(`删除 API KEY ${record.name} 成功`);
}

// Modal logic for bound tasks view
const tasksModalVisible = ref(false);
const selectedKeyForTasks = ref<ApiKey | null>(null);

function handleViewTasks(record: any) {
  selectedKeyForTasks.value = record;
  tasksModalVisible.value = true;
}

// Permission checkbox computed bindings
const permRead = computed({
  get: () => form.value.permissions.includes('推理服务：读取'),
  set: (val) => {
    if (val) {
      if (!form.value.permissions.includes('推理服务：读取')) {
        form.value.permissions.push('推理服务：读取');
      }
    } else {
      form.value.permissions = form.value.permissions.filter(p => p !== '推理服务：读取');
    }
  }
});

const permWrite = computed({
  get: () => form.value.permissions.includes('推理服务：写入/执行'),
  set: (val) => {
    if (val) {
      if (!form.value.permissions.includes('推理服务：写入/执行')) {
        form.value.permissions.push('推理服务：写入/执行');
      }
    } else {
      form.value.permissions = form.value.permissions.filter(p => p !== '推理服务：写入/执行');
    }
  }
});

function getTasksForTenant(tenant: string | undefined) {
  if (!tenant) return [];
  return taskOptionsMap[tenant] || [];
}

function addBoundTask() {
  form.value.boundTasks.push({ tenant: undefined, taskName: undefined });
}

function removeBoundTask(index: number) {
  form.value.boundTasks.splice(index, 1);
}

function handleSave() {
  if (!form.value.name) {
    message.warning('请输入API KEY名称');
    return;
  }
  if (form.value.permissions.length === 0) {
    message.warning('请选择权限设置');
    return;
  }
  if (form.value.expireType === 'custom' && !form.value.expireDate) {
    message.warning('请选择自定义有效期过期时间');
    return;
  }
  
  // Verify bound tasks fields
  for (const t of form.value.boundTasks) {
    if (!t.tenant || !t.taskName) {
      message.warning('请完整选择绑定的租户和推理任务，或删除未完成的任务行');
      return;
    }
  }

  if (isEdit.value) {
    const idx = rows.value.findIndex(item => item.id === form.value.id);
    if (idx !== -1) {
      const current = rows.value[idx]!;
      rows.value[idx] = {
        id: current.id,
        name: form.value.name,
        permissions: [...form.value.permissions],
        expireType: form.value.expireType,
        expireDate: form.value.expireType === 'custom' ? (form.value.expireDate ?? null) : null,
        status: current.status,
        owner: current.owner,
        created: current.created,
        lastUsed: current.lastUsed,
        boundTasks: form.value.boundTasks.map(t => ({ tenant: t.tenant!, taskName: t.taskName! }))
      };
      notify(`编辑 API KEY [${form.value.name}] 成功`);
    }
  } else {
    const newId = `ak_live_${String(rows.value.length + 1).padStart(3, '0')}`;
    const now = new Date();
    const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    rows.value.push({
      id: newId,
      name: form.value.name,
      permissions: [...form.value.permissions],
      expireType: form.value.expireType,
      expireDate: form.value.expireType === 'custom' ? (form.value.expireDate ?? null) : null,
      status: '运行',
      owner: 'test01',
      created: formatTime,
      lastUsed: '-',
      boundTasks: form.value.boundTasks.map(t => ({ tenant: t.tenant!, taskName: t.taskName! }))
    });
    notify(`创建 API KEY [${form.value.name}] 成功`);
  }
  createDrawerApi.close();
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  notify('已成功复制 API KEY ID 到剪贴板');
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[720px]!',
  title: '',
});
</script>

<template>
  <div>
    <ListPageLayout>
      <!-- Top stats indicators -->
      <template #before>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1 -->
          <div class="flex items-center justify-between p-4 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md">
            <div class="flex flex-col">
              <span class="text-xs text-gray-500 dark:text-zinc-400 font-medium">API KEY总数</span>
              <span class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ totalKeys }}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-500">
              <LockKeyhole class="size-6" />
            </div>
          </div>
          <!-- Card 2 -->
          <div class="flex items-center justify-between p-4 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md">
            <div class="flex flex-col">
              <span class="text-xs text-gray-500 dark:text-zinc-400 font-medium">活跃API KEY</span>
              <span class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ activeKeys }}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-500">
              <Check class="size-6" />
            </div>
          </div>
          <!-- Card 3 -->
          <div class="flex items-center justify-between p-4 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md">
            <div class="flex flex-col">
              <span class="text-xs text-gray-500 dark:text-zinc-400 font-medium">最近 30 天调用</span>
              <span class="text-2xl font-bold text-gray-900 dark:text-white mt-1">0</span>
            </div>
            <div class="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-500">
              <Inbox class="size-6" />
            </div>
          </div>
          <!-- Card 4 -->
          <div class="flex items-center justify-between p-4 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md">
            <div class="flex flex-col">
              <span class="text-xs text-gray-500 dark:text-zinc-400 font-medium">平均延迟</span>
              <span class="text-2xl font-bold text-gray-900 dark:text-white mt-1">0 <span class="text-sm font-normal text-gray-500 dark:text-zinc-400">毫秒</span></span>
            </div>
            <div class="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-500">
              <Info class="size-6" />
            </div>
          </div>
        </div>
      </template>

      <!-- Filters -->
      <template #filters>
        <div class="flex flex-wrap items-center gap-4">
          <Input
            v-model:value="keyword"
            placeholder="搜索API KEY名称/ID"
            style="width: 220px"
            allow-clear
            @press-enter="handleSearch"
          />
          <Select
            v-model:value="userFilter"
            allow-clear
            style="width: 180px"
            :options="[{ label: 'test01', value: 'test01' }, { label: 'test02', value: 'test02' }]"
            placeholder="请选择所属用户"
            @change="handleSearch"
          />
        </div>
      </template>

      <template #filterActions>
        <Space>
          <Button type="primary" @click="handleSearch">筛选</Button>
          <Button @click="resetFilters">重置</Button>
        </Space>
      </template>

      <!-- List Toolbar -->
      <template #toolbar>
        <Button type="primary" @click="handleCreate">
          <template #icon><Plus class="size-4" /></template>
          创建API KEY
        </Button>
        <Button @click="notify('刷新成功')">刷新</Button>
      </template>

      <!-- Table View -->
      <Table
        row-key="id"
        :data-source="displayedData"
        :pagination="false"
        :columns="[
          { title: '名称/ID', dataIndex: 'name' },
          { title: '权限', dataIndex: 'permissions' },
          { title: '状态', dataIndex: 'status' },
          { title: '所属用户', dataIndex: 'owner' },
          { title: '创建时间', dataIndex: 'created' },
          { title: '最近使用时间', dataIndex: 'lastUsed' },
          { title: '绑定推理任务数量', dataIndex: 'boundTasksCount' },
          { title: '操作', dataIndex: 'action', width: 180 }
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <div class="flex flex-col">
              <span class="font-medium text-gray-900 dark:text-zinc-100">{{ record.name }}</span>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="text-xs text-gray-400 dark:text-zinc-500 font-mono">{{ record.id }}</span>
                <Button type="link" size="small" class="!p-0 h-auto flex items-center" @click="copyToClipboard(record.id)">
                  <Copy class="size-3 text-gray-400 hover:text-blue-500" />
                </Button>
              </div>
            </div>
          </template>

          <template v-if="column.dataIndex === 'permissions'">
            <div class="flex flex-wrap gap-1">
              <Tag v-for="perm in record.permissions" :key="perm" color="blue" class="!rounded-full text-xs">
                {{ perm }}
              </Tag>
            </div>
          </template>

          <template v-if="column.dataIndex === 'status'">
            <Tag :color="record.status === '运行' ? 'success' : 'default'" class="!rounded-full">
              {{ record.status }}
            </Tag>
          </template>

          <template v-if="column.dataIndex === 'boundTasksCount'">
            <span class="font-medium text-gray-700 dark:text-zinc-300">
              {{ record.boundTasks.length }}
            </span>
          </template>

          <template v-if="column.dataIndex === 'action'">
            <Space :size="12">
              <a
                @click="handleToggleStatus(record)"
                :class="record.status === '运行' ? 'text-amber-500 hover:text-amber-600' : 'text-green-500 hover:text-green-600'"
              >
                {{ record.status === '运行' ? '禁用' : '启用' }}
              </a>
              <a @click="handleEdit(record)">编辑</a>
              <Dropdown>
                <a class="flex items-center text-gray-500 hover:text-gray-700">更多</a>
                <template #overlay>
                  <Menu>
                    <Menu.Item key="viewTasks" @click="handleViewTasks(record)">查看绑定推理任务</Menu.Item>
                    <Menu.Item key="delete">
                      <Popconfirm title="确认删除该API KEY？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record)">
                        <span class="text-red-500">删除</span>
                      </Popconfirm>
                    </Menu.Item>
                  </Menu>
                </template>
              </Dropdown>
            </Space>
          </template>
        </template>
      </Table>

      <!-- Pagination fused bottom bar -->
      <div class="fn-list-pagination flex items-center justify-end">
        <Pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="filteredData.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['10', '20', '50', '100']"
          @change="currentPage = $event"
        />
      </div>
    </ListPageLayout>

    <!-- Create/Edit API Key Drawer -->
    <CreateDrawer>
      <template #title>{{ isEdit ? '编辑API KEY' : '创建API KEY' }}</template>
      <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label-align="left" class="py-4">
        <!-- API KEY名称 -->
        <FormItem label="API KEY名称" required>
          <Input v-model:value="form.name" placeholder="请输入API KEY名称" style="width: 480px" />
        </FormItem>
        
        <!-- 权限设置 -->
        <FormItem label="权限设置" required>
          <div class="flex flex-col gap-2 pt-1.5">
            <Checkbox v-model:checked="permRead">推理服务：读取</Checkbox>
            <Checkbox v-model:checked="permWrite">推理服务：写入/执行</Checkbox>
          </div>
          <div class="text-xs text-gray-400 mt-2.5 flex items-start gap-1.5 bg-neutral-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-solid border-neutral-100 dark:border-neutral-800" style="width: 480px">
            <Info class="size-3.5 mt-0.5 text-gray-500 shrink-0" />
            <span>您只能设置自己已有的权限功能。如需更多权限，请联系管理员</span>
          </div>
        </FormItem>

        <!-- API KEY有效期 -->
        <FormItem label="API KEY有效期">
          <Radio.Group v-model:value="form.expireType" class="pt-1.5">
            <Radio value="never">永不过期</Radio>
            <Radio value="custom">自定义有效期</Radio>
          </Radio.Group>
          <div v-if="form.expireType === 'custom'" class="mt-3">
            <DatePicker
              v-model:value="form.expireDate"
              placeholder="过期时间"
              show-time
              style="width: 260px"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </div>
        </FormItem>

        <!-- 绑定推理任务 -->
        <FormItem label="绑定推理任务">
          <div class="border border-solid border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50/20 dark:bg-zinc-950/20 max-w-[560px]">
            <div v-if="form.boundTasks.length === 0" class="text-sm text-gray-400 mb-3 text-center py-4">
              暂无绑定推理任务
            </div>
            <div v-for="(task, index) in form.boundTasks" :key="index" class="flex items-center gap-2 mb-3">
              <Select
                v-model:value="task.tenant"
                placeholder="请选择租户"
                class="w-[180px]"
                :options="tenantOptions"
                @change="task.taskName = undefined"
              />
              <Select
                v-model:value="task.taskName"
                placeholder="请选择推理任务"
                class="w-[240px]"
                :options="getTasksForTenant(task.tenant)"
                :disabled="!task.tenant"
              />
              <Button type="text" danger class="flex items-center justify-center p-1" @click="removeBoundTask(index)">
                <template #icon><Trash2 class="size-4" /></template>
              </Button>
            </div>
            <div class="border-t border-solid border-neutral-100 dark:border-neutral-800/80 pt-3">
              <Button type="link" class="!p-0 flex items-center gap-1.5 text-blue-600 hover:text-blue-700" @click="addBoundTask">
                <template #icon><Plus class="size-3.5" /></template>
                添加任务
              </Button>
            </div>
          </div>
        </FormItem>
      </Form>
      <template #footer>
        <div class="flex items-center justify-end gap-3 pr-4">
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button type="primary" @click="handleSave">确认</Button>
        </div>
      </template>
    </CreateDrawer>

    <!-- Bound Tasks View Modal -->
    <Modal
      v-model:open="tasksModalVisible"
      :title="selectedKeyForTasks ? 'API KEY [' + selectedKeyForTasks.name + '] 绑定推理任务' : ''"
      :footer="null"
      :width="540"
    >
      <div class="py-4">
        <Table
          row-key="taskName"
          :data-source="selectedKeyForTasks?.boundTasks || []"
          :pagination="false"
          :columns="[
            { title: '租户', dataIndex: 'tenant' },
            { title: '推理任务名称', dataIndex: 'taskName' }
          ]"
          size="small"
        >
          <template #emptyText>
            <div class="py-8 text-center text-gray-400">未绑定任何推理任务</div>
          </template>
        </Table>
      </div>
    </Modal>
  </div>
</template>
