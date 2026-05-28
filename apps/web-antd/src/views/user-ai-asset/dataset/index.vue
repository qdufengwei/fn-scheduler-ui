<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { computed, ref } from 'vue';
import {
  Button,
  Divider,
  Form,
  FormItem,
  Input,
  Pagination,
  Popconfirm,
  Progress,
  Select,
  Segmented,
  Space,
  Table,
  Tag,
  message,
} from 'ant-design-vue';
import { Plus, Search, Trash2 } from '@vben/icons';
import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const ownership = ref('all');
const filterUserId = ref('all');
const filterKeyword = ref('');
const pageSize = ref(10);
const currentPage = ref(1);
const selectedRowKeys = ref<any[]>([]);

// 新建数据集抽屉
const createForm = ref({
  name: '',
  description: '',
  version: 'v1',
  storageType: 'share', // 'share' | 's3'
  path: '',
  accessKey: '',
  secretKey: '',
  s3Address: '',
  versionDescription: '',
});

// 添加版本抽屉
const selectedDataset = ref<any>(null);
const versionForm = ref({
  version: 'v2',
  storageType: 'share',
  path: '',
  versionDescription: '',
});

const columns: any[] = [
  { title: '名称/ID', dataIndex: 'name', width: 220 },
  { title: '大小', dataIndex: 'size', width: 120 },
  { title: '状态', dataIndex: 'status', width: 120 },
  { title: '上传进度', dataIndex: 'progress', width: 160 },
  { title: '最新版本', dataIndex: 'version', width: 100 },
  { title: '更新时间', dataIndex: 'updated', width: 180 },
  { title: '用户', dataIndex: 'user', width: 120 },
  { title: '操作', dataIndex: 'action', width: 160, fixed: 'right' },
];

const currentUser = 'test01';

const dataSource = ref([
  {
    id: 1,
    name: 'LLaVA-Pretrain-Dataset',
    size: '180 GB',
    status: '已完成',
    progress: 100,
    version: 'v1.0',
    updated: '2026-05-25 16:30',
    user: 'test01',
  },
  {
    id: 2,
    name: 'Medical-Image-Segmentation',
    size: '850 GB',
    status: '上传中',
    progress: 68,
    version: 'v0.2',
    updated: '2026-05-24 11:15',
    user: 'test01',
  },
  {
    id: 3,
    name: 'Financial-Sentiment-Corpus',
    size: '45 GB',
    status: '上传失败',
    progress: 88,
    version: 'v1.1',
    updated: '2026-05-23 09:40',
    user: 'admin',
  },
  {
    id: 4,
    name: 'Autonomous-Driving-Video-Logs',
    size: '3.2 TB',
    status: '已完成',
    progress: 100,
    version: 'v2.0',
    updated: '2026-05-22 18:22',
    user: 'test02',
  },
]);

const statusConfig: Record<string, { color: string; text: string }> = {
  已完成: { color: 'success', text: '已完成' },
  上传中: { color: 'processing', text: '上传中' },
  上传失败: { color: 'error', text: '上传失败' },
};

const userOptions = [
  { label: '全部用户', value: 'all' },
  { label: 'test01', value: 'test01' },
  { label: 'test02', value: 'test02' },
  { label: 'admin', value: 'admin' },
];

const filteredData = computed(() => {
  let result = dataSource.value;

  if (ownership.value === 'mine') {
    result = result.filter((r) => r.user === currentUser);
  }

  if (filterUserId.value !== 'all') {
    result = result.filter((r) => r.user === filterUserId.value);
  }

  if (filterKeyword.value) {
    const kw = filterKeyword.value.toLowerCase();
    result = result.filter(
      (r) => r.name.toLowerCase().includes(kw) || String(r.id).includes(kw),
    );
  }

  return result;
});

function handleFilter() {
  currentPage.value = 1;
}

function handleReset() {
  ownership.value = 'all';
  filterUserId.value = 'all';
  filterKeyword.value = '';
  currentPage.value = 1;
}

function handleSelectionChange(keys: any[]) {
  selectedRowKeys.value = keys;
}

function handleDelete(record: any) {
  dataSource.value = dataSource.value.filter((item) => item.id !== record.id);
  showNotify(`删除数据集 ${record.name} 成功`);
}

function handleBatchDelete() {
  dataSource.value = dataSource.value.filter(
    (item) => !selectedRowKeys.value.includes(item.id),
  );
  showNotify(`批量删除 ${selectedRowKeys.value.length} 个数据集成功`);
  selectedRowKeys.value = [];
}

function handleCreateDataset() {
  createForm.value = {
    name: '',
    description: '',
    version: 'v1',
    storageType: 'share',
    path: '',
    accessKey: '',
    secretKey: '',
    s3Address: '',
    versionDescription: '',
  };
  createDrawerApi.open();
}

function handleCreateSave() {
  if (!createForm.value.name) {
    message.warning('请输入数据集名称');
    return;
  }
  if (createForm.value.storageType === 'share' && !createForm.value.path) {
    message.warning('请输入数据集地址');
    return;
  }
  if (
    createForm.value.storageType === 's3' &&
    (!createForm.value.accessKey ||
      !createForm.value.secretKey ||
      !createForm.value.s3Address)
  ) {
    message.warning('请填写S3配置');
    return;
  }

  const newId = dataSource.value.length
    ? Math.max(...dataSource.value.map((item) => item.id)) + 1
    : 1;
  const now = new Date();
  const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  dataSource.value.push({
    id: newId,
    name: createForm.value.name,
    size: '0 GB',
    status: '已完成',
    progress: 100,
    version: createForm.value.version || 'v1.0',
    updated: formatTime,
    user: currentUser,
  });

  showNotify(`创建数据集 ${createForm.value.name} 成功`);
  createDrawerApi.close();
}

function handleAddVersion(record: any) {
  selectedDataset.value = record;
  const currentVer = record.version;
  const majorNum = parseInt(currentVer.replace(/[^0-9]/g, '')) || 1;
  versionForm.value = {
    version: `v${(majorNum + 0.1).toFixed(1)}`,
    storageType: 'share',
    path: '',
    versionDescription: '',
  };
  versionDrawerApi.open();
}

function handleVersionSave() {
  if (!versionForm.value.path) {
    message.warning('请输入数据集地址');
    return;
  }

  const record = dataSource.value.find(
    (item) => item.id === selectedDataset.value.id,
  );
  if (record) {
    record.version = versionForm.value.version;
    const now = new Date();
    record.updated = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    showNotify(
      `为数据集 ${record.name} 添加版本 ${versionForm.value.version} 成功`,
    );
  }
  versionDrawerApi.close();
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[900px]!',
  title: '新建数据集',
});

const [VersionDrawer, versionDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[900px]!',
  title: '添加版本',
});
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <div class="flex flex-wrap items-center gap-4">
        <Segmented
          v-model:value="ownership"
          :options="[
            { label: '全部', value: 'all' },
            { label: '我创建的', value: 'mine' },
          ]"
          @change="handleFilter"
        />
        <Select
          v-model:value="filterUserId"
          :options="userOptions"
          style="width: 150px"
          placeholder="选择用户"
          @change="handleFilter"
        />
        <Input
          v-model:value="filterKeyword"
          placeholder="ID 或 名称"
          style="width: 240px"
          allow-clear
          @press-enter="handleFilter"
        >
          <template #prefix>
            <Search class="size-4 text-gray-400" />
          </template>
        </Input>
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary" @click="handleFilter">筛选</Button>
        <Button @click="handleReset">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button type="primary" @click="handleCreateDataset">
        <template #icon>
          <Plus class="size-4" />
        </template>
        新建数据集
      </Button>
      <Popconfirm
        title="确认批量删除选中的数据集吗？"
        ok-text="确认"
        cancel-text="取消"
        @confirm="handleBatchDelete"
      >
        <Button danger :disabled="selectedRowKeys.length === 0">
          <template #icon>
            <Trash2 class="size-4" />
          </template>
          批量删除
        </Button>
      </Popconfirm>
      <Button @click="showNotify('刷新成功')">刷新</Button>
    </template>

    <Table
      row-key="id"
      :data-source="filteredData"
      :pagination="false"
      :columns="columns"
      :row-selection="{
        selectedRowKeys,
        onChange: handleSelectionChange,
      }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <div class="flex flex-col">
            <span class="font-medium text-gray-900 dark:text-zinc-100">{{
              record.name
            }}</span>
            <span class="text-xs text-gray-400 dark:text-zinc-500"
              >ID: {{ record.id }}</span
            >
          </div>
        </template>

        <template v-if="column.dataIndex === 'status'">
          <Tag :color="statusConfig[record.status]?.color" class="rounded-full">
            {{ statusConfig[record.status]?.text || record.status }}
          </Tag>
        </template>

        <template v-if="column.dataIndex === 'progress'">
          <div class="flex items-center gap-2">
            <Progress
              :percent="record.progress"
              :status="
                record.status === '上传失败'
                  ? 'exception'
                  : record.progress === 100
                    ? 'success'
                    : 'active'
              "
              size="small"
              style="width: 100px"
              :show-info="false"
            />
            <span class="text-xs text-gray-500">{{ record.progress }}%</span>
          </div>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <div class="flex items-center gap-1">
            <Button type="link" size="small" @click="handleAddVersion(record)"
              >添加版本</Button
            >
            <Popconfirm
              title="确认删除该数据集吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <Button type="link" size="small" danger>删除</Button>
            </Popconfirm>
          </div>
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="filteredData.length"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>

    <!-- 新建数据集抽屉 -->
    <CreateDrawer>
      <Form
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        label-align="left"
        :model="createForm"
      >
        <!-- 基础信息 -->
        <h3
          class="font-bold mb-6 text-base border-b pb-2 text-gray-900 dark:text-zinc-150"
        >
          基础信息
        </h3>
        <FormItem label="数据集名称" required>
          <Input
            v-model:value="createForm.name"
            placeholder="请输入数据集名称"
          />
          <div class="text-xs text-gray-400 mt-1">
            ① 名称只允许输入大小写字母、-、数字和下划线
          </div>
        </FormItem>
        <FormItem label="描述">
          <Input.TextArea
            v-model:value="createForm.description"
            :rows="4"
            placeholder="请输入数据集描述"
            :maxlength="1024"
            show-count
          />
        </FormItem>

        <Divider />

        <!-- 版本信息 -->
        <h3
          class="font-bold mb-6 text-base border-b pb-2 text-gray-900 dark:text-zinc-150"
        >
          版本信息
        </h3>
        <FormItem label="版本">
          <div class="text-gray-800 dark:text-zinc-300 font-medium py-1">
            v1
          </div>
        </FormItem>
        <FormItem label="存储类型" required>
          <div class="flex gap-3">
            <button
              type="button"
              class="px-5 py-2 border rounded text-sm transition-all"
              :class="
                createForm.storageType === 'share'
                  ? 'border-blue-500 text-blue-500 bg-blue-50/10 font-medium'
                  : 'border-gray-200 text-gray-600 dark:text-zinc-400 dark:border-zinc-800 hover:border-gray-300'
              "
              @click="createForm.storageType = 'share'"
            >
              共享存储
            </button>
            <button
              type="button"
              class="px-5 py-2 border rounded text-sm transition-all"
              :class="
                createForm.storageType === 's3'
                  ? 'border-blue-500 text-blue-500 bg-blue-50/10 font-medium'
                  : 'border-gray-200 text-gray-600 dark:text-zinc-400 dark:border-zinc-800 hover:border-gray-300'
              "
              @click="createForm.storageType = 's3'"
            >
              S3 存储
            </button>
          </div>
        </FormItem>

        <!-- 如果是共享存储 -->
        <template v-if="createForm.storageType === 'share'">
          <FormItem label="数据集地址" required>
            <Input
              v-model:value="createForm.path"
              placeholder="请输入数据集地址"
            />
            <div class="text-xs text-gray-400 mt-1 leading-relaxed">
              ① 地址为Linux绝对路径，必须是文件或目录，例如
              /data/dataset/corpus.zip
            </div>
          </FormItem>
        </template>

        <!-- 如果是S3存储 -->
        <template v-else>
          <FormItem label="Access Key" required>
            <Input
              v-model:value="createForm.accessKey"
              placeholder="请输入Access Key"
            />
          </FormItem>
          <FormItem label="Secret Access Key" required>
            <Input
              v-model:value="createForm.secretKey"
              placeholder="请输入Secret Access Key"
              type="password"
            />
          </FormItem>
          <FormItem label="S3地址" required>
            <Input
              v-model:value="createForm.s3Address"
              placeholder="/bucketName/subPath 或 https://s3Endpoint.region.amazonaws.com/bucketName/subPath"
            />
          </FormItem>
        </template>

        <FormItem label="版本描述">
          <Input.TextArea
            v-model:value="createForm.versionDescription"
            :rows="4"
            placeholder="请输入版本描述"
            :maxlength="1024"
            show-count
          />
        </FormItem>
      </Form>
      <template #footer>
        <div class="flex items-center gap-3 justify-end">
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button type="primary" @click="handleCreateSave">确认</Button>
        </div>
      </template>
    </CreateDrawer>

    <!-- 添加版本抽屉 -->
    <VersionDrawer>
      <Form
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        label-align="left"
        :model="versionForm"
      >
        <!-- 基础信息 -->
        <h3
          class="font-bold mb-6 text-base border-b pb-2 text-gray-900 dark:text-zinc-150"
        >
          基础信息
        </h3>
        <FormItem label="版本">
          <div class="text-gray-800 dark:text-zinc-300 font-medium py-1">
            {{ versionForm.version }}
          </div>
        </FormItem>
        <FormItem label="数据集名称">
          <Input :value="selectedDataset?.name || ''" disabled />
        </FormItem>
        <FormItem label="存储类型" required>
          <div class="flex gap-3">
            <button
              type="button"
              class="px-5 py-1.5 border border-blue-500 text-blue-500 rounded bg-blue-50/10 font-medium text-sm cursor-default"
            >
              共享存储
            </button>
          </div>
        </FormItem>
        <FormItem label="数据集地址" required>
          <Input
            v-model:value="versionForm.path"
            placeholder="请输入数据集绝对地址"
          />
        </FormItem>
        <FormItem label="版本描述">
          <Input.TextArea
            v-model:value="versionForm.versionDescription"
            :rows="4"
            placeholder="请输入版本描述"
            :maxlength="1024"
            show-count
          />
        </FormItem>
      </Form>
      <template #footer>
        <div class="flex items-center gap-3 justify-end">
          <Button @click="versionDrawerApi.close()">取消</Button>
          <Button type="primary" @click="handleVersionSave">确认</Button>
        </div>
      </template>
    </VersionDrawer>
  </ListPageLayout>
</template>
