<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Col, Divider, Form, FormItem, Input, InputNumber, Row, Select, Space, Switch, message } from 'ant-design-vue';
import { Settings as SettingsIcon, CircleAlert, Grid, List, Download, RotateCw } from '@vben/icons';

const config = ref({
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
});

const notify = (text: string) => message.success(text);

function handleConfirm() {
  notify('配置已保存（原型）');
}
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center gap-2 mb-6">
          <SettingsIcon class="size-5 text-blue-500" />
          <span class="text-lg font-semibold">服务配置</span>
        </div>

        <Form layout="vertical">
          <!-- 应用配置 -->
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-4 text-base font-medium text-gray-700">
              <Server class="size-5 text-green-500" />
              <span>应用配置</span>
            </div>
            <Row :gutter="24">
              <Col :span="12">
                <FormItem required>
                  <template #label>
                    <span class="flex items-center gap-1">
                      <HardDrive class="size-4 text-gray-400" />
                      内存上限
                      <span class="text-red-500">*</span>
                    </span>
                  </template>
                  <div class="flex items-center gap-2">
                    <InputNumber v-model:value="config.memoryLimit" :min="1" style="width: 200px" />
                    <span class="text-gray-500">GiB</span>
                  </div>
                  <div class="text-xs text-gray-400 mt-1">用于定义任务中单个实例使用的内存上限</div>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem required>
                  <template #label>
                    <span class="flex items-center gap-1">
                      <Cpu class="size-4 text-gray-400" />
                      CPU上限
                      <span class="text-red-500">*</span>
                    </span>
                  </template>
                  <div class="flex items-center gap-2">
                    <InputNumber v-model:value="config.cpuLimit" :min="1" style="width: 200px" />
                    <span class="text-gray-500">核</span>
                  </div>
                  <div class="text-xs text-gray-400 mt-1">用于定义任务中单个实例使用的CPU上限</div>
                </FormItem>
              </Col>
            </Row>

            <FormItem>
              <template #label>
                <span class="flex items-center gap-1">
                  <Database class="size-4 text-gray-400" />
                  CPU节点标签
                </span>
              </template>
              <div class="space-y-2">
                <div v-for="(item, index) in config.cpuNodeLabels" :key="index" class="flex items-center gap-2">
                  <Input v-model:value="item.key" style="width: 150px" placeholder="键" />
                  <Input v-model:value="item.value" style="width: 150px" placeholder="值" />
                </div>
                <a class="text-blue-500">+ 添加标签</a>
              </div>
              <div class="text-xs text-gray-400 mt-1">用于标识CPU节点</div>
            </FormItem>

            <FormItem required>
              <template #label>
                <span class="flex items-center gap-1">
                  <Terminal class="size-4 text-gray-400" />
                  算法开发访问IP
                  <span class="text-red-500">*</span>
                </span>
              </template>
              <Input v-model:value="config.algorithmDevIp" style="width: 300px" />
              <div class="text-xs text-gray-400 mt-1">用于指定访问算法服务的IP地址</div>
            </FormItem>

            <FormItem>
              <template #label>
                <span class="flex items-center gap-1">
                  <Image class="size-4 text-gray-400" />
                  使用认证拉取任务镜像
                </span>
              </template>
              <div class="flex items-center gap-3">
                <Switch v-model:checked="config.useAuthPull" />
                <span class="text-sm text-gray-500">{{ config.useAuthPull ? '使用认证' : '不使用认证' }}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1">开启后任务拉取镜像时需要认证</div>
            </FormItem>
          </div>

          <Divider />

          <!-- 任务日志配置 -->
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-4 text-base font-medium text-gray-700">
              <FileCode class="size-5 text-orange-500" />
              <span>任务日志配置</span>
            </div>
            <Row :gutter="24">
              <Col :span="12">
                <FormItem required>
                  <template #label>
                    <span class="flex items-center gap-1">
                      日志下载速度
                      <span class="text-red-500">*</span>
                    </span>
                  </template>
                  <div class="flex items-center gap-2">
                    <InputNumber v-model:value="config.logDownloadSpeed" :min="1" style="width: 200px" />
                    <span class="text-gray-500">MB/S</span>
                  </div>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem required>
                  <template #label>
                    <span class="flex items-center gap-1">
                      日志文件大小上限
                      <span class="text-red-500">*</span>
                    </span>
                  </template>
                  <div class="flex items-center gap-2">
                    <InputNumber v-model:value="config.logFileSizeLimit" :min="1" style="width: 200px" />
                    <span class="text-gray-500">GB</span>
                  </div>
                </FormItem>
              </Col>
            </Row>

            <FormItem>
              <template #label>从文件中读取日志</template>
              <div class="flex items-center gap-3">
                <Switch v-model:checked="config.readLogFromFile" />
                <span class="text-sm text-gray-500">{{ config.readLogFromFile ? '支持' : '不支持' }}</span>
              </div>
            </FormItem>
          </div>

          <Divider />

          <!-- 默认镜像配置 -->
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-4 text-base font-medium text-gray-700">
              <Code class="size-5 text-purple-500" />
              <span>默认镜像配置</span>
            </div>
            <FormItem>
              <template #label>
                <span class="flex items-center gap-1">
                  Jupyter默认镜像地址
                </span>
              </template>
              <Input v-model:value="config.jupyterImage" style="width: 500px" />
              <div class="text-xs text-gray-400 mt-1">WebIDE类型是Jupyter的默认镜像地址</div>
            </FormItem>
            <FormItem>
              <template #label>VSCode默认镜像地址</template>
              <Input v-model:value="config.vscodeImage" style="width: 500px" />
              <div class="text-xs text-gray-400 mt-1">WebIDE类型是VSCode的默认镜像地址</div>
            </FormItem>
            <FormItem>
              <template #label>BusyBox默认镜像地址</template>
              <Input v-model:value="config.busyboxImage" style="width: 500px" />
              <div class="text-xs text-gray-400 mt-1">云终端服务的默认镜像地址</div>
            </FormItem>
          </div>

          <Button type="primary" size="large" @click="handleConfirm">
            <template #icon><Save class="size-4" /></template>
            确认
          </Button>
        </Form>
      </Card>
    </div>
  </Page>
</template>
