<script setup lang="ts">
import { Button, Input, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const keyword = ref('');
const rows = ref([
  { id: 1, image: 'registry.local/llm/train:2.1.0', size: '7.2GB', pull: 348, status: '稳定' },
  { id: 2, image: 'registry.local/vision/serving:1.0.4', size: '4.1GB', pull: 192, status: '灰度' },
]);
const notify = (text: string) => message.info(text);
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <div class="flex flex-wrap items-center gap-4">
        <Input v-model:value="keyword" placeholder="搜索镜像名称" style="width: 260px" />
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button @click="keyword = ''">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button type="primary" @click="notify('打开创建镜像抽屉（待扩展）')">创建镜像</Button>
      <Button>批量导入</Button>
      <Button>批量导出</Button>
      <Button>刷新</Button>
    </template>

      <Table row-key="id" :data-source="rows.filter((r) => !keyword || r.image.includes(keyword))" :columns="[
        { title: '镜像', dataIndex: 'image' }, { title: '大小', dataIndex: 'size' }, { title: '拉取次数', dataIndex: 'pull' }, { title: '状态', dataIndex: 'status' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag :color="record.status === '稳定' ? 'success' : 'warning'">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space><a @click="notify(`查看镜像 ${record.image}`)">详情</a><a class="text-red-500" @click="notify(`删除镜像 ${record.image}`)">删除</a></Space></template>
        </template>
      </Table>
  </ListPageLayout>
</template>
