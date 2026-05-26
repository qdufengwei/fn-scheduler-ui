<script setup lang="ts">
import { Button, Card, Input, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
const keyword = ref('');
const rows = ref([
  { id: 1, name: '客服问答语料', size: '124GB', samples: 1200000, owner: '平台', status: '可用' },
  { id: 2, name: '医学影像样本', size: '2.1TB', samples: 84000, owner: '租户A', status: '审核中' },
]);
const notify = (text: string) => message.info(text);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4"><Space><Input v-model:value="keyword" placeholder="搜索数据集名称" style="width: 260px" /><Button type="primary" @click="notify('打开新建数据集抽屉（待扩展）')">新建数据集</Button><Button>筛选</Button><Button @click="keyword = ''">重置</Button></Space></Card>
    <Card title="数据集">
      <Table row-key="id" :data-source="rows.filter((r) => !keyword || r.name.includes(keyword))" :columns="[
        { title: '名称', dataIndex: 'name' }, { title: '大小', dataIndex: 'size' }, { title: '样本数', dataIndex: 'samples' }, { title: '归属', dataIndex: 'owner' }, { title: '状态', dataIndex: 'status' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag :color="record.status === '可用' ? 'success' : 'processing'">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space><a @click="notify(`查看数据集 ${record.name}`)">详情</a><a @click="notify(`审核数据集 ${record.name}`)">审核</a></Space></template>
        </template>
      </Table>
    </Card>
  </div>
</template>
