<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { computed, ref } from 'vue';
import {
  Button, Divider, Form, FormItem, Input, Pagination, Popconfirm, Progress, Segmented, Space, Table, Tag, message,  } from 'ant-design-vue';
import { Download, Plus, Search, Trash2 } from '@vben/icons';
import ListPageLayout from '#/components/business/list-page-layout.vue';

const ownership = ref('all');
const filterModelId = ref<string>('');
const filterModelName = ref<string>('');
const pageSize = ref(10);
const currentPage = ref(1);
const selectedRowKeys = ref<any[]>([]);

// 导入模型抽屉
const importForm = ref({
  name: '',
  description: '',
  version: 'v1',
  storageType: 'share', // 'share' | 's3'
  modelPath: '',
  accessKey: '',
  secretKey: '',
  s3Address: '',
  versionDescription: ''
});

// 新建版本抽屉
const selectedModel = ref<any>(null);
const versionForm = ref({
  version: 'V2',
  storageType: 'share',
  modelPath: '',
  versionDescription: '',
});

const columns: any[] = [
  { title: '名称/ID', dataIndex: 'name', width: 200 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '上传进度', dataIndex: 'progress', width: 120 },
  { title: '最新版本', dataIndex: 'version', width: 100 },
  { title: '更新时间', dataIndex: 'updated', width: 160 },
  { title: '用户', dataIndex: 'user', width: 120 },
  { title: '操作', dataIndex: 'action', width: 180, fixed: 'right' },
];

const currentUser = 'test01';

const dataSource = ref([
  {
    id: 1,
    name: 'MyQwen-Finetuned',
    status: '已完成',
    progress: 100,
    version: 'v0.3',
    updated: '2026-05-24 15:20',
    user: 'test01',
  },
  {
    id: 2,
    name: 'Custom-Llama3-Chat',
    status: '上传中',
    progress: 45,
    version: 'v0.1',
    updated: '2026-05-23 09:15',
    user: 'test01',
  },
  {
    id: 3,
    name: 'MyGLM-LoRA',
    status: '已完成',
    progress: 100,
    version: 'v0.2',
    updated: '2026-05-22 14:00',
    user: 'admin',
  },
  {
    id: 4,
    name: 'Finance-Bot-v2',
    status: '已完成',
    progress: 100,
    version: 'v1.0',
    updated: '2026-05-21 10:30',
    user: 'test02',
  },
  {
    id: 5,
    name: 'Medical-Assistant',
    status: '上传失败',
    progress: 78,
    version: 'v0.5',
    updated: '2026-05-20 16:45',
    user: 'test01',
  },
]);

const statusConfig: Record<string, { color: string; text: string }> = {
  已完成: { color: 'success', text: '已完成' },
  上传中: { color: 'processing', text: '上传中' },
  上传失败: { color: 'error', text: '上传失败' },
};

const filteredData = computed(() => {
  let result = dataSource.value;

  if (ownership.value === 'mine') {
    result = result.filter((r) => r.user === currentUser);
  }

  if (filterModelId.value) {
    result = result.filter((r) =>
      String(r.id).includes(filterModelId.value),
    );
  }

  if (filterModelName.value) {
    result = result.filter((r) =>
      r.name.toLowerCase().includes(filterModelName.value.toLowerCase()),
    );
  }

  return result;
});

const notify = (text: string) => message.success(text);

function handleFilter() {
  currentPage.value = 1;
}

function handleReset() {
  ownership.value = 'all';
  filterModelId.value = '';
  filterModelName.value = '';
  currentPage.value = 1;
}

function handleImport() {
  importForm.value = {
    name: '',
    description: '',
    version: 'v1',
    storageType: 'share',
    modelPath: '',
    accessKey: '',
    secretKey: '',
    s3Address: '',
    versionDescription: ''
  };
  importDrawerApi.open();
}

function handleImportSave() {
  notify('导入模型成功（原型）');
  importDrawerApi.close();
}

function handleAddVersion(record: any) {
  selectedModel.value = record;
  versionForm.value = {
    version: 'V2',
    storageType: 'share',
    modelPath: '',
    versionDescription: '',
  };
  versionDrawerApi.open();
}

function handleVersionSave() {
  notify(`为模型 ${selectedModel.value?.name} 新建版本 ${versionForm.value.version} 成功`);
  versionDrawerApi.close();
}

function handleExport(record: any) {
  notify(`导出模型 ${record.name}`);
}

function handleDelete(record: any) {
  notify(`删除模型 ${record.name}`);
}

function handleBatchDelete() {
  notify(`批量删除 ${selectedRowKeys.value.length} 个模型成功`);
  selectedRowKeys.value = [];
}

const [ImportDrawer, importDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[900px]!',
  title: '导入模型',
});

const [VersionDrawer, versionDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[900px]!',
  title: '新建版本',
});
</script>

<template>
  <div>
    <ListPageLayout>
      <template #filters>
        <div class="flex flex-wrap items-center gap-4">
          <Segmented
            v-model:value="ownership"
            :options="[
              { label: '全部', value: 'all' },
              { label: '我创建的', value: 'mine' },
            ]"
          />
          <Input
            v-model:value="filterModelId"
            placeholder="模型ID"
            style="width: 120px"
            allow-clear
          />
          <Input
            v-model:value="filterModelName"
            placeholder="模型名称"
            style="width: 180px"
            allow-clear
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
        <Button type="primary" @click="handleImport">
          <template #icon>
            <Plus class="size-4" />
          </template>
          导入模型
        </Button>
        <Popconfirm
          title="确认删除选中的模型？"
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
      </template>

      <Table
        row-key="id"
        :data-source="filteredData"
        :pagination="false"
        :columns="columns"
        :row-selection="{
          selectedRowKeys,
          onChange: (keys: any[]) => (selectedRowKeys = keys),
        }"
        :scroll="{ x: 900 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <a class="text-blue-600 hover:text-blue-700 font-medium">{{ record.name }}</a>
            <div class="text-xs text-gray-400">ID: {{ record.id }}</div>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <Tag
              :color="statusConfig[record.status]?.color"
              class="rounded-full"
            >
              {{ statusConfig[record.status]?.text || record.status }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'progress'">
            <Progress
              :percent="record.progress"
              :status="
                record.status === '上传失败'
                  ? 'exception'
                  : record.status === '上传中'
                    ? 'active'
                    : 'success'
              "
              size="small"
              :show-info="true"
            />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleAddVersion(record)">
                新建版本
              </Button>
              <Button type="link" size="small" @click="handleExport(record)">
                导出
              </Button>
              <Popconfirm
                title="确认删除该模型？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <Button type="link" size="small" danger> 删除 </Button>
              </Popconfirm>
            </Space>
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
    </ListPageLayout>

    <!-- 导入模型抽屉 -->
    <ImportDrawer>
      <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label-align="left" :model="importForm">
        <!-- 基础信息 -->
        <h3 class="font-bold mb-6 text-base border-b pb-2">基础信息</h3>
        <FormItem label="模型名称" required>
          <Input v-model:value="importForm.name" placeholder="请输入模型名称" />
          <div class="text-xs text-gray-400 mt-1">
            ① 模型名称只允许输入大小写字母、-、数字和下划线
          </div>
        </FormItem>
        <FormItem label="描述">
          <Input.TextArea v-model:value="importForm.description" :rows="4" placeholder="请输入模型描述" :maxlength="1024" show-count />
        </FormItem>

        <Divider />

        <!-- 版本信息 -->
        <h3 class="font-bold mb-6 text-base border-b pb-2">版本信息</h3>
        <FormItem label="版本">
          <div class="text-gray-800 font-medium py-1">v1</div>
        </FormItem>
        <FormItem label="存储类型" required>
          <div class="flex gap-3">
            <button 
              type="button" 
              class="px-5 py-2 border rounded text-sm transition-all"
              :class="importForm.storageType === 'share' ? 'border-blue-500 text-blue-500 bg-blue-50/10 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
              @click="importForm.storageType = 'share'"
            >
              共享存储
            </button>
            <button 
              type="button" 
              class="px-5 py-2 border rounded text-sm transition-all"
              :class="importForm.storageType === 's3' ? 'border-blue-500 text-blue-500 bg-blue-50/10 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
              @click="importForm.storageType = 's3'"
            >
              S3 存储
            </button>
          </div>
        </FormItem>

        <!-- 如果是共享存储 -->
        <template v-if="importForm.storageType === 'share'">
          <FormItem label="模型地址" required>
            <Input v-model:value="importForm.modelPath" placeholder="请输入模型地址" />
            <div class="text-xs text-gray-400 mt-1 leading-relaxed">
              ① 地址为Linux绝对路径，必须是文件，扩展名必须是.zip，不能以/结尾，不能包含相对路径，如：./或../;上传文件仅支持 5 GB以内的单文件上传
            </div>
          </FormItem>
        </template>

        <!-- 如果是S3存储 -->
        <template v-else>
          <FormItem label="Access Key" required>
            <Input v-model:value="importForm.accessKey" placeholder="请输入Access Key" />
          </FormItem>
          <FormItem label="Secret Access Key" required>
            <Input v-model:value="importForm.secretKey" placeholder="请输入Secret Access Key" type="password" />
          </FormItem>
          <FormItem label="S3地址" required>
            <Input v-model:value="importForm.s3Address" placeholder="/bucketName/subPath 或 https://s3Endpoint.region.amazonaws.com/bucketName/subPath">
              <template #addonAfter>
                <span class="cursor-pointer px-1 flex items-center" @click="notify('选择文件')">
                  <svg class="size-4 text-gray-500 hover:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/></svg>
                </span>
              </template>
            </Input>
          </FormItem>
        </template>

        <FormItem label="版本描述">
          <Input.TextArea v-model:value="importForm.versionDescription" :rows="4" placeholder="请输入版本描述" :maxlength="1024" show-count />
        </FormItem>
      </Form>
      <template #footer>
        <div class="flex items-center gap-3">
          <Button type="primary" @click="handleImportSave">确认</Button>
          <Button @click="importDrawerApi.close()">取消</Button>
        </div>
      </template>
    </ImportDrawer>

    <!-- 新建版本抽屉 -->
    <VersionDrawer>
      <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label-align="left" :model="versionForm">
        <!-- 基础信息 -->
        <h3 class="font-bold mb-6 text-base border-b pb-2">基础信息</h3>
        <FormItem label="版本">
          <div class="text-gray-800 font-medium py-1">V2</div>
        </FormItem>
        <FormItem label="模型名称">
          <Input :value="selectedModel?.name || 'finetune'" disabled />
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
        <FormItem label="模型地址" required>
          <Input v-model:value="versionForm.modelPath" placeholder="请输入模型地址" />
        </FormItem>
        <FormItem label="版本描述">
          <Input.TextArea v-model:value="versionForm.versionDescription" :rows="4" placeholder="请输入版本描述" :maxlength="1024" show-count />
        </FormItem>
      </Form>
      <template #footer>
        <div class="flex items-center gap-3">
          <Button type="primary" @click="handleVersionSave">确认</Button>
          <Button @click="versionDrawerApi.close()">取消</Button>
        </div>
      </template>
    </VersionDrawer>
  </div>
</template>
