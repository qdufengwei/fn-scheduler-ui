<script setup lang="ts">
import { Button, Input, Pagination, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
import ListPageLayout from '#/components/business/list-page-layout.vue';

const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const rows = ref([
  { id: 1, service: 'chat-qwen2', model: 'Qwen2-7B', price: 0.02, status: '上架' },
  { id: 2, service: 'vision-ocr', model: 'OCR-Base', price: 0.01, status: '下架' },
]);

const notify = (text: string) => message.info(text);

function handleFilter() {
  currentPage.value = 1;
}

function handleReset() {
  keyword.value = '';
  currentPage.value = 1;
}
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <div class="flex flex-wrap items-center gap-4">
        <Input v-model:value="keyword" placeholder="搜索服务名/模型名" style="width: 260px" @press-enter="handleFilter" />
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary" @click="handleFilter">筛选</Button>
        <Button @click="handleReset">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button @click="notify('刷新成功')">刷新</Button>
    </template>

    <Table
      row-key="id"
      :data-source="rows.filter((r) => !keyword || `${r.service}${r.model}`.includes(keyword))"
      :pagination="false"
      :columns="[
        { title: '服务名称', dataIndex: 'service' },
        { title: '模型', dataIndex: 'model' },
        { title: '价格(¥/次)', dataIndex: 'price' },
        { title: '状态', dataIndex: 'status' },
        { title: '操作', dataIndex: 'action' },
      ]"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <Tag :color="record.status === '上架' ? 'success' : 'default'" class="rounded-full">
            {{ record.status }}
          </Tag>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <Space :size="0">
            <Button type="link" size="small" @click="notify(`编辑服务 ${record.service}`)">编辑</Button>
            <Button type="link" size="small" @click="notify(`${record.status === '上架' ? '下架' : '上架'}服务 ${record.service}`)">
              {{ record.status === '上架' ? '下架' : '上架' }}
            </Button>
          </Space>
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
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
</template>
