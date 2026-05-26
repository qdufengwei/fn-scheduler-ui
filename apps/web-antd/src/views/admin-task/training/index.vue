<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { Button, Card, Form, FormItem, Input, Popconfirm, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
const keyword = ref('');
const rows = ref([
  { id: 'TR-001', name: 'llm-pretrain-v3', tenant: '租户A', gpu: 16, status: '运行中', progress: 67 },
  { id: 'TR-002', name: 'cv-foundation', tenant: '租户B', gpu: 8, status: '排队中', progress: 0 },
]);
const form = ref({ name: '', tenant: '' });
const notify = (text: string) => message.info(text);

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[420px]!',
  title: '创建训练任务',
});
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Space wrap>
        <Input v-model:value="keyword" placeholder="搜索任务名称/ID" style="width: 260px" />
        <Button type="primary" @click="createDrawerApi.open()">创建训练任务</Button>
        <Button>筛选</Button>
        <Button @click="keyword = ''">重置</Button>
      </Space>
    </Card>
    <Card title="训练任务">
      <Table row-key="id" :data-source="rows.filter((r) => !keyword || `${r.id}${r.name}`.includes(keyword))" :columns="[
        { title: '任务ID', dataIndex: 'id' }, { title: '任务名称', dataIndex: 'name' }, { title: '租户', dataIndex: 'tenant' },
        { title: 'GPU', dataIndex: 'gpu' }, { title: '进度', dataIndex: 'progress', customRender: ({ text }) => `${text}%` }, { title: '状态', dataIndex: 'status' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag :color="record.status === '运行中' ? 'processing' : 'default'">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space><a @click="notify(`查看任务 ${record.id}`)">详情</a><a @click="notify(`停止任务 ${record.id}`)">停止</a><Popconfirm title="确认删除任务？" @confirm="notify(`删除任务 ${record.id}`)"><a class="text-red-500">删除</a></Popconfirm></Space></template>
        </template>
      </Table>
    </Card>
    <CreateDrawer>
      <Form layout="vertical" :model="form">
        <FormItem label="任务名称" required><Input v-model:value="form.name" /></FormItem>
        <FormItem label="归属租户" required><Input v-model:value="form.tenant" /></FormItem>
      </Form>
      <template #footer><Space><Button @click="createDrawerApi.close()">取消</Button><Button type="primary" @click="notify('已提交创建训练任务（原型）')">确认</Button></Space></template>
    </CreateDrawer>
  </div>
</template>
