<script setup lang="ts">
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import {
  Button,
  Form,
  FormItem,
  Input,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref<number[]>([]);
const form = ref({ user: '', email: '', role: '算法用户' });

const rows = ref([
  {
    id: 1,
    user: 'a01',
    role: '租户管理员',
    status: '正常',
    tenant: 'test01',
    email: 'a01@example.com',
    created: '2026-03-10 03:32:24',
  },
  {
    id: 2,
    user: 'a02',
    role: '算法用户',
    status: '正常',
    tenant: 'test01',
    email: 'a02@example.com',
    created: '2026-04-18 10:11:00',
  },
  {
    id: 3,
    user: 'a03',
    role: '算法用户',
    status: '正常',
    tenant: 'test01',
    email: 'a03@example.com',
    created: '2026-05-01 09:15:30',
  },
  {
    id: 4,
    user: 'zhangsan',
    role: '租户管理员',
    status: '正常',
    tenant: 'ai-lab',
    email: 'zhangsan@ailab.cn',
    created: '2026-02-20 08:00:00',
  },
  {
    id: 5,
    user: 'lisi',
    role: '算法用户',
    status: '正常',
    tenant: 'ai-lab',
    email: 'lisi@ailab.cn',
    created: '2026-03-05 14:30:00',
  },
  {
    id: 6,
    user: 'wangwu',
    role: '算法用户',
    status: '已禁用',
    tenant: 'research-center',
    email: 'wangwu@research.cn',
    created: '2026-03-15 11:20:00',
  },
  {
    id: 7,
    user: 'zhaoliu',
    role: '算法用户',
    status: '正常',
    tenant: 'data-team',
    email: 'zhaoliu@datateam.cn',
    created: '2026-04-02 09:45:00',
  },
  {
    id: 8,
    user: 'sunqi',
    role: '租户管理员',
    status: '正常',
    tenant: 'cv-lab',
    email: 'sunqi@cvlab.cn',
    created: '2026-04-10 16:00:00',
  },
]);

function handleSelectionChange(keys: Array<number | string>) {
  selectedRowKeys.value = keys.map(Number);
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[420px]!',
  title: '添加用户',
});
</script>

<template>
  <div>
    <ListPageLayout>
      <template #filters>
        <div class="flex flex-wrap items-center gap-4">
          <Input
            v-model:value="keyword"
            placeholder="请输入用户"
            style="width: 220px"
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
        <Button type="primary" @click="createDrawerApi.open()">
          <template #icon><Plus class="size-4" /></template>
          添加用户
        </Button>
        <Button
          :disabled="selectedRowKeys.length === 0"
          @click="showNotify('开始绑定支付方式')"
        >
          支付方式绑定
        </Button>
        <Button @click="showNotify('刷新成功')">刷新</Button>
      </template>

      <Table
        row-key="id"
        :data-source="rows.filter((r) => !keyword || r.user.includes(keyword))"
        :pagination="false"
        :columns="[
          { title: '用户', dataIndex: 'user' },
          { title: '角色', dataIndex: 'role' },
          { title: '状态', dataIndex: 'status' },
          { title: '租户/别名', dataIndex: 'tenant' },
          { title: '邮箱', dataIndex: 'email' },
          { title: '创建时间', dataIndex: 'created' },
          { title: '操作', dataIndex: 'action' },
        ]"
        :row-selection="{ selectedRowKeys, onChange: handleSelectionChange }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'user'">
            <a class="text-blue-600 hover:text-blue-700">{{ record.user }}</a>
          </template>
          <template v-if="column.dataIndex === 'role'">
            <Tag
              :color="record.role === '租户管理员' ? 'blue' : 'default'"
              class="rounded-full"
            >
              {{ record.role }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <Tag color="success" class="rounded-full">{{ record.status }}</Tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <Space :size="0">
              <a @click="showNotify(`编辑用户 ${record.user}`)">编辑</a>
              <Popconfirm
                title="确认重置密码？"
                @confirm="showNotify(`已重置用户 ${record.user} 密码`)"
              >
                <a>修改密码</a>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>

      <div class="fn-list-pagination flex items-center justify-end">
        <Pagination
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :total="rows.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['10', '20', '50', '100']"
        />
      </div>
    </ListPageLayout>

    <CreateDrawer>
      <Form layout="vertical" :model="form">
        <FormItem label="用户" required>
          <Input v-model:value="form.user" placeholder="请输入用户名" />
        </FormItem>
        <FormItem label="邮箱" required>
          <Input v-model:value="form.email" placeholder="请输入邮箱" />
        </FormItem>
        <FormItem label="角色" required>
          <Input v-model:value="form.role" placeholder="请输入角色" />
        </FormItem>
      </Form>
      <template #footer>
        <Space>
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button
            type="primary"
            @click="
              showNotify('添加成功');
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
