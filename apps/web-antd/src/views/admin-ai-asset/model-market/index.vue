<script setup lang="ts">
import { Button, Card, Input, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
const keyword = ref('');
const rows = ref([
  { id: 1, service: 'chat-qwen2', model: 'Qwen2-7B', price: 0.02, status: '上架' },
  { id: 2, service: 'vision-ocr', model: 'OCR-Base', price: 0.01, status: '下架' },
]);
const notify = (text: string) => message.info(text);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4"><Space><Input v-model:value="keyword" placeholder="搜索服务名/模型名" style="width: 260px" /><Button>筛选</Button><Button @click="keyword = ''">重置</Button></Space></Card>
    <Card title="模型服务市场">
      <Table row-key="id" :data-source="rows.filter((r) => !keyword || `${r.service}${r.model}`.includes(keyword))" :columns="[
        { title: '服务名称', dataIndex: 'service' }, { title: '模型', dataIndex: 'model' }, { title: '价格(¥/次)', dataIndex: 'price' }, { title: '状态', dataIndex: 'status' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag :color="record.status === '上架' ? 'success' : 'default'">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space><a @click="notify(`编辑服务 ${record.service}`)">编辑</a><a @click="notify(`${record.status === '上架' ? '下架' : '上架'}服务 ${record.service}`)">{{ record.status === '上架' ? '下架' : '上架' }}</a></Space></template>
        </template>
      </Table>
    </Card>
  </div>
</template>
