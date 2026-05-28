<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import {
  Button,
  Input,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, RotateCw } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const router = useRouter();
const keyword = ref('');
const selected = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const rows = ref([
  {
    id: 'INF-001',
    service: 'chat-qwen2',
    framework: 'vLLM',
    status: '运行中',
    ready: 'Ready',
    replicas: 2,
    instances: 2,
    spec: 'A800',
    createdAt: '2026-05-25 10:30',
  },
  {
    id: 'INF-002',
    service: 'ocr-prod',
    framework: 'Triton',
    status: '运行中',
    ready: 'NotReady',
    replicas: 1,
    instances: 1,
    spec: 'A10',
    createdAt: '2026-05-24 14:20',
  },
  {
    id: 'INF-003',
    service: 'embedding-api',
    framework: 'vLLM',
    status: '已停止',
    ready: 'NotReady',
    replicas: 0,
    instances: 0,
    spec: 'A800',
    createdAt: '2026-05-20 09:15',
  },
  {
    id: 'INF-004',
    service: 'llama3-chat',
    framework: 'TGI',
    status: '异常',
    ready: 'NotReady',
    replicas: 2,
    instances: 1,
    spec: 'A100',
    createdAt: '2026-05-23 16:45',
  },
]);

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[480px]!',
  title: '创建推理服务',
});

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    运行中: 'success',
    已停止: 'default',
    异常: 'error',
  };
  return colorMap[status] || 'default';
};
</script>

<template>
  <div>
    <ListPageLayout>
      <template #filters>
        <div class="flex flex-wrap items-center gap-4">
          <Input
            v-model:value="keyword"
            placeholder="搜索服务名称/ID"
            style="width: 260px"
            allow-clear
          />
        </div>
      </template>

      <template #filterActions>
        <Space>
          <Button type="primary">筛选</Button>
          <Button @click="keyword = ''">重置</Button>
        </Space>
      </template>

      <template #toolbar>
        <Button
          type="primary"
          @click="router.push('/user-task/latest/inference/create')"
        >
          <template #icon><Plus class="size-4" /></template>
          创建推理服务
        </Button>
        <Button @click="showNotify('刷新成功')">
          <template #icon><RotateCw class="size-4" /></template>
          刷新
        </Button>
        <Popconfirm
          title="确认删除选中的服务？"
          @confirm="showNotify(`已删除 ${selected.length} 个服务`)"
          :disabled="selected.length === 0"
        >
          <Button danger :disabled="selected.length === 0">批量删除</Button>
        </Popconfirm>
      </template>

      <Table
        row-key="id"
        :row-selection="{
          selectedRowKeys: selected,
          onChange: (keys: any[]) => (selected = keys),
        }"
        :data-source="
          rows.filter(
            (r) => !keyword || `${r.id}${r.service}`.includes(keyword),
          )
        "
        :pagination="false"
        :columns="[
          { title: '服务名称', dataIndex: 'service' },
          { title: '服务ID', dataIndex: 'id' },
          { title: '状态', dataIndex: 'status' },
          { title: '推理框架', dataIndex: 'framework' },
          { title: '就绪状态', dataIndex: 'ready' },
          { title: '副本数', dataIndex: 'replicas' },
          { title: '实例数', dataIndex: 'instances' },
          { title: '资源规格', dataIndex: 'spec' },
          { title: '创建时间', dataIndex: 'createdAt' },
          { title: '操作', dataIndex: 'action' },
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'service'">
            <a class="text-blue-600 hover:text-blue-700">{{
              record.service
            }}</a>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <Tag :color="getStatusColor(record.status)" class="rounded-full">
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'ready'">
            <Tag
              :color="record.ready === 'Ready' ? 'success' : 'warning'"
              class="rounded-full"
            >
              {{ record.ready }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <Space :size="12">
              <a @click="showNotify(`查看服务 ${record.id}`)">详情</a>
              <a
                :class="{
                  'pointer-events-none text-gray-300':
                    record.status !== '运行中',
                }"
                @click="
                  record.status === '运行中' &&
                  showNotify(`扩容服务 ${record.id}`)
                "
              >
                扩容
              </a>
              <Popconfirm
                title="确认删除该服务？"
                @confirm="showNotify(`删除服务 ${record.id}`)"
              >
                <a class="text-red-500">删除</a>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>

      <div class="fn-list-pagination flex items-center justify-end">
        <Pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="rows.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['10', '20', '50', '100']"
        />
      </div>
    </ListPageLayout>

    <CreateDrawer>
      <div class="text-center text-gray-400 py-8">
        创建推理服务表单（原型演示）
      </div>
      <template #footer>
        <Space>
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button
            type="primary"
            @click="
              showNotify('已提交创建推理服务');
              createDrawerApi.close();
            "
          >
            确认
          </Button>
        </Space>
      </template>
    </CreateDrawer>
  </div>
</template>
