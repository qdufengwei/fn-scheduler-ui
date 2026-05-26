<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { Button, Card, Form, FormItem, Input, Popconfirm, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
const rows = ref([
  { id: 'FT-1001', baseModel: 'Qwen2-7B', dataset: '客服语料A', owner: '租户A', status: '成功' },
  { id: 'FT-1002', baseModel: 'Llama3-8B', dataset: '法律语料B', owner: '租户C', status: '运行中' },
]);
const form = ref({ model: '', dataset: '' });
const notify = (text: string) => message.info(text);

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[420px]!',
  title: '创建微调任务',
});
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4"><Space><Button type="primary" @click="createDrawerApi.open()">创建微调任务</Button><Button>筛选</Button></Space></Card>
    <Card title="模型微调任务">
      <Table row-key="id" :data-source="rows" :columns="[
        { title: '任务ID', dataIndex: 'id' }, { title: '基座模型', dataIndex: 'baseModel' }, { title: '数据集', dataIndex: 'dataset' },
        { title: '归属租户', dataIndex: 'owner' }, { title: '状态', dataIndex: 'status' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag :color="record.status === '成功' ? 'success' : 'processing'">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space><a @click="notify(`查看任务 ${record.id}`)">详情</a><a @click="notify(`停止任务 ${record.id}`)">停止</a><Popconfirm title="确认删除任务？" @confirm="notify(`删除任务 ${record.id}`)"><a class="text-red-500">删除</a></Popconfirm></Space></template>
        </template>
      </Table>
    </Card>
    <CreateDrawer>
      <Form layout="vertical" :model="form">
        <FormItem label="基座模型" required><Input v-model:value="form.model" /></FormItem>
        <FormItem label="数据集" required><Input v-model:value="form.dataset" /></FormItem>
      </Form>
      <template #footer><Space><Button @click="createDrawerApi.close()">取消</Button><Button type="primary" @click="notify('已提交创建微调任务（原型）')">确认</Button></Space></template>
    </CreateDrawer>
  </div>
</template>
