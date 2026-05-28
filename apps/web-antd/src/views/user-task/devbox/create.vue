<script setup lang="ts">
import { Page } from '@vben/common-ui';
import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Select,
  Space,
  Switch,
  Divider,
  InputNumber,
} from 'ant-design-vue';
import { Info, ArrowLeft } from '@vben/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { showInfo } from '#/utils/notify';

const router = useRouter();
const form = ref({
  name: '',
  type: 'Jupyter',
  customImage: false,
  workDir: '',
  mig: false,
  dedicated: false,
  vgpu: false,
  spec: undefined,
  gpu: 0,
  cpu: 4,
  memory: 32,
  ssh: false,
});

const goBack = () => {
  router.push('/user-task/devbox');
};
</script>

<template>
  <Page>
    <Card>
      <!-- Title with back button -->
      <div class="flex items-center justify-between border-b pb-4 mb-4">
        <div class="flex items-center gap-2 cursor-pointer" @click="goBack">
          <ArrowLeft
            class="size-6 text-gray-600 hover:text-black transition-colors"
          />
          <span class="text-lg font-semibold text-gray-800"
            >创建开发机 · 高级切换</span
          >
        </div>
        <Space>
          <span class="text-sm font-medium">YAML</span>
          <Switch size="small" />
        </Space>
      </div>

      <Form layout="vertical" class="px-2" :model="form">
        <!-- 基础信息 -->
        <h3 class="font-bold mb-4 text-base">基础信息</h3>

        <FormItem label="名称" required>
          <Input
            v-model:value="form.name"
            placeholder="仅支持中文、字母、数字及-、_、.、()符号"
          />
        </FormItem>

        <FormItem label="类型" required>
          <div class="flex gap-4">
            <!-- Jupyter Card -->
            <div
              class="border-2 rounded-lg p-4 w-36 flex flex-col items-center justify-center cursor-pointer transition-all"
              :class="
                form.type === 'Jupyter'
                  ? 'border-blue-500 bg-blue-50/10'
                  : 'border-gray-200 hover:border-gray-300'
              "
              @click="form.type = 'Jupyter'"
            >
              <svg
                class="size-12 mb-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C14.76 4 17.13 5.37 18.5 7.46L13.88 12.08C13.38 11.4 12.72 10.87 11.95 10.57L11.08 7.37C11.38 7.3 11.68 7.25 12 7.25C12.32 7.25 12.62 7.3 12.92 7.37L13.79 10.57C13.02 10.87 12.36 11.4 11.86 12.08L7.24 7.46C8.61 5.37 10.98 4 12 4Z"
                  fill="#F37626"
                />
              </svg>
              <span class="font-bold text-sm text-gray-800">Jupyter</span>
            </div>
            <!-- VSCode Card -->
            <div
              class="border-2 rounded-lg p-4 w-36 flex flex-col items-center justify-center cursor-pointer transition-all"
              :class="
                form.type === 'VSCode'
                  ? 'border-blue-500 bg-blue-50/10'
                  : 'border-gray-200 hover:border-gray-300'
              "
              @click="form.type = 'VSCode'"
            >
              <svg
                class="size-12 mb-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.9 6.5l-2.7-2.7c-.3-.3-.8-.3-1.1 0L12 11.9 3.9 3.8c-.3-.3-.8-.3-1.1 0L.1 6.5c-.2.2-.2.5 0 .7L5.5 12 .1 16.8c-.2.2-.2.5 0 .7l2.7 2.7c.3.3.8.3 1.1 0L12 12.1l8.1 8.1c.3.3.8.3 1.1 0l2.7-2.7c.2-.2.2-.5 0-.7L18.5 12l5.4-4.8c.2-.2.2-.5 0-.7z"
                  fill="#007ACC"
                />
              </svg>
              <span class="font-bold text-sm text-gray-800">VSCode</span>
            </div>
          </div>
        </FormItem>

        <FormItem label="自定义镜像">
          <Switch v-model:checked="form.customImage" size="small" />
        </FormItem>

        <FormItem label="工作目录" required>
          <Input v-model:value="form.workDir" />
        </FormItem>

        <Divider />

        <!-- 资源配置 -->
        <h3 class="font-bold mb-4 text-base">资源配置</h3>
        <FormItem label="实例配置" required>
          <div class="flex items-center gap-6 mb-2">
            <Space
              ><Switch v-model:checked="form.mig" size="small" />
              启用MIG模式</Space
            >
            <Space
              ><Switch v-model:checked="form.dedicated" size="small" />
              整机调度</Space
            >
            <Space
              ><Switch v-model:checked="form.vgpu" size="small" /> vGPU</Space
            >
          </div>
          <div class="mb-4 text-gray-500 text-sm flex items-center">
            <Info class="mr-1 size-4" /> 当前所选类型暂无资源，可点击
            <a class="text-blue-500 ml-1">【购买】</a> 获取资源
          </div>

          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="text-xs mb-1 text-gray-500">资源规格</div>
              <Select
                v-model:value="form.spec"
                placeholder="请输入资源规格"
                class="w-full"
              />
            </div>
            <div class="w-28">
              <div class="text-xs mb-1 text-gray-500">GPU数量</div>
              <InputNumber v-model:value="form.gpu" class="w-full" />
            </div>
            <div class="w-28">
              <div class="text-xs mb-1 text-gray-500">CPU(核)</div>
              <InputNumber v-model:value="form.cpu" class="w-full" />
            </div>
            <div class="w-28">
              <div class="text-xs mb-1 text-gray-500">内存(GiB)</div>
              <InputNumber v-model:value="form.memory" class="w-full" />
            </div>
          </div>
        </FormItem>

        <FormItem label="存储" required>
          <Space class="mb-3">
            <Button size="small" class="text-blue-500 border-blue-500"
              >+ 存储卷</Button
            >
            <Button size="small" class="text-blue-500 border-blue-500"
              >+ S3</Button
            >
          </Space>
          <div class="text-xs text-gray-400 leading-relaxed space-y-1">
            <div class="flex items-start">
              <Info class="mr-1 size-3 mt-0.5 shrink-0" />
              存储卷，S3：每个挂载目录不可重复。
            </div>
            <div class="flex items-start">
              <Info class="mr-1 size-3 mt-0.5 shrink-0" /> 存储卷：可通过 "库 ->
              存储" 页面管理的持久卷。
            </div>
            <div class="flex items-start">
              <Info class="mr-1 size-3 mt-0.5 shrink-0" />
              容器路径：持久卷在容器内部挂载的路径。
            </div>
            <div class="flex items-start">
              <Info class="mr-1 size-3 mt-0.5 shrink-0" /> 临时卷：由 EmptyDir
              提供支持的临时卷，其生命周期与 Pod 绑定。
            </div>
            <div class="flex items-start">
              <Info class="mr-1 size-3 mt-0.5 shrink-0" /> 主机路径：由 Host
              Path 提供支持的卷，用于将宿主机节点文件系统中的目录或文件挂载到
              Pod 内。
            </div>
          </div>
        </FormItem>

        <Divider />

        <!-- 创建SSH -->
        <FormItem label="创建SSH">
          <Switch v-model:checked="form.ssh" size="small" />
          <div class="text-xs text-gray-400 mt-2 flex items-start">
            <Info class="mr-1 size-3 mt-0.5 shrink-0" /> 创建成功后可获取 ip 和
            port 信息远程接入开发机
          </div>
        </FormItem>
      </Form>

      <div class="flex items-center justify-between mt-8 border-t pt-4">
        <Space>
          <Button type="primary" @click="showInfo('已提交创建开发机')"
            >确认</Button
          >
          <Button @click="goBack">取消</Button>
        </Space>
      </div>
    </Card>
  </Page>
</template>
