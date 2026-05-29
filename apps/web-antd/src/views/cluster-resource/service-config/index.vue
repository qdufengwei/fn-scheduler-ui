<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Check, Plus, RotateCw, Trash2 } from '@vben/icons';

import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  Row,
  Switch,
} from 'ant-design-vue';

import { showNotify } from '#/utils/notify';

// 默认配置，用于重置功能
const defaultSettings = {
  memoryLimit: 150,
  cpuLimit: 32,
  cpuNodeLabels: [{ key: 'cpu_node', value: 'true' }],
  algorithmDevIp: '10.1.2.108',
  useAuthPull: false,
  logDownloadSpeed: 1,
  logFileSizeLimit: 2,
  readLogFromFile: false,
  jupyterImage: 'harbor.local.clusters/kubesphereio/base-notebook:1.41',
  vscodeImage: 'harbor.local.clusters/kubesphereio/code-server:v1.59',
  busyboxImage: 'harbor.local.clusters/kubesphereio/busybox:latest',
};

const config = ref({
  ...defaultSettings,
  cpuNodeLabels: [...defaultSettings.cpuNodeLabels.map((l) => ({ ...l }))],
});

function handleConfirm() {
  showNotify('配置保存成功');
}

function handleReset() {
  config.value = {
    ...defaultSettings,
    cpuNodeLabels: [...defaultSettings.cpuNodeLabels.map((l) => ({ ...l }))],
  };
  showNotify('配置已重置为默认值');
}

function addCpuNodeLabel() {
  config.value.cpuNodeLabels.push({ key: '', value: '' });
}

function removeCpuNodeLabel(index: number) {
  config.value.cpuNodeLabels.splice(index, 1);
}
</script>

<template>
  <Page auto-content-height>
    <!-- 铺满 w-full，但内部输入框通过 max-width 约束，避免无节制拉宽 -->
    <div class="space-y-4 w-full pb-8">
      <Form layout="vertical">
        <!-- Card 1: 应用基础配置 -->
        <Card :bordered="false" title="应用基础配置" class="shadow-sm">
          <Row :gutter="24">
            <Col :span="12">
              <FormItem required label="内存上限">
                <div class="flex items-center gap-2 w-full">
                  <InputNumber
                    v-model:value="config.memoryLimit"
                    :min="1"
                    class="w-full"
                    style="max-width: 260px"
                  />
                  <span class="text-gray-500 text-sm whitespace-nowrap"
                    >GiB</span
                  >
                </div>
                <template #extra>
                  <span class="text-xs text-gray-400"
                    >定义任务中单个实例可使用的内存配额最大上限。</span
                  >
                </template>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem required label="CPU上限">
                <div class="flex items-center gap-2 w-full">
                  <InputNumber
                    v-model:value="config.cpuLimit"
                    :min="1"
                    class="w-full"
                    style="max-width: 260px"
                  />
                  <span class="text-gray-500 text-sm whitespace-nowrap"
                    >核</span
                  >
                </div>
                <template #extra>
                  <span class="text-xs text-gray-400"
                    >定义任务中单个实例可使用的CPU核数最大上限。</span
                  >
                </template>
              </FormItem>
            </Col>
          </Row>

          <Row :gutter="24" class="mt-2">
            <Col :span="12">
              <FormItem required label="算法开发访问IP">
                <Input
                  v-model:value="config.algorithmDevIp"
                  placeholder="例如: 10.1.2.108"
                  class="w-full"
                  style="max-width: 360px"
                />
                <template #extra>
                  <span class="text-xs text-gray-400"
                    >指定外部或内网访问算法调度开发服务的入口IP地址。</span
                  >
                </template>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="使用认证拉取任务镜像">
                <div class="flex items-center gap-3 py-1">
                  <Switch v-model:checked="config.useAuthPull" />
                  <span class="text-sm text-gray-500 font-medium">
                    {{ config.useAuthPull ? '已开启认证' : '免认证拉取' }}
                  </span>
                </div>
                <template #extra>
                  <span class="text-xs text-gray-400"
                    >开启后，调度平台在各计算节点拉取私有镜像时将强制执行认证校验。</span
                  >
                </template>
              </FormItem>
            </Col>
          </Row>

          <!-- CPU节点标签管理 -->
          <div class="border-t border-gray-100 pt-4 mt-2">
            <span class="text-sm font-medium text-gray-700 block mb-3"
              >CPU节点标识标签</span
            >
            <div class="space-y-3">
              <!-- 使用紧凑 flex 排版，限制输入框宽度 -->
              <div
                v-for="(item, index) in config.cpuNodeLabels"
                :key="index"
                class="flex items-center gap-3"
              >
                <Input
                  v-model:value="item.key"
                  placeholder="标签键 (Key)"
                  class="w-full"
                  style="max-width: 260px"
                />
                <span class="text-gray-400 font-medium">=</span>
                <Input
                  v-model:value="item.value"
                  placeholder="标签值 (Value)"
                  class="w-full"
                  style="max-width: 260px"
                />
                <Button
                  type="text"
                  danger
                  class="flex items-center justify-center"
                  @click="removeCpuNodeLabel(index)"
                >
                  <template #icon><Trash2 class="size-4" /></template>
                </Button>
              </div>
              <Button
                type="dashed"
                block
                class="flex items-center justify-center gap-1.5 mt-2"
                style="max-width: 545px"
                @click="addCpuNodeLabel"
              >
                <template #icon><Plus class="size-4" /></template>
                添加标识标签
              </Button>
            </div>
            <p class="text-xs text-gray-400 mt-2 mb-0">
              用于在调度中识别、过滤并绑定至专属CPU计算节点的自定义Kubernetes
              Label标签。
            </p>
          </div>
        </Card>

        <!-- Card 2: 任务日志审计配置 -->
        <Card :bordered="false" title="任务日志审计配置" class="shadow-sm mt-4">
          <Row :gutter="24">
            <Col :span="12">
              <FormItem required label="日志下载速度">
                <div class="flex items-center gap-2 w-full">
                  <InputNumber
                    v-model:value="config.logDownloadSpeed"
                    :min="1"
                    class="w-full"
                    style="max-width: 260px"
                  />
                  <span class="text-gray-500 text-sm whitespace-nowrap"
                    >MB/S</span
                  >
                </div>
                <template #extra>
                  <span class="text-xs text-gray-400"
                    >限制租户用户在前端下载运行日志时的最大带宽速度。</span
                  >
                </template>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem required label="日志文件大小上限">
                <div class="flex items-center gap-2 w-full">
                  <InputNumber
                    v-model:value="config.logFileSizeLimit"
                    :min="1"
                    class="w-full"
                    style="max-width: 260px"
                  />
                  <span class="text-gray-500 text-sm whitespace-nowrap"
                    >GB</span
                  >
                </div>
                <template #extra>
                  <span class="text-xs text-gray-400"
                    >单个任务实例所能存储和传输的运行日志大小最大上限。</span
                  >
                </template>
              </FormItem>
            </Col>
          </Row>

          <Row :gutter="24" class="mt-2">
            <Col :span="24">
              <FormItem label="从本地文件中直接读取日志">
                <div class="flex items-center gap-3 py-1">
                  <Switch v-model:checked="config.readLogFromFile" />
                  <span class="text-sm text-gray-500 font-medium">
                    {{
                      config.readLogFromFile
                        ? '开启文件读取'
                        : '禁用（通过标准输出读取）'
                    }}
                  </span>
                </div>
                <template #extra>
                  <span class="text-xs text-gray-400"
                    >开启后系统将优先检索本地特定日志挂载路径，否则直接从标准输出流（Stdout/Stderr）获取日志。</span
                  >
                </template>
              </FormItem>
            </Col>
          </Row>
        </Card>

        <!-- Card 3: 开发环境默认镜像配置 -->
        <Card
          :bordered="false"
          title="开发环境默认镜像配置"
          class="shadow-sm mt-4"
        >
          <FormItem label="Jupyter WebIDE 默认镜像地址">
            <Input
              v-model:value="config.jupyterImage"
              placeholder="请输入镜像源完整路径"
              class="w-full"
              style="max-width: 640px"
            />
            <template #extra>
              <span class="text-xs text-gray-400"
                >租户创建 Jupyter
                类型在线开发环境时默认使用的基本运行镜像。</span
              >
            </template>
          </FormItem>

          <FormItem label="VSCode WebIDE 默认镜像地址" class="mt-4">
            <Input
              v-model:value="config.vscodeImage"
              placeholder="请输入镜像源完整路径"
              class="w-full"
              style="max-width: 640px"
            />
            <template #extra>
              <span class="text-xs text-gray-400"
                >租户创建 VSCode (code-server)
                类型开发环境时默认使用的基本运行镜像。</span
              >
            </template>
          </FormItem>

          <FormItem label="云终端 BusyBox 默认镜像地址" class="mt-4">
            <Input
              v-model:value="config.busyboxImage"
              placeholder="请输入镜像源完整路径"
              class="w-full"
              style="max-width: 640px"
            />
            <template #extra>
              <span class="text-xs text-gray-400"
                >系统在线终端调试及辅助性运维容器所采用的通用 BusyBox
                镜像。</span
              >
            </template>
          </FormItem>
        </Card>

        <!-- 底部提交重置按钮 -->
        <div
          class="flex justify-end gap-3 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100 mt-4"
        >
          <Button class="flex items-center gap-1.5" @click="handleReset">
            <template #icon><RotateCw class="size-4" /></template>
            重置默认值
          </Button>
          <Button
            type="primary"
            class="flex items-center gap-1.5"
            @click="handleConfirm"
          >
            <template #icon><Check class="size-4" /></template>
            保存并应用配置
          </Button>
        </div>
      </Form>
    </div>
  </Page>
</template>
