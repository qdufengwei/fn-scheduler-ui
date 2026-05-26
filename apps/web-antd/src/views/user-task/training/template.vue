<script setup lang="ts">
import { Button, Card, Input, Popconfirm, Space, Table, message } from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const keyword = ref('');
const rowSelection = ref<number[]>([]);
const templateRows = ref([{ id: 'TPL-01', name: '7B预训练模板', type: '分布式训练', image: 'ubuntu:20.04', gpu: 4, spec: 'A800', instances: 2, priority: '高', recycle: '保留', created: '2026-05-26 09:00', user: 'test01' }]);

const notify = (text: string) => message.info(text);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Space wrap>
        <Input 
          v-model:value="keyword" 
          placeholder="支持模糊搜索模板名称" 
          style="width: 260px" 
        />
        
        <Button type="primary" @click="router.push('/user-task/training/template/create')">创建任务模版</Button>

        <Button danger :disabled="rowSelection.length === 0">批量删除</Button>
      </Space>
    </Card>
    <Card title="任务模板列表">
      <Table
        row-key="id"
        :row-selection="{ selectedRowKeys: rowSelection, onChange: (keys: any[]) => (rowSelection = keys) }"
        :data-source="templateRows.filter(r => !keyword || r.name.includes(keyword))"
        :columns="[
          { title: '模板名称', dataIndex: 'name' }, { title: '任务类型', dataIndex: 'type' }, 
          { title: '镜像信息', dataIndex: 'image' }, { title: 'GPU数量', dataIndex: 'gpu' }, 
          { title: '资源规格', dataIndex: 'spec' }, { title: '实例数量', dataIndex: 'instances' }, 
          { title: '任务优先级', dataIndex: 'priority' }, { title: '回收策略', dataIndex: 'recycle' }, 
          { title: '创建时间', dataIndex: 'created' }, { title: '用户', dataIndex: 'user' }, 
          { title: '操作', dataIndex: 'action' }
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <Space>
              <a @click="router.push('/user-task/training/create')">创建任务</a>
              <a @click="router.push('/user-task/training/template/create')">修改模板</a>
              <Popconfirm title="确认删除模板？" @confirm="notify(`删除模板 ${record.id}`)">
                <a class="text-red-500">删除</a>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
