<script setup lang="ts">
import { Button, Input, Pagination, Popconfirm, Select, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
import { RotateCw, Search, X } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const selectedTenant = ref<string>();
const searchText = ref('');
const rowSelection = ref<number[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);

// 表头筛选条件（参照系统有表头筛选的列）
const statusFilter = ref<string[]>([]);
const gpuCountFilter = ref<string[]>([]);
const resourceSpecFilter = ref<string[]>([]);

// 筛选选项
const statusOptions = [
  { label: '创建中', value: '创建中' },
  { label: '排队中', value: '排队中' },
  { label: '运行中', value: '运行中' },
  { label: '重启中', value: '重启中' },
  { label: '完成中', value: '完成中' },
  { label: '停止中', value: '停止中' },
  { label: '中断中', value: '中断中' },
  { label: '停止', value: '停止' },
  { label: '已完成', value: '已完成' },
  { label: '已成功', value: '已成功' },
  { label: '已停止', value: '已停止' },
  { label: '已失败', value: '已失败' },
  { label: '异常', value: '异常' },
  { label: '被抢占', value: '被抢占' },
  { label: '已删除', value: '已删除' },
];
const gpuCountOptions = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '4', value: '4' },
  { label: '8', value: '8' },
];
const resourceSpecOptions = [
  { label: 'NVIDIA-GPU-HBM2E-80GB', value: 'NVIDIA-GPU-HBM2E-80GB' },
  { label: 'NVIDIA-H100-HBM2E-80GB', value: 'NVIDIA-H100-HBM2E-80GB' },
  { label: 'A10', value: 'A10' },
  { label: 'A800', value: 'A800' },
  { label: '-', value: '-' },
];

const finetuneColumns = [
  { title: '', dataIndex: 'checkbox', width: 40, fixed: 'left' as const },
  { title: '名称/ID', dataIndex: 'name', width: 200, fixed: 'left' as const },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '模型名称', dataIndex: 'modelName', width: 180 },
  { title: '就绪状态', dataIndex: 'readyStatus', width: 80 },
  { title: '运行时长', dataIndex: 'runTime', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '实例数量', dataIndex: 'instances', width: 80 },
  { title: 'GPU数量', dataIndex: 'gpuCount', width: 80 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '操作', dataIndex: 'action', width: 80, fixed: 'right' as const },
];

const finetuneData = ref<any[]>([]);

const statusColor: Record<string, string> = {
  '运行中': 'processing',
  '停止': 'default',
  '排队中': 'warning',
  '成功': 'success',
  '失败': 'error',
};

const notify = (text: string) => message.success(text);

// 重置筛选
const handleReset = () => {
  searchText.value = '';
  selectedTenant.value = undefined;
  statusFilter.value = [];
  gpuCountFilter.value = [];
  resourceSpecFilter.value = [];
};
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <Select
        v-model:value="selectedTenant"
        allow-clear
        style="width: 180px"
        placeholder="请选择租户"
        :options="[{ label: 'test01', value: 'test01' }, { label: 'test-0415', value: 'test-0415' }]"
      >
        <template #suffixIcon><Search class="size-4 text-gray-400" /></template>
      </Select>
      <Select
        v-model:value="statusFilter"
        mode="multiple"
        allow-clear
        style="width: 160px"
        placeholder="状态"
        :options="statusOptions"
        :max-tag-count="1"
      />
      <Select
        v-model:value="gpuCountFilter"
        mode="multiple"
        allow-clear
        style="width: 120px"
        placeholder="GPU数量"
        :options="gpuCountOptions"
        :max-tag-count="1"
      />
      <Select
        v-model:value="resourceSpecFilter"
        mode="multiple"
        allow-clear
        style="width: 180px"
        placeholder="资源规格"
        :options="resourceSpecOptions"
        :max-tag-count="1"
      />
      <Input v-model:value="searchText" placeholder="支持模糊搜索模型微调名称/ID" style="width: 260px" allow-clear>
        <template #prefix><Search class="size-4 text-gray-400" /></template>
      </Input>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button @click="handleReset">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Popconfirm
        title="确认删除选中的任务？"
        @confirm="notify(`已删除 ${rowSelection.length} 个任务`)"
      >
        <Button danger :disabled="rowSelection.length === 0">
          <template #icon><X class="size-4" /></template>
          批量删除
        </Button>
      </Popconfirm>
      <Button @click="notify('列表已刷新')">
        <template #icon><RotateCw class="size-4" /></template>
      </Button>
    </template>

    <Table
      row-key="id"
      :row-selection="{
        selectedRowKeys: rowSelection,
        onChange: (keys: any[]) => (rowSelection = keys),
      }"
      :data-source="finetuneData"
      :pagination="false"
      :columns="finetuneColumns"
      :scroll="{ x: 1600 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <Tag :color="statusColor[record.status]" class="rounded-full">{{ record.status }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Popconfirm title="确认删除该任务？" ok-text="确认" cancel-text="取消" @confirm="notify(`删除任务 ${record.name}`)">
            <a class="text-red-500">删除</a>
          </Popconfirm>
        </template>
      </template>
      <template #emptyText>
        <div class="text-center py-8">
          <div class="text-gray-400 mb-2">暂无数据</div>
          <div class="text-gray-400 text-sm">当前没有记录，增加以后在此处查看数据。</div>
        </div>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="0"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>