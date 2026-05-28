<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { ref, computed } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Button,
  Card,
  Input,
  Pagination,
  Space,
  Table,
  Form,
  FormItem,
  Select,
  Dropdown,
  Menu,
} from 'ant-design-vue';
import { Plus, Search, UserRoundPen, Ellipsis } from '@vben/icons';
import type { MenuProps } from 'ant-design-vue';

import { showNotify, showWarning } from '#/utils/notify';

type Key = string | number;

const userSearchText = ref('');
const selectedTenant = ref<string | undefined>(undefined);
const selectedRowKeys = ref<Key[]>([]);
const userPageSize = ref(10);
const userCurrentPage = ref(1);

const userColumns = [
  { title: '', dataIndex: 'checkbox', width: 50 },
  { title: '用户', dataIndex: 'username', width: 150 },
  { title: '角色', dataIndex: 'role', width: 120 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '租户/别名', dataIndex: 'tenantAlias', width: 200 },
  { title: '邮箱', dataIndex: 'email', width: 200 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', dataIndex: 'action', width: 200 },
];

const tenantDataSource = ref([
  { id: 1, tenant: 'sx-telecom', alias: '陕西电信' },
  { id: 2, tenant: 'test-0415', alias: '-' },
  { id: 3, tenant: 'shiyusuanli-testxq', alias: 'shiyusuanli-testxq' },
  {
    id: 4,
    tenant: 'shiyusuanli-demandertest',
    alias: 'shiyusuanli-demandertest',
  },
  { id: 5, tenant: 'moon', alias: '-' },
  { id: 6, tenant: 'test01', alias: '-' },
  { id: 7, tenant: 'platform-operator', alias: 'platform-operator' },
]);

const userDataSource = ref([
  {
    id: 1,
    username: 'sx-telecom',
    role: '租户管理员',
    status: '正常',
    tenant: 'sx-telecom',
    alias: '陕西电信',
    email: 'sx-telecom@123.com',
    createTime: '2026-05-26 07:51:19',
  },
  {
    id: 2,
    username: 'a01',
    role: '算法用户',
    status: '正常',
    tenant: 'test01',
    alias: '-',
    email: '123456@qq.com',
    createTime: '2026-04-27 01:28:25',
  },
  {
    id: 3,
    username: 'test-0415',
    role: '租户管理员',
    status: '正常',
    tenant: 'test-0415',
    alias: '-',
    email: 'test-0415@123.com',
    createTime: '2026-04-15 09:43:03',
  },
  {
    id: 4,
    username: 'shiyusuanli-testxq',
    role: '租户管理员',
    status: '正常',
    tenant: 'shiyusuanli-testxq',
    alias: 'shiyusuanli-testxq',
    email: '12@qc.com',
    createTime: '2026-03-26 11:55:35',
  },
  {
    id: 5,
    username: 'shiyusuanli-demandertest',
    role: '租户管理员',
    status: '正常',
    tenant: 'shiyusuanli-demandertest',
    alias: 'shiyusuanli-demandertest',
    email: 'lz18738377974@163.com',
    createTime: '2026-03-25 12:37:20',
  },
  {
    id: 6,
    username: 'hellna',
    role: '租户管理员',
    status: '正常',
    tenant: 'test01',
    alias: '-',
    email: 'mememeee@qq.com',
    createTime: '2026-03-25 12:05:12',
  },
  {
    id: 7,
    username: 'test03',
    role: '算法用户',
    status: '正常',
    tenant: 'test01',
    alias: '-',
    email: 'test03@infrawaves.com',
    createTime: '2026-03-10 03:33:44',
  },
  {
    id: 8,
    username: 'test02',
    role: '算法用户',
    status: '正常',
    tenant: 'test01',
    alias: '-',
    email: 'test02@infrawaves.com',
    createTime: '2026-03-10 03:32:24',
  },
  {
    id: 9,
    username: 'liuhe',
    role: '算法用户',
    status: '正常',
    tenant: 'moon',
    alias: '-',
    email: '456224@iuieiw.com',
    createTime: '2026-03-04 07:35:29',
  },
  {
    id: 10,
    username: 'yanmin',
    role: '算法用户',
    status: '正常',
    tenant: 'moon',
    alias: '-',
    email: 'yanmin@infrawaves.com',
    createTime: '2026-03-04 07:33:34',
  },
]);

// 租户选项
const tenantOptions = computed(() => [
  { value: undefined, label: '请选择租户' },
  ...tenantDataSource.value.map((t) => ({ value: t.tenant, label: t.tenant })),
]);

const filteredUserData = computed(() => {
  return userDataSource.value.filter((user) => {
    const matchTenant =
      !selectedTenant.value || user.tenant === selectedTenant.value;
    const matchSearch =
      !userSearchText.value ||
      user.username.includes(userSearchText.value) ||
      user.email.includes(userSearchText.value);
    return matchTenant && matchSearch;
  });
});

const userForm = ref({
  role: '租户管理员',
  username: '',
  alias: '',
  email: '',
  phone: '',
  timezone: '(UTC+00:00) 协调世界时 (UTC)',
  remark: '',
  password: '',
  confirmPassword: '',
});

function handleAddUser() {
  createUserDrawerApi.open();
}

function handleSaveUser() {
  showNotify('添加用户成功（原型）');
  createUserDrawerApi.close();
}

function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0) {
    showWarning('请先选择要删除的用户');
    return;
  }
  showNotify(`批量删除 ${selectedRowKeys.value.length} 个用户（原型）`);
  selectedRowKeys.value = [];
}

const [CreateUserDrawer, createUserDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[480px]!',
  title: '添加用户',
});

function getMoreMenu(): MenuProps['items'] {
  return [
    { key: 'disable', label: '禁用' },
    { key: 'delete', label: '删除' },
  ];
}

function handleMoreMenuClick(key: string, username: string) {
  if (key === 'disable') {
    showNotify(`禁用用户 ${username}（原型）`);
  } else if (key === 'delete') {
    showNotify(`删除用户 ${username}（原型）`);
  }
}

function handleRowSelectionChange(keys: Key[]) {
  selectedRowKeys.value = keys;
}
</script>

<template>
  <Page auto-content-height>
    <Card :bordered="false" class="shadow-sm">
      <div class="flex items-center gap-2 mb-4">
        <UserRoundPen class="size-5 text-blue-500" />
        <span class="text-lg font-semibold">用户管理</span>
      </div>

      <div class="flex items-center justify-between mb-4">
        <Space>
          <Select
            v-model:value="selectedTenant"
            :options="tenantOptions"
            style="width: 160px"
            allow-clear
            placeholder="请选择租户"
          />
          <Input
            v-model:value="userSearchText"
            placeholder="请输入用户"
            style="width: 200px"
            allow-clear
          >
            <template #prefix><Search class="size-4 text-gray-400" /></template>
          </Input>
        </Space>
        <Space>
          <Button type="primary" @click="handleAddUser">
            <template #icon><Plus class="size-4" /></template>
            添加用户
          </Button>
          <Button
            :disabled="selectedRowKeys.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </Button>
        </Space>
      </div>

      <Table
        row-key="id"
        :data-source="filteredUserData"
        :pagination="false"
        :columns="userColumns"
        :row-selection="{ selectedRowKeys, onChange: handleRowSelectionChange }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'checkbox'">
            <div />
          </template>
          <template v-if="column.dataIndex === 'username'">
            <span>{{ record.username }}</span>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <span>{{ record.status }}</span>
          </template>
          <template v-if="column.dataIndex === 'tenantAlias'">
            <div>
              <span>{{ record.tenant }}</span>
              <span class="text-gray-400 ml-1">{{ record.alias }}</span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <Space>
              <Button
                type="link"
                size="small"
                @click="showNotify(`编辑用户 ${record.username}`)"
              >
                编辑
              </Button>
              <Button
                type="link"
                size="small"
                @click="showNotify(`修改密码 ${record.username}`)"
              >
                修改密码
              </Button>
              <Dropdown>
                <Button type="link" size="small">
                  <Ellipsis class="size-4" />
                </Button>
                <template #overlay>
                  <Menu
                    :items="getMoreMenu()"
                    @click="
                      (info: any) =>
                        handleMoreMenuClick(String(info.key), record.username)
                    "
                  />
                </template>
              </Dropdown>
            </Space>
          </template>
        </template>
      </Table>

      <div class="flex items-center justify-end mt-4 pt-4 border-t">
        <Pagination
          v-model:current="userCurrentPage"
          v-model:pageSize="userPageSize"
          :total="filteredUserData.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['10', '20', '50', '100']"
          :show-total="(total: number) => `共 ${total} 条`"
        />
      </div>
    </Card>

    <!-- 添加用户抽屉 -->
    <CreateUserDrawer>
      <Form layout="vertical" :model="userForm">
        <div class="mb-4">
          <div class="text-base font-medium mb-3">基础信息</div>
          <FormItem label="角色" required>
            <Select
              v-model:value="userForm.role"
              :options="[
                { value: '租户管理员', label: '租户管理员' },
                { value: '算法用户', label: '算法用户' },
              ]"
            />
          </FormItem>
          <FormItem label="用户名" required>
            <Input
              v-model:value="userForm.username"
              placeholder="请输入用户名"
            />
          </FormItem>
          <FormItem label="别名" required>
            <Input v-model:value="userForm.alias" placeholder="请输入别名" />
          </FormItem>
          <FormItem label="邮箱" required>
            <Input v-model:value="userForm.email" placeholder="请输入邮箱" />
          </FormItem>
          <FormItem label="手机号">
            <Input v-model:value="userForm.phone" placeholder="请输入手机号" />
          </FormItem>
          <FormItem label="时区">
            <Select
              v-model:value="userForm.timezone"
              :options="[
                {
                  value: '(UTC+00:00) 协调世界时 (UTC)',
                  label: '(UTC+00:00) 协调世界时 (UTC)',
                },
                {
                  value: '(UTC+08:00) 北京时间',
                  label: '(UTC+08:00) 北京时间',
                },
              ]"
            />
          </FormItem>
          <FormItem label="备注">
            <Input v-model:value="userForm.remark" placeholder="请输入备注" />
          </FormItem>
        </div>
        <div class="border-t pt-4">
          <div class="text-base font-medium mb-3">账号配置</div>
          <FormItem label="新密码" required>
            <Input.Password
              v-model:value="userForm.password"
              placeholder="请输入新密码"
            />
          </FormItem>
          <FormItem label="确认密码" required>
            <Input.Password
              v-model:value="userForm.confirmPassword"
              placeholder="请输入确认密码"
            />
          </FormItem>
        </div>
      </Form>
      <template #footer>
        <Space>
          <Button @click="createUserDrawerApi.close()">取消</Button>
          <Button type="primary" @click="handleSaveUser">确认</Button>
        </Space>
      </template>
    </CreateUserDrawer>
  </Page>
</template>
