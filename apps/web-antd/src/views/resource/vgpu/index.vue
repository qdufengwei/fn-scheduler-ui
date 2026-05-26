<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { ref, computed } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Form, FormItem, Input, InputNumber, Modal, Pagination, Select, Slider, Space, Table, Tag, message } from 'ant-design-vue';
import { CircleAlert } from '@vben/icons';

const searchText = ref('');
const pageSize = ref(10);
const currentPage = ref(1);

const columns = [
  { title: '规格名称', dataIndex: 'name', width: 180 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '算力', dataIndex: 'compute', width: 100 },
  { title: '显存', dataIndex: 'memory', width: 100 },
  { title: '用户购买', dataIndex: 'userPurchase', width: 100 },
  { title: '分配', dataIndex: 'allocated', width: 80 },
  { title: '使用中', dataIndex: 'inUse', width: 80 },
  { title: '实例总数', dataIndex: 'totalInstances', width: 100 },
  { title: '单价', dataIndex: 'price', width: 150 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' as const },
];

const dataSource = ref([
  { id: 1, name: 'GPU-25%-16GiB', resourceSpec: 'NVIDIA-GPU-HBM2E-80GB', status: '启用', compute: '25%', memory: '16GiB', userPurchase: 10, allocated: 8, inUse: 8, totalInstances: 10, price: '¥2.50/时' },
  { id: 2, name: 'GPU-50%-32GiB', resourceSpec: 'NVIDIA-GPU-HBM2E-80GB', status: '启用', compute: '50%', memory: '32GiB', userPurchase: 5, allocated: 5, inUse: 4, totalInstances: 5, price: '¥5.00/时' },
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

const notify = (text: string) => message.success(text);

function handleAddVgpu() {
  showWarning.value = true;
}

function handleWarningConfirm() {
  showWarning.value = false;
  createDrawerApi.open();
}

function handleSave() {
  notify('添加vGPU规格成功（原型）');
  createDrawerApi.close();
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[520px]!',
  title: '添加vGPU规格',
});
</script>

<template>
  <Page auto-content-height>
    <div>
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-lg font-semibold">vGPU</span>
          </div>
          <Space>
            <Input v-model:value="searchText" placeholder="搜索vGPU规格名称" allow-clear style="width: 220px">
              <template #prefix>🔎</template>
            </Input>
            <Button type="primary" @click="handleAddVgpu">
              添加vGPU规格
            </Button>
          </Space>
        </div>

        <Table
          row-key="id"
          :data-source="dataSource"
          :pagination="false"
          :columns="columns"
          :scroll="{ x: 1300 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <span class="font-medium text-blue-600">{{ record.name }}</span>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <Tag :color="record.status === '启用' ? 'success' : 'default'" class="rounded-full">
                {{ record.status }}
              </Tag>
            </template>
            <template v-if="column.dataIndex === 'price'">
              <span class="text-orange-600 font-medium">{{ record.price }}</span>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Space>
                <Button type="link" size="small" @click="notify(`编辑 ${record.name}`)">
                  编辑
                </Button>
              </Space>
            </template>
          </template>
        </Table>

        <div class="flex items-center justify-end mt-4 pt-4 border-t">
          <Pagination
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="2"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </Card>

      <!-- 风险提示弹窗 -->
      <Modal
        v-model:open="showWarning"
        title="提示"
        :centered="true"
        :width="400"
      >
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
            <Select v-model:value="form.resourceSpec" :options="[{ label: 'NVIDIA-GPU-HBM2E-80GB', value: 'NVIDIA-GPU-HBM2E-80GB' }, { label: 'NVIDIA-H100-HBM2E-80GB', value: 'NVIDIA-H100-HBM2E-80GB' }]" />
          </FormItem>
          <FormItem required>
            <template #label>GPU节点</template>
            <Select v-model:value="form.gpuNode" placeholder="请选择GPU节点" :options="[{ label: 'node201', value: 'node201' }, { label: 'node202', value: 'node202' }]" />
          </FormItem>
          <FormItem required>
            <template #label>每个vGPU的算力</template>
            <div class="flex items-center gap-4">
              <Slider v-model:value="form.compute" :min="1" :max="100" class="flex-1" />
              <span class="text-blue-600 font-semibold w-12">{{ form.compute }}%</span>
            </div>
          </FormItem>
          <FormItem required>
            <template #label>每个vGPU的显存</template>
            <div class="flex items-center gap-2">
              <InputNumber v-model:value="form.memory" :min="1" :max="80" style="width: 150px" />
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
    </div>
  </Page>
</template>
