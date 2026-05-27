<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Form, FormItem, InputNumber, Pagination, Space, Table, message } from 'ant-design-vue';
import { Download, Inbox, Settings, UserRoundPen } from '@vben/icons';

const pageSize = ref(10);
const currentPage = ref(1);

const columns = [
  { title: '资源类型', dataIndex: 'resourceType', width: 250 },
  { title: '基础价格', dataIndex: 'basePrice', width: 200 },
  { title: '包月折扣价', dataIndex: 'monthlyPrice', width: 150 },
  { title: '包年折扣价', dataIndex: 'yearlyPrice', width: 150 },
  { title: '操作', dataIndex: 'action', width: 120 },
];

const dataSource = ref([
  { id: 1, resourceType: 'NVIDIA-GPU-HBM2E-80GB', basePrice: '1.00 (¥ / 卡 / 时)', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 2, resourceType: 'rook-cephfs', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 3, resourceType: 'nfs-client', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 4, resourceType: 'nfs-storage', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 5, resourceType: 'standard', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 6, resourceType: 'local-path', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
]);

const editForm = ref<any>({});
const notify = (text: string) => message.success(text);

function openEdit(record: any) {
  editForm.value = { ...record };
  createDrawerApi.open();
}

function handleEditOk() {
  createDrawerApi.close();
  notify('编辑成功（原型）');
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[480px]!',
  title: '编辑定价',
});
</script>

<template>
  <Page auto-content-height>
    <div>
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <Settings class="size-5 text-orange-500" />
          <span class="text-lg font-semibold">商品定价</span>
        </div>

        <Table
          row-key="id"
          :data-source="dataSource"
          :pagination="false"
          :columns="columns"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'resourceType'">
              <div class="flex items-center gap-2">
                <Inbox class="size-4 text-gray-400" />
                <span class="font-medium">{{ record.resourceType }}</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'basePrice'">
              <div v-if="record.basePrice !== '-'">
                <span class="text-lg font-semibold text-blue-600">{{ record.basePrice.split(' ')[0] }}</span>
                <span class="text-xs text-gray-500 ml-1">{{ record.basePrice.split(' ').slice(1).join(' ') }}</span>
              </div>
              <span v-else class="text-gray-400">-</span>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Button type="link" size="small" @click="openEdit(record)">
                编辑
              </Button>
            </template>
          </template>
        </Table>

        <div class="flex items-center justify-end mt-4 pt-4 border-t">
          <Pagination
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="6"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </Card>

      <!-- 编辑定价抽屉 -->
      <CreateDrawer>
        <Form layout="vertical" :model="editForm">
          <FormItem label="资源类型">
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Inbox class="size-4 text-gray-400" />
              <span class="font-medium">{{ editForm.resourceType }}</span>
            </div>
          </FormItem>
          <FormItem>
            <template #label>
              <span class="flex items-center gap-1">
                <Download class="size-4 text-gray-400" />
                基础价格 (¥ / 卡 / 时)
              </span>
            </template>
            <InputNumber v-model:value="editForm.basePriceValue" :min="0" :step="0.1" style="width: 100%" placeholder="请输入基础价格" />
          </FormItem>
          <FormItem label="包月折扣价">
            <InputNumber v-model:value="editForm.monthlyPriceValue" :min="0" :step="0.1" style="width: 100%" placeholder="请输入包月折扣价" />
          </FormItem>
          <FormItem label="包年折扣价">
            <InputNumber v-model:value="editForm.yearlyPriceValue" :min="0" :step="0.1" style="width: 100%" placeholder="请输入包年折扣价" />
          </FormItem>
        </Form>
        <template #footer>
          <Space>
            <Button @click="createDrawerApi.close()">取消</Button>
            <Button type="primary" @click="handleEditOk">保存</Button>
          </Space>
        </template>
      </CreateDrawer>
    </div>
  </Page>
</template>
