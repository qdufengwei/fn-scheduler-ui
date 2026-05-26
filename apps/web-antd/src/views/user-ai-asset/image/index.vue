<script setup lang="ts">
import { Button, Input, Pagination, Popconfirm, Segmented, Select, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
import { Plus, Trash2 } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const tab = ref('repo');
const imageScope = ref('public');
const project = ref('kubesphereio');
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref<number[]>([]);

const rows = ref([
  { id: 1, name: 'kubesphereio/train-runtime', count: 12, pulls: 3401, created: '2026-05-02', updated: '2026-05-25' },
  { id: 2, name: 'tenant/test01-custom', count: 3, pulls: 412, created: '2026-05-10', updated: '2026-05-23' },
  { id: 3, name: 'kubesphereio/inference-base', count: 8, pulls: 1205, created: '2026-04-15', updated: '2026-05-20' },
]);

const notify = (text: string) => message.success(text);

function handleBatchDelete() {
  rows.value = rows.value.filter((item) => !selectedRowKeys.value.includes(item.id));
  notify(`批量删除 ${selectedRowKeys.value.length} 个镜像成功`);
  selectedRowKeys.value = [];
}

function handleDelete(record: any) {
  rows.value = rows.value.filter((item) => item.id !== record.id);
  notify(`删除镜像 ${record.name} 成功`);
}

function handleSelectionChange(keys: Array<number | string>) {
  selectedRowKeys.value = keys.map(Number);
}
</script>

<template>
  <div>
    <ListPageLayout>
      <template #filters>
      <div class="flex flex-wrap items-center gap-4">
        <Segmented v-model:value="imageScope" :options="[{ label: '公共镜像', value: 'public' }, { label: '私有镜像', value: 'private' }]" />
        <Select v-model:value="project" style="width: 180px" :options="[{ label: 'kubesphereio', value: 'kubesphereio' }, { label: 'test01', value: 'test01' }]" />
        <Input v-model:value="keyword" placeholder="请输入镜像名称" style="width: 220px" />
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary" @click="notify('已筛选')">筛选</Button>
        <Button @click="keyword = ''; imageScope = 'public'; project = 'kubesphereio'">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button type="primary" @click="notify('打开创建镜像抽屉（待扩展）')">
        <template #icon><Plus class="size-4" /></template>
        创建镜像
      </Button>
      <Popconfirm
        title="确认批量删除选中的镜像？"
        ok-text="确认"
        cancel-text="取消"
        @confirm="handleBatchDelete"
      >
        <Button danger :disabled="selectedRowKeys.length === 0">
          <template #icon><Trash2 class="size-4" /></template>
          批量删除
        </Button>
      </Popconfirm>
      <Button @click="notify('刷新成功')">刷新</Button>
    </template>

    <template #viewSwitch>
      <Segmented v-model:value="tab" :options="[{ label: '镜像仓库', value: 'repo' }, { label: '镜像任务', value: 'task' }]" />
    </template>

    <Table
      v-if="tab === 'repo'"
      row-key="id"
      :data-source="rows.filter((r) => !keyword || r.name.includes(keyword))"
      :pagination="false"
      :columns="[
        { title: '镜像名称', dataIndex: 'name' },
        { title: '镜像数量', dataIndex: 'count' },
        { title: '拉取次数', dataIndex: 'pulls' },
        { title: '创建时间', dataIndex: 'created' },
        { title: '更新时间', dataIndex: 'updated' },
        { title: '操作', dataIndex: 'action' },
      ]"
      :row-selection="{ selectedRowKeys, onChange: handleSelectionChange }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a class="text-blue-600 hover:text-blue-700">{{ record.name }}</a>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Space :size="0">
            <a @click="notify(`查看镜像 ${record.name} 详情`)">详情</a>
            <Popconfirm title="确认删除该镜像？" @confirm="handleDelete(record)">
              <a class="text-red-500">删除</a>
            </Popconfirm>
          </Space>
        </template>
      </template>
    </Table>

    <Table
      v-else
      row-key="id"
      :data-source="[{ id: 1, name: 'build-runtime-v1', status: '成功', time: '2026-05-25 11:20' }]"
      :pagination="false"
      :columns="[
        { title: '任务名称', dataIndex: 'name' },
        { title: '状态', dataIndex: 'status' },
        { title: '时间', dataIndex: 'time' },
        { title: '操作', dataIndex: 'action' },
      ]"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <Tag color="success">{{ record.status }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Space :size="0">
            <a @click="notify(`查看任务 ${record.name}`)">详情</a>
            <a @click="notify(`查看日志 ${record.name}`)">日志</a>
          </Space>
        </template>
      </template>
    </Table>

    <div v-if="tab === 'repo'" class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="rows.length"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
  </div>
</template>
