<script setup lang="ts">
import { Button, Card, Input, Segmented, Select, Space, Table } from 'ant-design-vue';
import { ref } from 'vue';
const tab = ref('repo');
const imageScope = ref('public');
const project = ref('kubesphereio');
const rows = ref([
  { id: 1, name: 'kubesphereio/train-runtime', count: 12, pulls: 3401, created: '2026-05-02', updated: '2026-05-25' },
  { id: 2, name: 'tenant/test01-custom', count: 3, pulls: 412, created: '2026-05-10', updated: '2026-05-23' },
]);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Space direction="vertical" style="width: 100%">
        <Segmented v-model:value="tab" :options="[{label:'镜像仓库',value:'repo'},{label:'镜像任务',value:'task'}]" />
        <Space wrap>
          <Segmented v-model:value="imageScope" :options="[{label:'公共镜像',value:'public'},{label:'私有镜像',value:'private'}]" />
          <Select v-model:value="project" style="width: 180px" :options="[{label:'kubesphereio',value:'kubesphereio'},{label:'test01',value:'test01'}]" />
          <Input placeholder="请输入镜像名称" style="width: 220px" />
          <Button type="primary">创建镜像</Button>
          <Button danger>批量删除</Button>
          <Button>筛选</Button>
          <Button>重置</Button>
        </Space>
      </Space>
    </Card>
    <Card :title="tab === 'repo' ? '镜像列表' : '镜像任务'">
      <Table v-if="tab === 'repo'" row-key="id" :data-source="rows" :columns="[
        { title: '镜像名称', dataIndex: 'name' }, { title: '镜像数量', dataIndex: 'count' }, { title: '拉取次数', dataIndex: 'pulls' },
        { title: '创建时间', dataIndex: 'created' }, { title: '更新时间', dataIndex: 'updated' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column }"><template v-if="column.dataIndex==='action'"><Space :size="0"><a>详情</a><a>删除</a></Space></template></template>
      </Table>
      <Table v-else row-key="id" :data-source="[{id:1,name:'build-runtime-v1',status:'成功',time:'2026-05-25 11:20'}]" :columns="[
        { title: '任务名称', dataIndex: 'name' }, { title: '状态', dataIndex: 'status' }, { title: '时间', dataIndex: 'time' },
      ]" />
    </Card>
  </div>
</template>
