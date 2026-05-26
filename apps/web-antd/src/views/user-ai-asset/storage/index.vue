<script setup lang="ts">
import { ref } from 'vue';
import {
  Button,
  Drawer,
  Form,
  FormItem,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Progress,
  Select,
  Table,
  Tag,
  message,
} from 'ant-design-vue';
import { ChevronLeft, Plus, Trash2 } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const visible = ref(false);
const pageSize = ref(10);
const currentPage = ref(1);
const selectedRowKeys = ref<number[]>([]);

const addForm = ref({
  region: undefined,
  type: undefined,
  name: '',
  capacity: '',
  unit: 'GB',
});

const updateVisible = ref(false);
const updateForm = ref({
  id: null,
  name: '',
  capacity: '',
  unit: 'GB',
});

const regionOptions = [
  { label: '北京一区', value: 'bj-01' },
  { label: '上海一区', value: 'sh-01' },
  { label: '广州一区', value: 'gz-01' },
];

const typeOptions = [
  { label: 'NFS', value: 'NFS' },
  { label: 'Ceph', value: 'Ceph' },
  { label: 'Local', value: 'Local' },
];

const columns = [
  { title: '名称', dataIndex: 'name', width: 220 },
  { title: '类型', dataIndex: 'type', width: 120 },
  { title: '使用情况', dataIndex: 'usage', width: 220 },
  { title: '容量', dataIndex: 'capacity', width: 120 },
  { title: '状态', dataIndex: 'status', width: 120 },
  { title: '创建时间', dataIndex: 'created', width: 180 },
  { title: '操作', dataIndex: 'action', width: 150 },
];

const dataSource = ref([
  {
    id: 1,
    name: 'train-data-pvc',
    type: 'NFS',
    used: 5,
    capacity: 10,
    status: '已绑定',
    created: '2026-03-03 02:24:23',
  },
  {
    id: 2,
    name: 'model-cache',
    type: 'NFS',
    used: 2,
    capacity: 5,
    status: '已绑定',
    created: '2026-05-22 12:02:00',
  },
  {
    id: 3,
    name: 'dataset-storage',
    type: 'NFS',
    used: 0,
    capacity: 20,
    status: '可用',
    created: '2026-05-20 09:15:30',
  },
  {
    id: 4,
    name: 'inference-output',
    type: 'Ceph',
    used: 8,
    capacity: 10,
    status: '已绑定',
    created: '2026-05-18 14:30:00',
  },
]);

const statusConfig: Record<string, { color: string }> = {
  已绑定: { color: 'success' },
  可用: { color: 'processing' },
};

const notify = (text: string) => message.success(text);

function handleDelete(record: any) {
  dataSource.value = dataSource.value.filter((item) => item.id !== record.id);
  notify(`删除存储卷 ${record.name} 成功`);
}

function handleBatchDelete() {
  dataSource.value = dataSource.value.filter((item) => !selectedRowKeys.value.includes(item.id));
  notify(`批量删除 ${selectedRowKeys.value.length} 个存储卷成功`);
  selectedRowKeys.value = [];
}

function handleSelectionChange(keys: Array<number | string>) {
  selectedRowKeys.value = keys.map(Number);
}

function openUpdateModal(record: any) {
  updateForm.value = {
    id: record.id,
    name: record.name,
    capacity: record.capacity.toString(),
    unit: 'GB',
  };
  updateVisible.value = true;
}

function handleUpdate() {
  if (!updateForm.value.capacity) {
    message.warning('请输入容量大小');
    return;
  }
  const record = dataSource.value.find((item) => item.id === updateForm.value.id);
  if (record) {
    record.capacity = Number(updateForm.value.capacity);
    notify(`更新存储卷 ${updateForm.value.name} 成功`);
  }
  updateVisible.value = false;
}

function handleAdd() {
  if (!addForm.value.region || !addForm.value.type || !addForm.value.name || !addForm.value.capacity) {
    message.warning('请填写所有必填字段');
    return;
  }
  const newId = dataSource.value.length ? Math.max(...dataSource.value.map((item) => item.id)) + 1 : 1;
  const now = new Date();
  const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  dataSource.value.push({
    id: newId,
    name: addForm.value.name,
    type: addForm.value.type,
    used: 0,
    capacity: Number(addForm.value.capacity),
    status: '可用',
    created: formatTime,
  });
  
  notify(`创建存储卷 ${addForm.value.name} 成功`);
  visible.value = false;
  
  // reset form
  addForm.value = {
    region: undefined,
    type: undefined,
    name: '',
    capacity: '',
    unit: 'GB',
  };
}
</script>

<template>
  <div>
    <ListPageLayout>
      <template #toolbar>
        <Button type="primary" @click="visible = true">
          <template #icon>
            <Plus class="size-4" />
          </template>
          添加PVC
        </Button>
        <Popconfirm
          title="确认删除选中的存储卷？"
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
        <Button @click="notify('刷新成功')">刷新</Button>
      </template>

      <Table
        row-key="id"
        :data-source="dataSource"
        :pagination="false"
        :columns="columns"
        :row-selection="{
          selectedRowKeys,
          onChange: handleSelectionChange,
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <a class="text-blue-600 hover:text-blue-700" @click="openUpdateModal(record)">{{ record.name }}</a>
          </template>
          <template v-if="column.dataIndex === 'type'">
            <Tag class="rounded-full">{{ record.type }}</Tag>
          </template>
          <template v-if="column.dataIndex === 'usage'">
            <div class="flex items-center gap-2">
              <Progress
                :percent="Math.round((record.used / record.capacity) * 100)"
                :stroke-color="record.used / record.capacity > 0.8 ? '#ff4d4f' : '#1890ff'"
                size="small"
                style="width: 80px"
                :show-info="false"
              />
              <span class="text-sm text-gray-500">{{ record.used }}/{{ record.capacity }}GB</span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'capacity'">
            <span>{{ record.capacity }} GB</span>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <Tag :color="statusConfig[record.status]?.color" class="rounded-full">
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <div class="flex items-center gap-1">
              <Button type="link" size="small" @click="openUpdateModal(record)">更新</Button>
              <Popconfirm
                title="确认删除该存储卷？"
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
          :total="dataSource.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['10', '20', '50', '100']"
        />
      </div>
    </ListPageLayout>

    <!-- 添加PVC 抽屉 -->
    <Drawer
      v-model:open="visible"
      placement="right"
      :width="1120"
      :closable="false"
      :destroy-on-close="true"
    >
      <div class="drawer-content flex flex-col min-h-full">
        <!-- 头部 -->
        <div class="px-6 py-4 border-b border-solid border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Button type="text" size="small" class="inline-flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 rounded" @click="visible = false">
              <ChevronLeft class="size-4" />
            </Button>
            <span class="text-lg font-semibold text-gray-900 dark:text-zinc-150">添加PVC</span>
          </div>
        </div>

        <!-- 表单主体 -->
        <div class="flex-1 px-8 py-6 pb-24 overflow-y-auto">
          <h3 class="text-sm font-semibold text-gray-950 dark:text-zinc-200 mb-6 flex items-center gap-2">
            <span class="w-1 h-4 bg-blue-500 rounded"></span>
            基础信息
          </h3>

          <Form
            layout="horizontal"
            :model="addForm"
            :label-col="{ style: 'width: 120px; text-align: left;' }"
            :wrapper-col="{ span: 18 }"
            class="space-y-4"
          >
            <FormItem label="区域" required>
              <Select
                v-model:value="addForm.region"
                placeholder="请选择区域"
                :options="regionOptions"
                size="large"
                class="w-full"
              />
            </FormItem>
            
            <FormItem label="存储类型" required>
              <Select
                v-model:value="addForm.type"
                placeholder="请选择存储类型"
                :options="typeOptions"
                size="large"
                class="w-full"
              />
            </FormItem>
            
            <FormItem label="磁盘名称" required>
              <Input
                v-model:value="addForm.name"
                placeholder="请输入磁盘的唯一标识符或名称，以便于管理和追踪"
                size="large"
              />
            </FormItem>
            
            <FormItem label="PVC存储大小" required>
              <Input
                v-model:value="addForm.capacity"
                placeholder="输入数字，设置实际使用的大小，确保与应用程序需求匹配"
                size="large"
                class="w-full"
              >
                <template #addonAfter>
                  <Select
                    v-model:value="addForm.unit"
                    style="width: 80px"
                    :bordered="false"
                    :options="[{ label: 'GB', value: 'GB' }, { label: 'TB', value: 'TB' }]"
                  />
                </template>
              </Input>
            </FormItem>
          </Form>
        </div>

        <!-- 底部按钮 -->
        <div class="drawer-footer flex justify-end gap-3 px-8 py-4 border-t border-solid border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-zinc-950 absolute bottom-0 left-0 right-0 z-10">
          <Button class="rounded-lg" size="large" @click="visible = false">取消</Button>
          <Button type="primary" class="rounded-lg" size="large" @click="handleAdd">确认</Button>
        </div>
      </div>
    </Drawer>

    <!-- 更新PVC 对话框 (Modal) -->
    <Modal
      v-model:open="updateVisible"
      title="更新PVC"
      @cancel="updateVisible = false"
      :width="540"
      :destroy-on-close="true"
    >
      <Form
        layout="horizontal"
        :model="updateForm"
        :label-col="{ style: 'width: 80px; text-align: left;' }"
        :wrapper-col="{ span: 20 }"
        class="pt-6 pb-2"
      >
        <FormItem label="名称" required>
          <Input
            v-model:value="updateForm.name"
            disabled
            size="large"
          />
        </FormItem>
        <FormItem label="容量" required>
          <Input
            v-model:value="updateForm.capacity"
            size="large"
            class="w-full"
          >
            <template #addonAfter>
              <Select
                v-model:value="updateForm.unit"
                style="width: 80px"
                :bordered="false"
                :options="[{ label: 'GB', value: 'GB' }, { label: 'TB', value: 'TB' }]"
              />
            </template>
          </Input>
        </FormItem>
      </Form>
      <template #footer>
        <div class="flex justify-end gap-2 pt-2">
          <Button size="large" class="rounded-lg" @click="updateVisible = false">取消</Button>
          <Button type="primary" size="large" class="rounded-lg" @click="handleUpdate">确认</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.drawer-content {
  position: relative;
}

.drawer-footer {
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}
</style>