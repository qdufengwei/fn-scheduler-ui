<script setup lang="ts">
import { Button, Card, Input, Space, Table, Tabs, Tag } from 'ant-design-vue';
import { ref } from 'vue';
const tab = ref('preset');
const keyword = ref('');
const selected = ref<number[]>([]);
const rows = ref([
  { id: 1, name: 'Qwen2-7B-Instruct', source: '预置', version: 'v1.2', status: '可用', spec: 'A800', updated: '2026-05-25' },
  { id: 2, name: 'Llama3-8B-CN', source: '自定义', version: 'v0.3', status: '审核中', spec: 'A10', updated: '2026-05-24' },
]);

const resetFilters = () => {
  keyword.value = '';
};
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Tabs v-model:activeKey="tab" class="mb-3">
        <Tabs.TabPane key="preset" tab="预置模型" />
        <Tabs.TabPane key="custom" tab="自定义模型" />
      </Tabs>
      <Space wrap>
        <Input v-model:value="keyword" placeholder="支持模糊搜索模型仓库名称/ID" style="width: 280px" />
        <Button type="primary">部署</Button>
        <Button>微调</Button>
        <Button>导入模型</Button>
        <Button danger :disabled="selected.length === 0">批量删除</Button>
        <Button>筛选</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>
    <Card title="模型仓库">
      <Table
        row-key="id"
        :row-selection="{ selectedRowKeys: selected, onChange: (keys: number[]) => (selected = keys) }"
        :data-source="rows.filter((r)=>!keyword || r.name.includes(keyword)).filter((r) => tab === 'preset' ? r.source === '预置' : r.source !== '预置')"
        :columns="[
        { title: '模型名称', dataIndex: 'name' }, { title: '来源', dataIndex: 'source' }, { title: '版本', dataIndex: 'version' },
        { title: '资源规格', dataIndex: 'spec' }, { title: '更新时间', dataIndex: 'updated' }, { title: '状态', dataIndex: 'status' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex==='status'"><Tag :color="record.status==='可用'?'success':'processing'">{{record.status}}</Tag></template>
          <template v-else-if="column.dataIndex==='action'"><Space :size="0"><a>详情</a><a>部署</a></Space></template>
        </template>
      </Table>
    </Card>
  </div>
</template>
