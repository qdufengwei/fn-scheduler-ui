<script setup lang="ts">
import { Button, Card, Input, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const keyword = ref('');
const selected = ref<string[]>([]);
const rows = ref([
  { id: 'FT-1001', name: '客服场景微调', model: 'Qwen2-7B', status: '运行中', ready: 'Ready', duration: '1h 10m', created: '2026-05-26 11:20', instances: 2, gpu: 4, spec: 'A800', user: 'test01' },
  { id: 'FT-1002', name: '法务语料微调', model: 'Llama3-8B', status: '成功', ready: 'Ready', duration: '3h 40m', created: '2026-05-25 14:03', instances: 1, gpu: 2, spec: 'A10', user: 'test01' },
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
        <Input v-model:value="keyword" placeholder="搜索任务ID/模型名" style="width: 260px" />
        <Button type="primary" @click="router.push('/user-task/finetune/create')">创建微调任务</Button>
        <Button danger :disabled="selected.length === 0">批量删除</Button>
        <Button>筛选</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>
    <Card title="模型微调任务">
      <Table
        row-key="id"
        :row-selection="{ selectedRowKeys: selected, onChange: (keys: any[]) => (selected = keys) }"
        :data-source="rows.filter((r) => !keyword || `${r.id}${r.model}${r.name}`.includes(keyword))"
        :columns="[
        { title: '名称/ID', dataIndex: 'name' }, { title: '状态', dataIndex: 'status' }, { title: '模型名称', dataIndex: 'model' },
        { title: '就绪状态', dataIndex: 'ready' }, { title: '运行时长', dataIndex: 'duration' }, { title: '创建时间', dataIndex: 'created' },
        { title: '实例数量', dataIndex: 'instances' }, { title: 'GPU数量', dataIndex: 'gpu' }, { title: '资源规格', dataIndex: 'spec' },
        { title: '用户', dataIndex: 'user' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <Tag :color="record.status === '成功' ? 'success' : 'processing'">{{ record.status }}</Tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <Space>
              <a @click="notify(`查看微调任务 ${record.id}`)">详情</a>
              <a :class="{ 'pointer-events-none text-gray-300': record.status !== '运行中' }" @click="record.status === '运行中' && notify(`停止微调任务 ${record.id}`)">停止</a>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
