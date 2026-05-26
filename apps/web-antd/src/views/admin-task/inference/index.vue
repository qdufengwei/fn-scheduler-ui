<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { Button, Card, Form, FormItem, Input, Popconfirm, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
const rows = ref([
  { id: 'INF-01', service: 'chat-qwen2', replicas: 4, qps: 128, latency: 86, status: '运行中' },
  { id: 'INF-02', service: 'ocr-prod', replicas: 2, qps: 43, latency: 112, status: '告警' },
]);
const form = ref({ name: '', framework: 'vLLM' });
const notify = (text: string) => message.info(text);

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[420px]!',
  title: '创建推理服务',
});
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4"><Space><Button type="primary" @click="createDrawerApi.open()">创建推理服务</Button><Button>筛选</Button></Space></Card>
    <Card title="推理服务">
      <Table row-key="id" :data-source="rows" :columns="[
        { title: '服务ID', dataIndex: 'id' }, { title: '服务名称', dataIndex: 'service' },
        { title: '副本数', dataIndex: 'replicas' }, { title: 'QPS', dataIndex: 'qps' },
        { title: 'P95延迟(ms)', dataIndex: 'latency' }, { title: '状态', dataIndex: 'status' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag :color="record.status === '告警' ? 'warning' : 'success'">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space><a @click="notify(`查看服务 ${record.id}`)">详情</a><a @click="notify(`扩容服务 ${record.id}`)">扩容</a><Popconfirm title="确认下线服务？" @confirm="notify(`下线服务 ${record.id}`)"><a class="text-red-500">下线</a></Popconfirm></Space></template>
        </template>
      </Table>
    </Card>
    <CreateDrawer>
      <Form layout="vertical" :model="form">
        <FormItem label="服务名称" required><Input v-model:value="form.name" /></FormItem>
        <FormItem label="推理框架" required><Input v-model:value="form.framework" /></FormItem>
      </Form>
      <template #footer><Space><Button @click="createDrawerApi.close()">取消</Button><Button type="primary" @click="notify('已提交创建推理服务（原型）')">确认</Button></Space></template>
    </CreateDrawer>
  </div>
</template>
