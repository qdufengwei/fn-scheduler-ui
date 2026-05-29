<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { CircleAlert, RotateCw } from '@vben/icons';

import {
  Button,
  Form,
  FormItem,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Select,
  Slider,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const searchText = ref('');
const pageSize = ref(10);
const currentPage = ref(1);

const columns = [
  { title: '规格名称', dataIndex: 'name', key: 'name', width: 180 },
  {
    title: '资源规格',
    dataIndex: 'resourceSpec',
    key: 'resourceSpec',
    width: 200,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '算力', dataIndex: 'compute', key: 'compute', width: 100 },
  { title: '显存', dataIndex: 'memory', key: 'memory', width: 100 },
  {
    title: '用户购买',
    dataIndex: 'userPurchase',
    key: 'userPurchase',
    width: 100,
  },
  { title: '分配', dataIndex: 'allocated', key: 'allocated', width: 80 },
  { title: '使用中', dataIndex: 'inUse', key: 'inUse', width: 80 },
  {
    title: '实例总数',
    dataIndex: 'totalInstances',
    key: 'totalInstances',
    width: 100,
  },
  { title: '单价', dataIndex: 'price', key: 'price', width: 150 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' as const },
];

const dataSource = ref([
  {
    id: 1,
    name: 'GPU-25%-16GiB',
    resourceSpec: 'NVIDIA-GPU-HBM2E-80GB',
    status: '启用',
    compute: '25%',
    memory: '16GiB',
    userPurchase: 10,
    allocated: 8,
    inUse: 8,
    totalInstances: 10,
    price: '¥2.50/时',
  },
  {
    id: 2,
    name: 'GPU-50%-32GiB',
    resourceSpec: 'NVIDIA-GPU-HBM2E-80GB',
    status: '启用',
    compute: '50%',
    memory: '32GiB',
    userPurchase: 5,
    allocated: 5,
    inUse: 4,
    totalInstances: 5,
    price: '¥5.00/时',
  },
  {
    id: 3,
    name: 'GPU-10%-8GiB',
    resourceSpec: 'NVIDIA-A10-24GB',
    status: '启用',
    compute: '10%',
    memory: '8GiB',
    userPurchase: 20,
    allocated: 18,
    inUse: 15,
    totalInstances: 20,
    price: '¥1.00/时',
  },
  {
    id: 4,
    name: 'GPU-75%-60GiB',
    resourceSpec: 'NVIDIA-H100-HBM2E-80GB',
    status: '启用',
    compute: '75%',
    memory: '60GiB',
    userPurchase: 4,
    allocated: 4,
    inUse: 3,
    totalInstances: 4,
    price: '¥7.50/时',
  },
  {
    id: 5,
    name: 'GPU-20%-16GiB',
    resourceSpec: 'NVIDIA-A800-HBM2E-80GB',
    status: '停用',
    compute: '20%',
    memory: '16GiB',
    userPurchase: 8,
    allocated: 0,
    inUse: 0,
    totalInstances: 8,
    price: '¥2.00/时',
  },
  {
    id: 6,
    name: 'GPU-100%-80GiB',
    resourceSpec: 'NVIDIA-GPU-HBM2E-80GB',
    status: '启用',
    compute: '100%',
    memory: '80GiB',
    userPurchase: 2,
    allocated: 2,
    inUse: 2,
    totalInstances: 2,
    price: '¥10.00/时',
  },
  {
    id: 7,
    name: 'GPU-33%-24GiB',
    resourceSpec: 'NVIDIA-A100-HBM2E-40GB',
    status: '启用',
    compute: '33%',
    memory: '24GiB',
    userPurchase: 6,
    allocated: 5,
    inUse: 4,
    totalInstances: 6,
    price: '¥3.30/时',
  },
  {
    id: 8,
    name: 'GPU-50%-12GiB',
    resourceSpec: 'NVIDIA-A10-24GB',
    status: '停用',
    compute: '50%',
    memory: '12GiB',
    userPurchase: 3,
    allocated: 0,
    inUse: 0,
    totalInstances: 3,
    price: '¥2.50/时',
  },
]);

const showWarning = ref(false);

const form = ref({
  resourceSpec: 'NVIDIA-GPU-HBM2E-80GB',
  gpuNode: undefined as string | undefined,
  compute: 1,
  memory: 1,
  name: '',
});

const computedName = computed(() => {
  return `GPU-${form.value.compute}%-${form.value.memory}GiB`;
});

function handleAddVgpu() {
  showWarning.value = true;
}

function handleWarningConfirm() {
  showWarning.value = false;
  createDrawerApi.open();
}

function handleSave() {
  showNotify('添加vGPU规格成功（原型）');
  createDrawerApi.close();
}

function handleRefresh() {
  showNotify('刷新成功');
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[520px]!',
  title: '添加vGPU规格',
});
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <Input
        v-model:value="searchText"
        placeholder="搜索vGPU规格名称"
        allow-clear
        style="width: 220px"
      >
        <template #prefix>🔎</template>
      </Input>
    </template>

    <template #toolbar>
      <Button type="primary" @click="handleAddVgpu"> 添加vGPU规格 </Button>
      <Button @click="handleRefresh">
        <template #icon><RotateCw class="size-4" /></template>
        刷新
      </Button>
    </template>

    <Table
      row-key="id"
      :data-source="dataSource"
      :pagination="false"
      :columns="columns"
      :scroll="{ x: 1300 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <span class="font-medium text-blue-600">{{ record.name }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <Tag
            :color="record.status === '启用' ? 'success' : 'default'"
            class="rounded-full"
          >
            {{ record.status }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'price'">
          <span class="text-orange-600 font-medium">{{ record.price }}</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <Space>
            <Button
              type="link"
              size="small"
              @click="showNotify(`编辑 ${record.name}`)"
            >
              编辑
            </Button>
          </Space>
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="8"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>

  <!-- 风险提示弹窗 -->
  <Modal v-model:open="showWarning" title="提示" :centered="true" :width="400">
    <div class="flex flex-col items-center justify-center py-6">
      <CircleAlert class="size-12 text-orange-500 mb-4" />
      <div class="text-center text-gray-600 leading-relaxed">
        vGPU存在隔离性和安全性风险，可能导致资源边界模糊及数据安全风险，请谨慎使用。
      </div>
    </div>
    <template #footer>
      <Space>
        <Button @click="showWarning = false">取消</Button>
        <Button type="primary" @click="handleWarningConfirm">确认</Button>
      </Space>
    </template>
  </Modal>

  <!-- 添加vGPU规格抽屉 -->
  <CreateDrawer>
    <Form layout="vertical" :model="form">
      <FormItem required>
        <template #label>资源规格</template>
        <Select
          v-model:value="form.resourceSpec"
          :options="[
            {
              label: 'NVIDIA-GPU-HBM2E-80GB',
              value: 'NVIDIA-GPU-HBM2E-80GB',
            },
            {
              label: 'NVIDIA-H100-HBM2E-80GB',
              value: 'NVIDIA-H100-HBM2E-80GB',
            },
          ]"
        />
      </FormItem>
      <FormItem required>
        <template #label>GPU节点</template>
        <Select
          v-model:value="form.gpuNode"
          placeholder="请选择GPU节点"
          :options="[
            { label: 'node201', value: 'node201' },
            { label: 'node202', value: 'node202' },
          ]"
        />
      </FormItem>
      <FormItem required>
        <template #label>每个vGPU的算力</template>
        <div class="flex items-center gap-4">
          <Slider
            v-model:value="form.compute"
            :min="1"
            :max="100"
            class="flex-1"
          />
          <span class="text-blue-600 font-semibold w-12"
            >{{ form.compute }}%</span
          >
        </div>
      </FormItem>
      <FormItem required>
        <template #label>每个vGPU的显存</template>
        <div class="flex items-center gap-2">
          <InputNumber
            v-model:value="form.memory"
            :min="1"
            :max="80"
            style="width: 150px"
          />
          <span class="text-gray-500">GiB</span>
        </div>
      </FormItem>
      <FormItem required>
        <template #label>规格名称</template>
        <Input :value="computedName" disabled placeholder="例如：A10-25%-8G" />
      </FormItem>
    </Form>
    <template #footer>
      <Space>
        <Button @click="createDrawerApi.close()">取消</Button>
        <Button type="primary" @click="handleSave">确认</Button>
      </Space>
    </template>
  </CreateDrawer>
</template>
