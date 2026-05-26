<script setup lang="ts">
import { Button, Card, Input, Popconfirm, Segmented, Space, Table, message } from 'ant-design-vue';
import { ref } from 'vue';

const ownership = ref('all');
const keyword = ref('');
const rowSelection = ref<number[]>([]);
const recycleRows = ref([{ id: 'TR-099', name: 'old-exp', deletedAt: '2026-05-25 17:20', type: '单机训练', gpu: 1, spec: 'V100', owner: 'test01' }]);

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

        <Button danger :disabled="rowSelection.length === 0">批量删除</Button>
        
        <Button @click="notify('列表已刷新')">刷新</Button>
      </Space>
    </Card>
    <Card title="任务回收站">
      <Table
        row-key="id"
        :row-selection="{ selectedRowKeys: rowSelection, onChange: (keys: any[]) => (rowSelection = keys) }"
        :data-source="recycleRows.filter(r => (ownership === 'all' || r.owner === 'test01') && (!keyword || `${r.name}${r.id}`.includes(keyword)))"
        :columns="[
          { title: '名称/ID', dataIndex: 'name' }, { title: '删除时间', dataIndex: 'deletedAt' }, 
          { title: '任务类型', dataIndex: 'type' }, { title: 'GPU数量', dataIndex: 'gpu' }, 
          { title: '资源规格', dataIndex: 'spec' }, { title: '用户', dataIndex: 'owner' }, 
          { title: '操作', dataIndex: 'action' }
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <Space>
              <a @click="notify(`恢复任务 ${record.id}`)">恢复</a>
              <Popconfirm title="确认彻底删除？" @confirm="notify(`彻底删除任务 ${record.id}`)">
                <a class="text-red-500">彻底删除</a>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
