<script setup lang="ts">
import { Page } from '@vben/common-ui';
import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Space,
  Switch,
  Divider,
  Select,
  InputNumber,
  Segmented,
} from 'ant-design-vue';
import { Info, Plus, ArrowLeft } from '@vben/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { showInfo } from '#/utils/notify';

const router = useRouter();
const createForm = ref({ name: '' });

const goBack = () => {
  router.push('/user-task/latest/inference');
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
            >创建推理服务 · 高级切换</span
          >
        </div>
        <Space>
          <span class="text-sm font-medium">YAML</span>
          <Switch size="small" />
        </Space>
      </div>

      <Form layout="vertical" class="px-2" :model="createForm">
        <!-- 基础信息 -->
        <h3 class="font-bold mb-4 text-base">基础信息</h3>
        <FormItem label="服务名称" required>
          <Input
            v-model:value="createForm.name"
            placeholder="仅支持中文、字母、数字及-、_、.、()符号"
          />
        </FormItem>
        <FormItem label="描述">
          <Input.TextArea
            :rows="4"
            placeholder="请输入推理服务描述"
            :maxlength="1024"
            show-count
          />
        </FormItem>

        <Divider />

        <!-- 环境配置 -->
        <h3 class="font-bold mb-4 text-base">环境配置</h3>
        <FormItem label="分布式推理">
          <Switch size="small" />
          <div class="text-xs text-gray-400 mt-2 flex items-start">
            <Info class="mr-1 size-3 mt-0.5 shrink-0" />
            每个实例部署在多台机器上进行部署。例如需要 4 个实例，单实例部署 of
            机器数为 2，则一共需要 4x2=8 台机器来部署该服务
          </div>
        </FormItem>

        <FormItem label="推理框架" required>
          <Segmented :options="['预置框架', '自定义框架']" class="mb-3" />
          <Select placeholder="请选择推理框架" class="w-full" />
        </FormItem>

        <FormItem label="模型仓库" required>
          <Input placeholder="请选择模型仓库">
            <template #addonAfter>
              <Plus class="cursor-pointer size-4" />
            </template>
          </Input>
        </FormItem>

        <FormItem label="环境变量">
          <a class="text-blue-500">+ 新增环境变量</a>
        </FormItem>

        <Divider />

        <!-- 资源配置 -->
        <h3 class="font-bold mb-4 text-base">资源配置</h3>
        <FormItem label="实例配置" required>
          <div class="flex items-center gap-6 mb-2">
            <Space><Switch size="small" /> 启用MIG模式</Space>
            <Space><Switch size="small" /> 整机调度</Space>
            <Space><Switch size="small" /> vGPU</Space>
          </div>
          <div class="mb-4 text-gray-500 text-sm flex items-center">
            <Info class="mr-1 size-4" /> 当前所选类型暂无资源，可点击
            <a class="text-blue-500 ml-1">【购买】</a> 获取资源
          </div>

          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="text-xs mb-1 text-gray-500">资源规格</div>
              <Select placeholder="请输入资源规格" class="w-full" />
            </div>
            <div class="w-28">
              <div class="text-xs mb-1 text-gray-500">GPU数量</div>
              <InputNumber :value="1" class="w-full" />
            </div>
            <div class="w-28">
              <div class="text-xs mb-1 text-gray-500">CPU(核)</div>
              <InputNumber :value="0" class="w-full" />
            </div>
            <div class="w-28">
              <div class="text-xs mb-1 text-gray-500">内存(GiB)</div>
              <InputNumber :value="0" class="w-full" />
            </div>
          </div>
        </FormItem>

        <FormItem label="副本数">
          <InputNumber :value="1" :min="1" />
          <div class="text-xs text-gray-400 mt-2 flex items-start">
            <Info class="mr-1 size-3 mt-0.5 shrink-0" />
            设置或调整部署的副本数量，可提高部署的吞吐量和响应速度
          </div>
        </FormItem>

        <FormItem label="存储">
          <Space class="mb-3">
            <Button size="small" class="text-blue-500 border-blue-500"
              >+ 存储卷</Button
            >
            <Button size="small" class="text-blue-500 border-blue-500"
              >+ 临时卷</Button
            >
            <Button size="small" class="text-blue-500 border-blue-500"
              >+ S3</Button
            >
          </Space>
          <div class="text-xs text-gray-400 leading-relaxed space-y-1">
            <div class="flex items-start">
              <Info class="mr-1 size-3 mt-0.5 shrink-0" />
              存储卷，临时卷，S3：每个挂载目录不可重复。
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

        <!-- 高级配置 -->
        <h3 class="font-bold mb-4 text-base">高级配置</h3>
        <FormItem label="扩缩容">
          <div class="flex items-center gap-2">
            <Switch size="small" />
            <span class="text-xs text-gray-400">关闭</span>
          </div>
        </FormItem>
      </Form>

      <div class="flex items-center justify-between mt-8 border-t pt-4">
        <Space>
          <Button type="primary" @click="showInfo('已提交推理任务')"
            >确认</Button
          >
          <Button @click="goBack">取消</Button>
        </Space>
      </div>
    </Card>
  </Page>
</template>
