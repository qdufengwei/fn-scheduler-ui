<script setup lang="ts">
import { Button, Card, Input, Popconfirm, Segmented, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const ownership = ref('all');
const keyword = ref('');
const rowSelection = ref<number[]>([]);
const rows = ref([
  { id: 'TR-001', name: 'llm-pretrain-v3', type: '分布式训练', status: '运行中', ready: 'Ready', duration: '3h 21m', created: '2026-05-26 09:20', instances: 8, priority: '高', recycle: '保留', gpu: 16, spec: 'H100', user: 'test01' },
  { id: 'TR-002', name: 'moe-stage2', type: '单机训练', status: '排队中', ready: 'NotReady', duration: '-', created: '2026-05-26 11:10', instances: 1, priority: '中', recycle: '删除', gpu: 2, spec: 'A800', user: 'test01' },
]);

const notify = (text: string) => message.info(text);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Space wrap>
        <Segmented v-model:value="ownership" :options="[{ label: '全部', value: 'all' }, { label: '我创建的', value: 'mine' }]" />
        
        <Input 
          v-model:value="keyword" 
          placeholder="支持模糊搜索任务名称/ID" 
          style="width: 260px" 
        />
        
        <Button type="primary" @click="router.push('/user-task/training/create')">创建任务</Button>

        <Button danger :disabled="rowSelection.length === 0">批量删除</Button>
        
        <Button @click="notify('列表已刷新')">刷新</Button>
      </Space>
    </Card>
    <Card title="训练任务列表">
      <Table
        row-key="id"
        :row-selection="{ selectedRowKeys: rowSelection, onChange: (keys: any[]) => (rowSelection = keys) }"
        :data-source="rows.filter((r) => (ownership === 'all' || r.user === 'test01') && (!keyword || `${r.name}${r.id}`.includes(keyword)))"
        :columns="[
        { title: '名称/ID', dataIndex: 'name' }, { title: '任务类型', dataIndex: 'type' }, { title: '状态', dataIndex: 'status' },
        { title: '就绪状态', dataIndex: 'ready' }, { title: '运行时长', dataIndex: 'duration' }, { title: '创建时间', dataIndex: 'created' },
        { title: '实例数量', dataIndex: 'instances' }, { title: '任务优先级', dataIndex: 'priority' }, { title: '回收策略', dataIndex: 'recycle' },
        { title: 'GPU数量', dataIndex: 'gpu' }, { title: '资源规格', dataIndex: 'spec' }, { title: '用户', dataIndex: 'user' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <Tag :color="record.status === '运行中' ? 'processing' : 'default'">{{ record.status }}</Tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <Space>
              <a @click="notify(`查看任务 ${record.id}`)">详情</a>
              <a :class="{ 'pointer-events-none text-gray-300': record.status !== '运行中' }" @click="record.status === '运行中' && notify(`停止任务 ${record.id}`)">停止</a>
              <Popconfirm title="确认删除该任务？" @confirm="notify(`删除任务 ${record.id}`)"><a class="text-red-500">删除</a></Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
