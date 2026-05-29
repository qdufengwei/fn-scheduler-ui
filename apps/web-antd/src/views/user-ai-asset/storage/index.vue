<script setup lang="ts">
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { ChevronLeft, Plus, Trash2 } from '@vben/icons';

import {
  Button,
  Form,
  FormItem,
  Input,
  message,
  Pagination,
  Popconfirm,
  Progress,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

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

function handleDelete(record: any) {
  dataSource.value = dataSource.value.filter((item) => item.id !== record.id);
  showNotify(`删除存储卷 ${record.name} 成功`);
}

function handleBatchDelete() {
  dataSource.value = dataSource.value.filter(
    (item) => !selectedRowKeys.value.includes(item.id),
  );
  showNotify(`批量删除 ${selectedRowKeys.value.length} 个存储卷成功`);
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
  updateDrawerApi.open();
}

function handleUpdate() {
  if (!updateForm.value.capacity) {
    message.warning('请输入容量大小');
    return;
  }
  const record = dataSource.value.find(
    (item) => item.id === updateForm.value.id,
  );
  if (record) {
    record.capacity = Number(updateForm.value.capacity);
    showNotify(`更新存储卷 ${updateForm.value.name} 成功`);
  }
  updateDrawerApi.close();
}

function handleAdd() {
  if (
    !addForm.value.region ||
    !addForm.value.type ||
    !addForm.value.name ||
    !addForm.value.capacity
  ) {
    message.warning('请填写所有必填字段');
    return;
  }
  const newId =
    dataSource.value.length > 0
      ? Math.max(...dataSource.value.map((item) => item.id)) + 1
      : 1;
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

  showNotify(`创建存储卷 ${addForm.value.name} 成功`);
  createDrawerApi.close();

  // reset form
  addForm.value = {
    region: undefined,
    type: undefined,
    name: '',
    capacity: '',
    unit: 'GB',
  };
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[640px]!',
  title: '',
});

const [UpdateDrawer, updateDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[540px]!',
  title: '',
});
</script>

<template>
  <div>
    <ListPageLayout>
      <template #toolbar>
        <Button type="primary" @click="createDrawerApi.open()">
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
          :disabled="selectedRowKeys.length === 0"
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
            <span class="text-gray-800 dark:text-zinc-300 font-medium">{{
              record.name
            }}</span>
          </template>
          <template v-if="column.dataIndex === 'type'">
            <Tag class="rounded-full">{{ record.type }}</Tag>
          </template>
          <template v-if="column.dataIndex === 'usage'">
            <div class="flex items-center gap-2">
              <Progress
                :percent="Math.round((record.used / record.capacity) * 100)"
                :stroke-color="
                  record.used / record.capacity > 0.8 ? '#ff4d4f' : '#1890ff'
                "
                size="small"
                style="width: 80px"
                :show-info="false"
              />
              <span class="text-sm text-gray-500"
                >{{ record.used }}/{{ record.capacity }}GB</span
              >
            </div>
          </template>
          <template v-if="column.dataIndex === 'capacity'">
            <span>{{ record.capacity }} GB</span>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <Tag
              :color="statusConfig[record.status]?.color"
              class="rounded-full"
            >
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <div class="flex items-center gap-1">
              <Button type="link" size="small" @click="openUpdateModal(record)">
                更新
              </Button>
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
          v-model:page-size="pageSize"
          :total="dataSource.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['10', '20', '50', '100']"
        />
      </div>
    </ListPageLayout>

    <!-- 添加PVC 抽屉 -->
    <CreateDrawer>
      <template #title>
        <div class="flex items-center gap-3 select-none">
          <Button
            type="text"
            class="flex items-center justify-center p-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            @click="createDrawerApi.close()"
          >
            <ChevronLeft class="size-5 text-gray-600 dark:text-zinc-400" />
          </Button>
          <span class="text-base font-bold text-gray-800 dark:text-zinc-200"
            >添加PVC</span
          >
        </div>
      </template>

      <!-- 表单主体 -->
      <div class="py-2">
        <Form layout="vertical" :model="addForm" class="space-y-4">
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
              placeholder="请输入磁盘名称，例: data-volume"
              size="large"
            />
          </FormItem>

          <FormItem label="PVC存储大小" required>
            <Input
              v-model:value="addForm.capacity"
              placeholder="请输入容量大小"
              size="large"
              class="w-full"
            >
              <template #addonAfter>
                <Select
                  v-model:value="addForm.unit"
                  style="width: 80px"
                  :bordered="false"
                  :options="[
                    { label: 'GB', value: 'GB' },
                    { label: 'TB', value: 'TB' },
                  ]"
                />
              </template>
            </Input>
          </FormItem>
        </Form>
      </div>

      <template #footer>
        <Space>
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button type="primary" @click="handleAdd">确认</Button>
        </Space>
      </template>
    </CreateDrawer>

    <!-- 更新PVC 抽屉 -->
    <UpdateDrawer>
      <template #title>
        <div class="flex items-center gap-3 select-none">
          <Button
            type="text"
            class="flex items-center justify-center p-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            @click="updateDrawerApi.close()"
          >
            <ChevronLeft class="size-5 text-gray-600 dark:text-zinc-400" />
          </Button>
          <span class="text-base font-bold text-gray-800 dark:text-zinc-200"
            >更新PVC</span
          >
        </div>
      </template>

      <!-- 表单主体 -->
      <div class="py-2">
        <Form layout="vertical" :model="updateForm" class="space-y-4">
          <FormItem label="名称" required>
            <Input v-model:value="updateForm.name" disabled size="large" />
          </FormItem>
          <FormItem label="容量" required>
            <Input
              v-model:value="updateForm.capacity"
              placeholder="请输入新的容量大小"
              size="large"
              class="w-full"
            >
              <template #addonAfter>
                <Select
                  v-model:value="updateForm.unit"
                  style="width: 80px"
                  :bordered="false"
                  :options="[
                    { label: 'GB', value: 'GB' },
                    { label: 'TB', value: 'TB' },
                  ]"
                />
              </template>
            </Input>
          </FormItem>
        </Form>
      </div>

      <template #footer>
        <Space>
          <Button @click="updateDrawerApi.close()">取消</Button>
          <Button type="primary" @click="handleUpdate">确认</Button>
        </Space>
      </template>
    </UpdateDrawer>
  </div>
</template>

<style scoped></style>
