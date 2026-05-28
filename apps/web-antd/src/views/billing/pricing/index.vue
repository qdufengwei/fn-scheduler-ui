<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { computed, ref } from 'vue';
import { Button, Form, FormItem, InputNumber, Pagination, Space, Switch, Table, message } from 'ant-design-vue';
import { Inbox } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const pageSize = ref(10);
const currentPage = ref(1);

const columns = [
  { title: '资源类型', dataIndex: 'resourceType', key: 'resourceType', width: 250 },
  { title: '基础价格', dataIndex: 'basePrice', key: 'basePrice', width: 200 },
  { title: '包月折扣价', dataIndex: 'monthlyPrice', key: 'monthlyPrice', width: 150 },
  { title: '包年折扣价', dataIndex: 'yearlyPrice', key: 'yearlyPrice', width: 150 },
  { title: '操作', key: 'action', width: 120 },
];

const dataSource = ref([
  { id: 1, resourceType: 'NVIDIA-GPU-HBM2E-80GB', basePrice: '1.00 (¥ / 卡 / 时)', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 2, resourceType: 'rook-cephfs', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 3, resourceType: 'nfs-client', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 4, resourceType: 'nfs-storage', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 5, resourceType: 'standard', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
  { id: 6, resourceType: 'local-path', basePrice: '-', monthlyPrice: '-', yearlyPrice: '-' },
]);

const editForm = ref<any>({
  basePriceValue: 0,
  discountEnabled: false,
  monthlyDiscount: 0,
  yearlyDiscount: 0,
});
const notify = (text: string) => message.success(text);

function openEdit(record: any) {
  const basePriceValue = parseBasePrice(record.basePrice);
  editForm.value = {
    ...record,
    basePriceValue,
    discountEnabled: record.monthlyPrice !== '-' || record.yearlyPrice !== '-',
    monthlyDiscount: 0,
    yearlyDiscount: 0,
  };
  createDrawerApi.open();
}

function handleEditOk() {
  createDrawerApi.close();
  notify('编辑成功（原型）');
}

function parseBasePrice(price: string) {
  const parsed = Number.parseFloat(price);
  return Number.isFinite(parsed) ? parsed : 0;
}

const currentPriceText = computed(() => `¥${(editForm.value.basePriceValue || 0).toFixed(2)} / 卡 / 时`);
const monthlyOriginalPrice = computed(() => (editForm.value.basePriceValue || 0) * 24 * 30);
const yearlyOriginalPrice = computed(() => monthlyOriginalPrice.value * 12);
const monthlyDiscountPrice = computed(() => monthlyOriginalPrice.value * (1 - (editForm.value.monthlyDiscount || 0) / 100));
const yearlyDiscountPrice = computed(() => yearlyOriginalPrice.value * (1 - (editForm.value.yearlyDiscount || 0) / 100));

function formatPrice(value: number, unit: string) {
  return `¥${value.toLocaleString('zh-CN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })} / 卡 / ${unit}`;
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[760px]!',
  title: '编辑',
});
</script>

<template>
  <div>
    <ListPageLayout>
    <template #filters>
      <span class="text-lg font-semibold">商品定价</span>
    </template>

    <Table
      row-key="id"
      :data-source="dataSource"
      :pagination="false"
      :columns="columns"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'resourceType'">
          <div class="flex items-center gap-2">
            <Inbox class="size-4 text-gray-400" />
            <span class="font-medium">{{ record.resourceType }}</span>
          </div>
        </template>
        <template v-else-if="column.key === 'basePrice'">
          <div v-if="record.basePrice !== '-'">
            <span class="text-lg font-semibold text-blue-600">{{ record.basePrice.split(' ')[0] }}</span>
            <span class="text-xs text-gray-500 ml-1">{{ record.basePrice.split(' ').slice(1).join(' ') }}</span>
          </div>
          <span v-else class="text-gray-400">-</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <Button type="link" size="small" @click="openEdit(record)">
            编辑
          </Button>
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="6"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>

  <!-- 编辑定价抽屉 -->
  <CreateDrawer>
    <Form :model="editForm" class="pricing-edit-form" :label-col="{ style: { width: '170px' } }" :wrapper-col="{ span: 18 }">
      <FormItem label="资源类型">
        <span>{{ editForm.resourceType }}</span>
      </FormItem>
      <FormItem label="当前价格">
        <span>{{ currentPriceText }}</span>
      </FormItem>
      <FormItem label="基础价格(按小时计费)">
        <InputNumber v-model:value="editForm.basePriceValue" :min="0" :step="0.1" class="pricing-edit-form__price-input" placeholder="请输入基础价格" />
      </FormItem>
      <FormItem label="启用折扣">
        <Switch v-model:checked="editForm.discountEnabled" />
      </FormItem>

      <div v-if="editForm.discountEnabled" class="pricing-discount-grid">
        <div class="pricing-discount-card">
          <div class="pricing-discount-card__title">包月折扣</div>
          <div class="pricing-discount-card__field">
            <div class="pricing-discount-card__label">折扣率</div>
            <InputNumber v-model:value="editForm.monthlyDiscount" :min="0" :max="100" :step="1" class="pricing-discount-card__input" />
            <span class="pricing-discount-card__unit">%</span>
          </div>
          <div class="pricing-discount-card__divider" />
          <div class="pricing-discount-card__row">
            <span>原价</span>
            <span>{{ formatPrice(monthlyOriginalPrice, '月') }}</span>
          </div>
          <div class="pricing-discount-card__row">
            <span>折扣</span>
            <span>-{{ editForm.monthlyDiscount || 0 }}%</span>
          </div>
          <div class="pricing-discount-card__row">
            <span>折后价</span>
            <span>{{ formatPrice(monthlyDiscountPrice, '月') }}</span>
          </div>
        </div>

        <div class="pricing-discount-card">
          <div class="pricing-discount-card__title">包年折扣</div>
          <div class="pricing-discount-card__field">
            <div class="pricing-discount-card__label">折扣率</div>
            <InputNumber v-model:value="editForm.yearlyDiscount" :min="0" :max="100" :step="1" class="pricing-discount-card__input" />
            <span class="pricing-discount-card__unit">%</span>
          </div>
          <div class="pricing-discount-card__divider" />
          <div class="pricing-discount-card__row">
            <span>原价</span>
            <span>{{ formatPrice(yearlyOriginalPrice, '年') }}</span>
          </div>
          <div class="pricing-discount-card__row">
            <span>折扣</span>
            <span>-{{ editForm.yearlyDiscount || 0 }}%</span>
          </div>
          <div class="pricing-discount-card__row">
            <span>折后价</span>
            <span>{{ formatPrice(yearlyDiscountPrice, '年') }}</span>
          </div>
        </div>
      </div>
    </Form>
    <template #footer>
      <Space>
        <Button @click="createDrawerApi.close()">取消</Button>
        <Button type="primary" @click="handleEditOk">确认</Button>
      </Space>
    </template>
  </CreateDrawer>
  </div>
</template>

<style scoped>
.pricing-edit-form__price-input {
  width: 250px;
}

.pricing-discount-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 8px;
}

.pricing-discount-card {
  padding: 18px;
  border: 1px solid #d9dfe8;
}

.pricing-discount-card__title {
  margin-bottom: 14px;
  color: #1f2329;
  font-size: 16px;
  font-weight: 600;
}

.pricing-discount-card__field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
}

.pricing-discount-card__label {
  width: 100%;
  color: #4e5969;
  font-size: 13px;
}

.pricing-discount-card__input {
  width: 180px;
}

.pricing-discount-card__unit {
  line-height: 32px;
}

.pricing-discount-card__divider {
  margin: 20px 0;
  border-top: 1px dashed #d9dfe8;
}

.pricing-discount-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #1f2329;
  line-height: 34px;
}

.pricing-discount-card__row span:first-child {
  color: #4e5969;
}
</style>
