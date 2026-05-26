<script setup lang="ts">
import { Button, Card, Input, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const keyword = ref('');
const selected = ref<string[]>([]);
const rows = ref([
  { id: 'INF-001', service: 'chat-qwen2', framework: 'vLLM', status: '运行中', ready: 'Ready', replicas: 2, instances: 2, spec: 'A800', user: 'test01' },
  { id: 'INF-002', service: 'ocr-prod', framework: 'Triton', status: '运行中', ready: 'NotReady', replicas: 1, instances: 1, spec: 'A10', user: 'test01' },
]);

const resetFilters = () => {
  keyword.value = '';
};
const notify = (text: string) => message.info(text);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Space wrap>
        <Input v-model:value="keyword" placeholder="搜索服务名称" style="width: 260px" />
        <Button type="primary" @click="router.push('/user-task/inference/create')">创建推理服务</Button>
        <Button danger :disabled="selected.length === 0">批量删除</Button>
        <Button>筛选</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>
    <Card title="推理服务">
      <Table
        row-key="id"
        :row-selection="{ selectedRowKeys: selected, onChange: (keys: any[]) => (selected = keys) }"
        :data-source="rows.filter((r) => !keyword || `${r.id}${r.service}`.includes(keyword))"
        :columns="[
        { title: '名称/ID', dataIndex: 'service' }, { title: '状态', dataIndex: 'status' }, { title: '推理框架', dataIndex: 'framework' },
        { title: '就绪状态', dataIndex: 'ready' }, { title: '当前副本数', dataIndex: 'replicas' }, { title: '实例数量', dataIndex: 'instances' },
        { title: '资源规格', dataIndex: 'spec' }, { title: '用户', dataIndex: 'user' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag :color="record.status === '运行中' ? 'success' : 'default'">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'ready'"><Tag :color="record.ready === 'Ready' ? 'success' : 'warning'">{{ record.ready }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space><a @click="notify(`查看服务 ${record.id}`)">详情</a><a @click="notify(`扩容服务 ${record.id}`)">扩容</a></Space></template>
        </template>
      </Table>
    </Card>
  </div>
</template>
