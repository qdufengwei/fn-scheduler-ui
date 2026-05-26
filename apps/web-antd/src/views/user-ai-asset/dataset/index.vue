<script setup lang="ts">
import { Button, Card, Input, Space, Table, Tag } from 'ant-design-vue';
import { ref } from 'vue';
const keyword = ref('');
const selected = ref<number[]>([]);
const rows = ref([
  { id: 1, name: '客服语料A', size: '124GB', samples: 1200000, status: '可用', updated: '2026-05-25', owner: 'test01' },
  { id: 2, name: '医学影像B', size: '2.1TB', samples: 84000, status: '审核中', updated: '2026-05-24', owner: 'test01' },
]);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Space wrap>
        <Input v-model:value="keyword" placeholder="支持模糊搜索数据集名称/ID" style="width: 280px" />
        <Button type="primary">新建数据集</Button>
        <Button danger :disabled="selected.length === 0">批量删除</Button>
        <Button>筛选</Button>
        <Button @click="keyword = ''">重置</Button>
      </Space>
    </Card>
    <Card title="数据集">
      <Table
        row-key="id"
        :row-selection="{ selectedRowKeys: selected, onChange: (keys: number[]) => (selected = keys) }"
        :data-source="rows.filter((r)=>!keyword || r.name.includes(keyword))"
        :columns="[
        { title: '名称', dataIndex: 'name' }, { title: '大小', dataIndex: 'size' }, { title: '样本数', dataIndex: 'samples' },
        { title: '状态', dataIndex: 'status' }, { title: '用户', dataIndex: 'owner' }, { title: '更新时间', dataIndex: 'updated' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex==='status'"><Tag :color="record.status==='可用'?'success':'processing'">{{record.status}}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space :size="0"><a>详情</a><a>挂载</a></Space></template>
        </template>
      </Table>
    </Card>
  </div>
</template>
