<script setup lang="ts">
import type { EchartsUIType } from '@vben/plugins/echarts';

import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Copy,
  createIconifyIcon,
  Maximize,
  Search,
} from '@vben/icons';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Dropdown,
  Input,
  Menu,
  MenuItem,
  message,
  Modal,
  Row,
  Select,
  Switch,
  Table,
  TabPane,
  Tabs,
  Tag,
  Timeline,
  TimelineItem,
} from 'ant-design-vue';

const props = withDefaults(defineProps<Props>(), {
  backRouteName: '',
});
// 路由
const route = useRoute();
const router = useRouter();

// 接收可能由父级传入的 props，或者使用路由参数
interface Props {
  backRouteName?: string;
}

// 任务基础数据
const fallbackTaskId = 'job-0482129d4b7b-20260415210402';
const taskId = computed(() => String(route.params.id || fallbackTaskId));

const tasksMockMap: Record<
  string,
  {
    autoRetry: string;
    createTime: string;
    creator: string;
    desc: string;
    entryCmd: string;
    env: string;
    gpuCount: number;
    image: string;
    name: string;
    priority: string;
    readyStatus: string;
    recyclePolicy: string;
    replicas: number;
    runTime: string;
    spec: string;
    status: string;
    storage: string;
    taskType: string;
    tenant: string;
    tolerations: string;
    workDir: string;
  }
> = {
  'job-0482129d4b7b-20260415210402': {
    name: 'cpu6',
    status: '运行中',
    readyStatus: '1/1',
    runTime: '1032h 40m 34s',
    createTime: '2026-04-15 13:04:03',
    creator: 'user415',
    tenant: 'zjw415',
    image: 'harbor.local.clusters/kubesphereio/ssh:v1.1-02141010',
    taskType: 'CPU',
    workDir: '/ip',
    priority: 'high-priority-job',
    replicas: 1,
    recyclePolicy: '可回收',
    storage: '-',
    autoRetry: '未设置',
    entryCmd: '/bin/bash -c sleep inf',
    env: 'JOB_NAME = job-0482129d4b7b-20260415210402',
    tolerations: '-',
    desc: '-',
    gpuCount: 0,
    spec: '-',
  },
  'job-254ce4873fa7-20260523232921': {
    name: 'test',
    status: '运行中',
    readyStatus: '1/1',
    runTime: '84h 42m 59s',
    createTime: '2026-05-23 15:29:21',
    creator: 'lzj-1',
    tenant: 'qiji',
    image: 'harbor.local.clusters/kubesphereio/ssh:v1.1-02141010',
    taskType: 'CPU',
    workDir: '/ip',
    priority: 'high-priority-job',
    replicas: 1,
    recyclePolicy: '可回收',
    storage: '-',
    autoRetry: '未设置',
    entryCmd: '/bin/bash -c sleep inf',
    env: 'JOB_NAME = job-254ce4873fa7-20260523232921',
    tolerations: '-',
    desc: '-',
    gpuCount: 0,
    spec: '-',
  },
  'job-473d0f3c98dd-20260415205154': {
    name: '123',
    status: '已停止',
    readyStatus: '0/1',
    runTime: '300h 43m 37s',
    createTime: '2026-04-15 12:51:54',
    creator: 'test-0415',
    tenant: 'test-0415',
    image: 'harbor.local.clusters/kubesphereio/ssh:v1.1-02141010',
    taskType: 'Simple',
    workDir: '/workspace',
    priority: 'high-priority-job',
    replicas: 1,
    recyclePolicy: '可回收',
    storage: 'pv-storage-01',
    autoRetry: '已设置 (3次)',
    entryCmd: 'python run.py',
    env: 'JOB_NAME = job-473d0f3c98dd-20260415205154',
    tolerations: '-',
    desc: 'Simple test job',
    gpuCount: 1,
    spec: 'NVIDIA-GPU-HBM2E-80GB',
  },
  'TR-001': {
    name: 'llm-pretrain-v3',
    status: '运行中',
    readyStatus: '4/4',
    runTime: '12h 30m 00s',
    createTime: '2026-05-26 08:00:00',
    creator: 'test01',
    tenant: 'test01',
    image: 'harbor.local.clusters/llm/qwen2:72b',
    taskType: 'PyTorch',
    workDir: '/workspace/qwen2',
    priority: 'high-priority-job',
    replicas: 4,
    recyclePolicy: '不可回收',
    storage: 'nfs-llm-data',
    autoRetry: '未设置',
    entryCmd: 'python -m torch.distributed.run train.py',
    env: 'WORLD_SIZE=4, MASTER_PORT=29500',
    tolerations: '-',
    desc: 'LLM pretraining task v3',
    gpuCount: 32,
    spec: 'A800',
  },
};

const taskInfo = computed(() => {
  return tasksMockMap[taskId.value] || (tasksMockMap as any)[fallbackTaskId];
});

// 运行时长计时器
const tickingRuntime = ref('');
let timerId: any = null;

function parseAndStartTimer(runtimeStr: string) {
  if (timerId) clearInterval(timerId);
  const match = runtimeStr.match(/(\d+)h\s*(\d+)m\s*(\d+)s/);
  if (!match) {
    tickingRuntime.value = runtimeStr;
    return;
  }
  let h = Number.parseInt(match[1] || '0');
  let m = Number.parseInt(match[2] || '0');
  let s = Number.parseInt(match[3] || '0');

  tickingRuntime.value = `${h}h ${m}m ${s}s`;

  if (taskInfo.value.status === '运行中') {
    timerId = setInterval(() => {
      s++;
      if (s >= 60) {
        s = 0;
        m++;
        if (m >= 60) {
          m = 0;
          h++;
        }
      }
      tickingRuntime.value = `${h}h ${m}m ${s}s`;
    }, 1000);
  }
}

watch(
  () => taskInfo.value,
  (newVal) => {
    if (newVal) {
      parseAndStartTimer(newVal.runTime);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (timerId) clearInterval(timerId);
});

// UI 选项值
const activeTab = ref('overview');
const yamlVisible = ref(false);

// Lucide 图标创建
const PlayIcon = createIconifyIcon('lucide:play-circle');
const CircleSlashIcon = createIconifyIcon('lucide:circle-slash');
const RotateCwIcon = createIconifyIcon('lucide:rotate-cw');
const Trash2Icon = createIconifyIcon('lucide:trash-2');

// 动态 YAML 文本生成
const yamlText = computed(() => {
  return `kind: Job
metadata:
  annotations:
    JobAlias: ${taskInfo.value.name}
    jobCreator: ${taskInfo.value.creator}
    remark: ""
  creationTimestamp: null
  generation: 1
  labels:
    reclaimableByVolcano: "true"
    volcano.sh/job-type: ${taskInfo.value.taskType.toLowerCase() === 'cpu' ? 'cpu' : 'gpu'}
  name: ${taskId.value}
  namespace: ${taskInfo.value.tenant}
spec:
  minAvailable: 1
  plugins:
    env: []
    ssh: []
    svc: []
  priorityClassName: ${taskInfo.value.priority}
  queue: ${taskInfo.value.tenant}
  schedulerName: volcano
  tasks:
  - minAvailable: 1
    name: worker
    replicas: ${taskInfo.value.replicas}
    template:
      metadata:
        creationTimestamp: null
      spec:
        containers:
        - args:
          - -c
          - sleep inf
          command:
          - /bin/bash
          env:
          - name: JOB_NAME
            value: ${taskId.value}
          image: ${taskInfo.value.image}
          imagePullPolicy: IfNotPresent
          name: worker
          resources:
            limits:
              cpu: "${taskInfo.value.gpuCount > 0 ? '4' : '1'}"
              enflame-tech.com/gcu: "0"
              memory: 1Gi
            requests:
              cpu: "${taskInfo.value.gpuCount > 0 ? '4' : '1'}"
              memory: 1Gi
          securityContext:
            capabilities:
              add:
              - IPC_LOCK
              - SYS_RESOURCE
          workingDir: /lp
        dnsPolicy: ClusterFirstWithHostNet
        hostNetwork: true
        nodeSelector:
          cpu_node: "true"
        restartPolicy: Never
status:
  conditions:
  - lastTransitionTime: "2026-04-15T13:04:03Z"
    status: Pending
  - lastTransitionTime: "2026-04-15T13:04:13Z"
    status: Running
  - lastTransitionTime: "2026-05-21T01:01:19Z"
    status: Pending
  - lastTransitionTime: "2026-05-21T01:10:58Z"
    status: Running
  controlledResources:
    plugin-env: env
    plugin-ssh: ssh
    plugin-svc: svc
  minAvailable: 1
  running: 1
  state:
    lastTransitionTime: "2026-05-21T01:10:58Z"
    phase: Running
  taskStatusCount:
    worker:
      phase:
        Running: 1`;
});

const yamlLines = computed(() => {
  return yamlText.value.split('\n');
});

const highlightedYamlLines = computed(() => {
  return yamlLines.value.map((line) => {
    // 转义 HTML 实体防止渲染解析错误
    const html = line
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');

    if (html.trim().startsWith('#')) {
      return `<span class="text-slate-500">${html}</span>`;
    }

    const colonIndex = html.indexOf(':');
    if (colonIndex !== -1) {
      const key = html.slice(0, Math.max(0, colonIndex));
      const rest = html.slice(Math.max(0, colonIndex));

      // 高亮 key，根据缩进层级赋以不同颜色以展现高级编辑器的质感
      const indentCount = key.length - key.trimStart().length;
      const indent = key.slice(0, Math.max(0, indentCount));
      const keyName = key.trimStart();

      let valHtml = rest;
      const valTrim = rest.slice(1).trim();
      if (valTrim) {
        const valStart = rest.indexOf(valTrim);
        const prefix = rest.slice(0, Math.max(0, valStart));
        let val = rest.slice(Math.max(0, valStart));

        if (val === 'null' || val === 'true' || val === 'false') {
          val = `<span class="text-[#ae81ff] font-medium">${val}</span>`;
        } else if (!Number.isNaN(Number(val))) {
          val = `<span class="text-[#ae81ff]">${val}</span>`;
        } else if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = `<span class="text-[#e6db74]">${val}</span>`;
        } else {
          val = `<span class="text-[#a6e22e]">${val}</span>`;
        }
        valHtml = prefix + val;
      }

      // 根据缩进层级指定高亮颜色
      const keyColors: Record<number, string> = {
        0: '#f92672',
        2: '#66d9ef',
      };
      const keyColor = keyColors[indentCount] ?? '#a6e22e';

      return `${indent}<span style="color: ${keyColor}">${keyName}</span>${valHtml}`;
    }

    // 列表的破折号
    if (html.trim().startsWith('-')) {
      return html.replace('-', '<span class="text-[#f92672]">-</span>');
    }

    return html;
  });
});

// 复制文本
function handleCopy(text: string, label: string) {
  navigator.clipboard.writeText(text);
  message.success(`已复制${label}`);
}

// 返回
function handleBack() {
  if (props.backRouteName) {
    router.push({ name: props.backRouteName });
  } else {
    // 根据当前路由的路径智能推断返回上一级
    const path = route.path;
    if (path.includes('/admin-task')) {
      router.push('/admin-task/latest/training');
    } else {
      router.push('/user-task/training/latest');
    }
  }
}

// 更多菜单操作
function handleMenuClick(info: any) {
  const key = info.key;
  if (key === 'restart') {
    Modal.confirm({
      title: '确认重启该任务？',
      content: '重新启动任务将导致当前运行中的实例重启。',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        message.loading({ content: '正在重新启动任务...', key: 'op' });
        setTimeout(() => {
          taskInfo.value.status = '运行中';
          parseAndStartTimer('0h 0m 1s');
          message.success({
            content: '任务已重新启动',
            key: 'op',
            duration: 2,
          });
        }, 1200);
      },
    });
  } else if (key === 'delete') {
    Modal.confirm({
      title: '确认删除该任务？',
      content: '删除任务将彻底清除任务相关的数据且无法恢复。',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk() {
        message.loading({ content: '正在删除任务...', key: 'op' });
        setTimeout(() => {
          message.success({ content: '任务删除成功', key: 'op', duration: 2 });
          handleBack();
        }, 1000);
      },
    });
  }
}

// ==================== Tab 1: 概览信息 ====================
const replicaData = computed(() => {
  const replicasCount = taskInfo.value.replicas;
  const list = [];
  for (let i = 0; i < replicasCount; i++) {
    list.push({
      name: `${taskId.value}-worker-${i}`,
      status: taskInfo.value.status,
      ready: taskInfo.value.readyStatus,
      cpu: 1,
      memory: '1Gi',
      nodeIp: '10.1.2.105',
      nodeName: 'cpu105',
      createTime: '2026-05-21 01:01:19',
    });
  }
  return list;
});

const replicaColumns = [
  { title: '实例名称', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '就绪状态', dataIndex: 'ready', key: 'ready' },
  { title: 'CPU', dataIndex: 'cpu', key: 'cpu' },
  { title: '内存', dataIndex: 'memory', key: 'memory' },
  { title: '节点IP', dataIndex: 'nodeIp', key: 'nodeIp' },
  { title: '运行节点', dataIndex: 'nodeName', key: 'nodeName' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 80,
    fixed: 'right' as const,
  },
];

function jumpToLogs() {
  activeTab.value = 'logs';
}

// ==================== Tab 2: 资源监控 ====================
const monitorInstance = ref('');
const monitorType = ref('average');
const monitorRefresh = ref('40s');
const timeRange = ref<any>(null);

const cpuChartRef = ref<EchartsUIType>();
const memChartRef = ref<EchartsUIType>();
const { renderEcharts: renderCpu } = useEcharts(cpuChartRef);
const { renderEcharts: renderMem } = useEcharts(memChartRef);

// 模拟的监控数据时间轴与数值
const timestamps = [
  '21:49',
  '21:50',
  '21:50',
  '21:51',
  '21:52',
  '21:52',
  '21:53',
  '21:54',
];
const cpuValues = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01];
const memValues = [1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3]; // 单位：MB

const getCpuOption = (): any => ({
  tooltip: {
    trigger: 'axis',
    confine: true,
    formatter: (params: any) => {
      const p = params[0];
      return `<div style="padding: 4px 8px; font-size:12px;">
        <div style="font-weight: 500;">${p.axisValue}</div>
        <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#ff4d4f;"></span>
          <span>CPU使用量: ${p.value.toFixed(2)} Cores</span>
        </div>
      </div>`;
    },
  },
  grid: { left: 50, right: 110, top: 20, bottom: 30 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: timestamps,
    axisLine: { lineStyle: { color: '#f0f0f0' } },
    axisTick: { show: false },
    axisLabel: { color: '#8c8c8c', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 1,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } },
    axisLabel: {
      color: '#8c8c8c',
      fontSize: 11,
      formatter: '{value}.00Cores',
    },
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: { color: '#8c8c8c', fontSize: 11 },
    data: ['cpu105_G...'],
  },
  series: [
    {
      name: 'cpu105_G...',
      type: 'line',
      data: cpuValues,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 1.5, color: '#ff4d4f' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 77, 79, 0.15)' },
            { offset: 1, color: 'rgba(255, 77, 79, 0.01)' },
          ],
        },
      },
    },
  ],
});

const getMemOption = (): any => ({
  tooltip: {
    trigger: 'axis',
    confine: true,
    formatter: (params: any) => {
      const p = params[0];
      return `<div style="padding: 4px 8px; font-size:12px;">
        <div style="font-weight: 500;">${p.axisValue}</div>
        <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#ff4d4f;"></span>
          <span>内存使用量: ${p.value.toFixed(2)} MB</span>
        </div>
      </div>`;
    },
  },
  grid: { left: 55, right: 110, top: 20, bottom: 30 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: timestamps,
    axisLine: { lineStyle: { color: '#f0f0f0' } },
    axisTick: { show: false },
    axisLabel: { color: '#8c8c8c', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 1.43,
    interval: 0.286,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } },
    axisLabel: {
      color: '#8c8c8c',
      fontSize: 11,
      formatter: (value: number) => {
        if (value === 0) return '0.00 B';
        if (value <= 0.8) return `${(value * 600).toFixed(2)} KB`;
        return `${value.toFixed(2)} MB`;
      },
    },
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: { color: '#8c8c8c', fontSize: 11 },
    data: ['cpu105_G...'],
  },
  series: [
    {
      name: 'cpu105_G...',
      type: 'line',
      data: memValues,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 1.5, color: '#ff4d4f' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 77, 79, 0.15)' },
            { offset: 1, color: 'rgba(255, 77, 79, 0.01)' },
          ],
        },
      },
    },
  ],
});

function initCharts() {
  setTimeout(() => {
    if (cpuChartRef.value) {
      renderCpu(getCpuOption());
    }
    if (memChartRef.value) {
      renderMem(getMemOption());
    }
  }, 100);
}

// 监听 tab 切换，初始化 Echarts
watch(activeTab, (val) => {
  if (val === 'monitor') {
    initCharts();
  }
});

// ==================== Tab 3: 日志 ====================
const logInstance = ref('');
const logPod = ref('worker');
const logType = ref('stdout&stderr');
const logAutoUpdate = ref(true);
const logLines = ref('500');
const logSearch = ref('');
const terminalLogRef = ref<HTMLElement>();

const simulatedLogs = ref<string[]>([
  '[2026-05-28 21:49:01] INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server version name:   Apache Tomcat/9.0.58',
  '[2026-05-28 21:49:02] INFO [main] org.apache.catalina.startup.VersionLoggerListener.log OS Name:               Linux',
  '[2026-05-28 21:49:03] INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Architecture:          amd64',
  '[2026-05-28 21:49:03] INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Java Home:             /usr/lib/jvm/java-11-openjdk-amd64',
  '[2026-05-28 21:49:05] WARNING [main] Loaded model config: CPU-only mode selected. Performance may be degraded.',
  '[2026-05-28 21:49:05] INFO [main] Resource allocated. Node IP: 10.1.2.105',
  '[2026-05-28 21:49:10] INFO [main] Initializing model layers... Loading weights from harbor registry.',
  '[2026-05-28 21:49:25] INFO [main] Model weights successfully initialized. Allocating memory buffers.',
  '[2026-05-28 21:49:30] INFO [main] Starting training iteration loop. Batch size: 128.',
  '[2026-05-28 21:50:00] INFO [worker-0] Epoch: 1, Step: 100, Loss: 2.3481, Learning Rate: 0.001',
  '[2026-05-28 21:50:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
  '[2026-05-28 21:51:00] INFO [worker-0] Epoch: 1, Step: 200, Loss: 1.9845, Learning Rate: 0.001',
  '[2026-05-28 21:51:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
  '[2026-05-28 21:52:00] INFO [worker-0] Epoch: 1, Step: 300, Loss: 1.7654, Learning Rate: 0.001',
  '[2026-05-28 21:52:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
  '[2026-05-28 21:53:00] INFO [worker-0] Epoch: 1, Step: 400, Loss: 1.5432, Learning Rate: 0.001',
  '[2026-05-28 21:53:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
  '[2026-05-28 21:54:00] INFO [worker-0] Epoch: 2, Step: 500, Loss: 1.3411, Learning Rate: 0.00095',
  '[2026-05-28 21:54:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
  '[2026-05-28 21:55:00] INFO [worker-0] Epoch: 2, Step: 600, Loss: 1.2104, Learning Rate: 0.00095',
  '[2026-05-28 21:55:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
  '[2026-05-28 21:56:00] INFO [worker-0] Epoch: 2, Step: 700, Loss: 1.0945, Learning Rate: 0.00095',
  '[2026-05-28 21:56:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
  '[2026-05-28 21:57:00] INFO [worker-0] Epoch: 2, Step: 800, Loss: 0.9841, Learning Rate: 0.00095',
  '[2026-05-28 21:57:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
  '[2026-05-28 21:58:00] INFO [worker-0] Epoch: 3, Step: 900, Loss: 0.8954, Learning Rate: 0.00090',
  '[2026-05-28 21:58:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
  '[2026-05-28 21:59:00] INFO [worker-0] Epoch: 3, Step: 1000, Loss: 0.8124, Learning Rate: 0.00090',
  '[2026-05-28 21:59:00] DEBUG CPU utilization: 0.1%, Memory usage: 1.32 MB',
]);

const filteredLogs = computed(() => {
  if (!logSearch.value) return simulatedLogs.value;
  return simulatedLogs.value.filter((log) =>
    log.toLowerCase().includes(logSearch.value.toLowerCase()),
  );
});

function scrollToBottom() {
  if (terminalLogRef.value) {
    terminalLogRef.value.scrollTop = terminalLogRef.value.scrollHeight;
  }
}

function scrollToTop() {
  if (terminalLogRef.value) {
    terminalLogRef.value.scrollTop = 0;
  }
}

watch(activeTab, (val) => {
  if (val === 'logs') {
    setTimeout(scrollToBottom, 50);
  }
});

// ==================== Tab 4: 事件 ====================
const eventInstance = ref('');
const eventLevel = ref('Warning');
const eventSearch = ref('');

const simulatedEvents = [
  {
    time: '2026-05-21 09:01:19',
    type: 'Normal',
    reason: 'Scheduled',
    message:
      'Successfully assigned job-0482129d4b7b-20260415210402-worker-0 to cpu105',
  },
  {
    time: '2026-05-21 09:01:20',
    type: 'Normal',
    reason: 'Pulled',
    message:
      'Container image "harbor.local.clusters/kubesphereio/ssh:v1.1-02141010" already present on machine',
  },
  {
    time: '2026-05-21 09:01:21',
    type: 'Normal',
    reason: 'Created',
    message: 'Created container worker',
  },
  {
    time: '2026-05-21 09:01:21',
    type: 'Normal',
    reason: 'Started',
    message: 'Started container worker',
  },
  {
    time: '2026-05-21 09:01:22',
    type: 'Warning',
    reason: 'Unhealthy',
    message: 'Liveness probe failed: connection refused on port 8080',
  },
  {
    time: '2026-05-21 09:01:40',
    type: 'Warning',
    reason: 'FailedScheduling',
    message:
      '0/5 nodes are available: 5 Insufficient cpu. Preemption list empty.',
  },
  {
    time: '2026-05-21 09:01:55',
    type: 'Warning',
    reason: 'SandboxChanged',
    message: 'Pod sandbox changed, restarting container in sandbox.',
  },
];

const filteredEvents = computed(() => {
  return simulatedEvents.filter((ev) => {
    if (eventLevel.value !== 'All' && ev.type !== eventLevel.value)
      return false;
    if (
      eventSearch.value &&
      !ev.message.toLowerCase().includes(eventSearch.value.toLowerCase()) &&
      !ev.reason.toLowerCase().includes(eventSearch.value.toLowerCase())
    )
      return false;
    return true;
  });
});

// ==================== Tab 5: 调度详情 ====================
const scheduleJob = ref('');
const scheduleType = ref('调度');

// ==================== 初始化下拉框默认值 ====================
onMounted(() => {
  monitorInstance.value = `${taskId.value}-worker-0`;
  logInstance.value = `${taskId.value}-worker-0`;
  eventInstance.value = `${taskId.value}-worker-0`;
  scheduleJob.value = taskId.value;
  parseAndStartTimer(taskInfo.value.runTime);
});
</script>

<template>
  <Page auto-content-height>
    <div class="space-y-4 w-full pb-8">
      <!-- 头部：导航与主状态卡片 -->
      <Card
        :bordered="false"
        class="shadow-sm rounded-2xl"
        :body-style="{ padding: '20px 24px' }"
      >
        <div class="flex flex-col gap-4">
          <!-- 上排：返回与控制按钮 -->
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-3">
              <Button
                type="text"
                class="flex items-center justify-center p-0 h-8 w-8 text-slate-500 hover:bg-slate-100 rounded-full"
                @click="handleBack"
              >
                <template #icon><ArrowLeft class="size-4.5" /></template>
              </Button>
              <span class="text-xl font-bold text-slate-800">{{
                taskInfo.name
              }}</span>
              <Tag
                color="success"
                class="rounded-full px-2.5 py-0.5 border-0 bg-[#e6f4ea] text-[#137333] font-medium text-xs"
              >
                {{ taskInfo.status }}
              </Tag>
              <Tag
                class="rounded-md px-1.5 py-0.2 border-0 bg-slate-100 text-slate-500 text-xs"
              >
                {{ taskInfo.readyStatus }}
              </Tag>
              <span class="text-xs text-slate-400 font-normal ml-1">
                已运行 {{ tickingRuntime }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <Dropdown :trigger="['click']">
                <Button
                  class="rounded-lg px-4 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                >
                  更多
                </Button>
                <template #overlay>
                  <Menu @click="handleMenuClick">
                    <MenuItem key="resume" disabled>
                      <div class="flex items-center gap-2 text-slate-400">
                        <PlayIcon class="size-4" />
                        <span>恢复</span>
                      </div>
                    </MenuItem>
                    <MenuItem key="cancel" disabled>
                      <div class="flex items-center gap-2 text-slate-400">
                        <CircleSlashIcon class="size-4" />
                        <span>取消任务</span>
                      </div>
                    </MenuItem>
                    <MenuItem key="restart">
                      <div class="flex items-center gap-2 text-slate-700">
                        <RotateCwIcon class="size-4" />
                        <span>重启</span>
                      </div>
                    </MenuItem>
                    <Menu.Divider />
                    <MenuItem key="delete">
                      <div class="flex items-center gap-2 text-red-500">
                        <Trash2Icon class="size-4 text-red-500" />
                        <span>删除</span>
                      </div>
                    </MenuItem>
                  </Menu>
                </template>
              </Dropdown>
              <Button
                type="primary"
                class="rounded-lg px-4 bg-blue-600 border-0 hover:bg-blue-500"
                @click="yamlVisible = true"
              >
                查看YAML
              </Button>
            </div>
          </div>

          <!-- 下排：网格展示ID和创建时间等 -->
          <div
            class="bg-[#f8f9fc] rounded-xl p-5 border border-slate-100/50 grid grid-cols-2 gap-y-3.5 gap-x-12"
          >
            <div class="flex items-center text-sm">
              <span class="text-slate-400 w-24">ID</span>
              <span
                class="text-slate-700 font-mono font-medium select-all flex-1"
                >{{ taskId }}</span
              >
            </div>
            <div class="flex items-center text-sm">
              <span class="text-slate-400 w-24">创建时间</span>
              <span class="text-slate-700 font-medium flex-1">{{
                taskInfo.createTime
              }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-slate-400 w-24">创建者</span>
              <span class="text-slate-700 font-medium flex-1">{{
                taskInfo.creator
              }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-slate-400 w-24">租户</span>
              <span class="text-slate-700 font-medium flex-1">{{
                taskInfo.tenant
              }}</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- 下部：选项卡内容区 -->
      <Card
        :bordered="false"
        class="shadow-sm rounded-2xl"
        :body-style="{ padding: '0 24px 24px' }"
      >
        <Tabs
          v-model:active-key="activeTab"
          class="custom-tabs font-medium text-slate-600"
        >
          <!-- 概览信息 Tab -->
          <TabPane key="overview" tab="概览信息">
            <div class="py-4 space-y-6">
              <!-- 基础信息 -->
              <div>
                <h3 class="text-base font-bold text-slate-800 mb-4">
                  基础信息
                </h3>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 px-1"
                >
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">镜像</span>
                    <span
                      class="flex-1 text-slate-700 font-mono break-all font-medium select-all"
                      >{{ taskInfo.image }}</span
                    >
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">任务类型</span>
                    <span class="flex-1 text-slate-700 font-medium">{{
                      taskInfo.taskType
                    }}</span>
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">工作目录</span>
                    <span class="flex-1 text-slate-700 font-mono font-medium">{{
                      taskInfo.workDir
                    }}</span>
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">优先级</span>
                    <span class="flex-1 text-slate-700 font-mono font-medium">{{
                      taskInfo.priority
                    }}</span>
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">实例数量</span>
                    <span class="flex-1 text-slate-700 font-medium">{{
                      taskInfo.replicas
                    }}</span>
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">回收策略</span>
                    <span class="flex-1 text-slate-700 font-medium">{{
                      taskInfo.recyclePolicy
                    }}</span>
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">存储</span>
                    <span class="flex-1 text-slate-700 font-medium">{{
                      taskInfo.storage
                    }}</span>
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">自动重试</span>
                    <span class="flex-1 text-slate-700 font-medium">{{
                      taskInfo.autoRetry
                    }}</span>
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">入口命令</span>
                    <span
                      class="flex-1 text-slate-700 font-mono font-medium break-all"
                      >{{ taskInfo.entryCmd }}</span
                    >
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">环境变量</span>
                    <span
                      class="flex-1 text-slate-700 font-mono font-medium break-all"
                      >{{ taskInfo.env }}</span
                    >
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">容忍度</span>
                    <span class="flex-1 text-slate-700 font-medium">{{
                      taskInfo.tolerations
                    }}</span>
                  </div>
                  <div class="flex items-start text-sm py-0.5">
                    <span class="w-32 text-slate-400">描述</span>
                    <span class="flex-1 text-slate-700 font-medium">{{
                      taskInfo.desc
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- 实例信息 -->
              <div class="pt-2">
                <h3 class="text-base font-bold text-slate-800 mb-4">
                  实例信息
                </h3>
                <Table
                  row-key="name"
                  :columns="replicaColumns"
                  :data-source="replicaData"
                  :pagination="false"
                  size="middle"
                  class="rounded-lg overflow-hidden border border-slate-100"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'name'">
                      <div
                        class="flex items-center gap-1.5 font-medium text-slate-700"
                      >
                        <span>{{ record.name }}</span>
                        <Button
                          type="text"
                          size="small"
                          class="flex items-center justify-center p-0 h-6 w-6 text-slate-400 hover:text-blue-600 rounded"
                          @click="handleCopy(record.name, '实例名称')"
                        >
                          <template #icon><Copy class="size-3.5" /></template>
                        </Button>
                      </div>
                    </template>
                    <template v-else-if="column.key === 'status'">
                      <Tag
                        color="success"
                        class="rounded-full px-2 border-0 bg-[#e6f4ea] text-[#137333]"
                      >
                        {{ record.status }}
                      </Tag>
                    </template>
                    <template v-else-if="column.key === 'action'">
                      <a
                        class="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        @click="jumpToLogs"
                        >日志</a
                      >
                    </template>
                  </template>
                </Table>
              </div>
            </div>
          </TabPane>

          <!-- 资源监控 Tab -->
          <TabPane key="monitor" tab="资源监控">
            <div class="py-4 space-y-4">
              <!-- 筛选和参数 -->
              <div
                class="flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50"
              >
                <div class="flex items-center gap-4 flex-wrap">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-400">筛选条件</span>
                    <Select
                      v-model:value="monitorInstance"
                      style="width: 320px"
                      class="rounded-lg"
                    >
                      <Select.Option :value="`${taskId}-worker-0`">
                        {{ taskId }}-worker-0
                      </Select.Option>
                    </Select>
                  </div>
                </div>

                <div
                  class="flex items-center gap-4 flex-wrap text-xs text-slate-500 font-medium"
                >
                  <div class="flex items-center gap-2">
                    <span>数据展示</span>
                    <Select v-model:value="monitorType" style="width: 90px">
                      <Select.Option value="average">平均值</Select.Option>
                      <Select.Option value="max">最大值</Select.Option>
                    </Select>
                  </div>
                  <div class="flex items-center gap-2">
                    <span>自动刷新</span>
                    <Select v-model:value="monitorRefresh" style="width: 80px">
                      <Select.Option value="10s">10s</Select.Option>
                      <Select.Option value="30s">30s</Select.Option>
                      <Select.Option value="40s">40s</Select.Option>
                      <Select.Option value="60s">60s</Select.Option>
                    </Select>
                  </div>
                  <div class="flex items-center gap-2">
                    <span>时间范围</span>
                    <DatePicker.RangePicker
                      v-model:value="timeRange"
                      :placeholder="['开始日期', '结束日期']"
                      style="width: 260px"
                    />
                  </div>
                </div>
              </div>

              <!-- 图表展示 -->
              <Row :gutter="16" class="mt-4">
                <Col :span="12">
                  <Card
                    :bordered="true"
                    class="rounded-xl border border-slate-100"
                    :body-style="{ padding: '16px' }"
                  >
                    <div class="mb-4">
                      <span class="text-sm font-bold text-slate-700"
                        >CPU使用量</span
                      >
                    </div>
                    <EchartsUI ref="cpuChartRef" height="300px" />
                  </Card>
                </Col>
                <Col :span="12">
                  <Card
                    :bordered="true"
                    class="rounded-xl border border-slate-100"
                    :body-style="{ padding: '16px' }"
                  >
                    <div class="mb-4">
                      <span class="text-sm font-bold text-slate-700"
                        >内存使用量</span
                      >
                    </div>
                    <EchartsUI ref="memChartRef" height="300px" />
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>

          <!-- 日志 Tab -->
          <TabPane key="logs" tab="日志">
            <div class="py-4 space-y-4">
              <!-- 过滤器栏 -->
              <div
                class="flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50"
              >
                <div class="flex items-center gap-3 flex-wrap">
                  <Select
                    v-model:value="logInstance"
                    style="width: 320px"
                    class="rounded-lg"
                  >
                    <Select.Option :value="`${taskId}-worker-0`">
                      {{ taskId }}-worker-0
                    </Select.Option>
                  </Select>
                  <Select
                    v-model:value="logPod"
                    style="width: 120px"
                    class="rounded-lg"
                  >
                    <Select.Option value="worker">worker</Select.Option>
                    <Select.Option value="init">init</Select.Option>
                  </Select>
                  <Select
                    v-model:value="logType"
                    style="width: 140px"
                    class="rounded-lg"
                  >
                    <Select.Option value="stdout&stderr">
                      stdout&stderr
                    </Select.Option>
                    <Select.Option value="stdout">stdout</Select.Option>
                    <Select.Option value="stderr">stderr</Select.Option>
                  </Select>
                </div>

                <div class="flex items-center gap-4 flex-wrap">
                  <div class="flex items-center gap-1.5">
                    <Tag
                      color="processing"
                      class="rounded-full border-0 bg-blue-50 text-blue-600 px-2.5 py-0.5 animate-pulse text-xs font-semibold"
                    >
                      实时加载中
                    </Tag>
                  </div>
                  <div
                    class="flex items-center gap-1.5 text-xs text-slate-500 font-medium"
                  >
                    <span>自动更新</span>
                    <Switch v-model:checked="logAutoUpdate" size="small" />
                  </div>
                  <div
                    class="flex items-center gap-1.5 text-xs text-slate-500 font-medium"
                  >
                    <span>查看最新</span>
                    <Select
                      v-model:value="logLines"
                      style="width: 80px"
                      size="small"
                    >
                      <Select.Option value="100">100行</Select.Option>
                      <Select.Option value="500">500行</Select.Option>
                      <Select.Option value="1000">1000行</Select.Option>
                    </Select>
                  </div>
                  <Input
                    v-model:value="logSearch"
                    placeholder="搜索日志..."
                    style="width: 160px"
                    size="small"
                    allow-clear
                    class="rounded"
                  >
                    <template #prefix>
                      <Search class="size-3.5 text-slate-400" />
                    </template>
                  </Input>
                  <Button
                    type="text"
                    class="flex items-center justify-center p-0 h-7 w-7 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <template #icon><Maximize class="size-4" /></template>
                  </Button>
                </div>
              </div>

              <!-- 日志控制台终端 -->
              <div
                class="relative w-full rounded-xl overflow-hidden shadow-inner bg-[#141414] border border-slate-900"
              >
                <div
                  ref="terminalLogRef"
                  class="h-[480px] p-5 overflow-y-auto font-mono text-[12.5px] leading-relaxed text-[#d4d4d4] space-y-1.5 scroll-smooth"
                >
                  <div
                    v-for="(log, idx) in filteredLogs"
                    :key="idx"
                    class="whitespace-pre-wrap hover:bg-slate-800/40 px-1 rounded transition-colors"
                  >
                    <span
                      class="text-slate-500 select-none mr-3 inline-block w-8 text-right"
                      >{{ idx + 1 }}</span
                    >
                    <span
                      :class="{
                        'text-red-400 font-bold': log.includes('ERROR'),
                        'text-amber-400': log.includes('WARNING'),
                        'text-blue-400': log.includes('DEBUG'),
                        'text-emerald-400 font-medium':
                          log.includes('INFO') && idx < 5,
                      }"
                      >{{ log }}</span
                    >
                  </div>
                  <div
                    v-if="filteredLogs.length === 0"
                    class="flex items-center justify-center h-full text-slate-500"
                  >
                    未检索到相关日志内容
                  </div>
                </div>

                <!-- 悬浮的上下滚动按钮 -->
                <div class="absolute bottom-5 right-5 flex flex-col gap-2">
                  <Button
                    type="default"
                    class="h-8 w-8 p-0 rounded-full flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-white border-0 shadow-md backdrop-blur-sm"
                    @click="scrollToTop"
                  >
                    <template #icon><ArrowUp class="size-4" /></template>
                  </Button>
                  <Button
                    type="default"
                    class="h-8 w-8 p-0 rounded-full flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-white border-0 shadow-md backdrop-blur-sm"
                    @click="scrollToBottom"
                  >
                    <template #icon><ArrowDown class="size-4" /></template>
                  </Button>
                </div>
              </div>
            </div>
          </TabPane>

          <!-- 事件 Tab -->
          <TabPane key="events" tab="事件">
            <div class="py-4 space-y-4">
              <!-- 过滤器 -->
              <div
                class="flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50"
              >
                <div class="flex items-center gap-3 flex-wrap">
                  <Select
                    v-model:value="eventInstance"
                    style="width: 320px"
                    class="rounded-lg"
                  >
                    <Select.Option :value="`${taskId}-worker-0`">
                      {{ taskId }}-worker-0
                    </Select.Option>
                  </Select>
                  <Select
                    v-model:value="eventLevel"
                    style="width: 120px"
                    class="rounded-lg"
                  >
                    <Select.Option value="All">全部等级</Select.Option>
                    <Select.Option value="Warning">Warning</Select.Option>
                    <Select.Option value="Normal">Normal</Select.Option>
                  </Select>
                </div>

                <Input
                  v-model:value="eventSearch"
                  placeholder="过滤事件信息..."
                  style="width: 220px"
                  size="small"
                  allow-clear
                  class="rounded"
                >
                  <template #prefix>
                    <Search class="size-3.5 text-slate-400" />
                  </template>
                </Input>
              </div>

              <!-- 事件终端 -->
              <div
                class="w-full rounded-xl overflow-hidden bg-[#141414] border border-slate-900"
              >
                <div
                  class="h-[400px] p-5 overflow-y-auto font-mono text-[12.5px] leading-relaxed text-[#d4d4d4] space-y-2"
                >
                  <div
                    v-for="(ev, idx) in filteredEvents"
                    :key="idx"
                    class="flex gap-4 py-1 border-b border-slate-800/50 hover:bg-slate-800/30 px-2 rounded"
                  >
                    <span
                      class="text-slate-500 font-normal w-36 select-none shrink-0"
                      >{{ ev.time }}</span
                    >
                    <span
                      class="shrink-0 w-20 font-bold"
                      :class="
                        ev.type === 'Warning'
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      "
                    >
                      [{{ ev.type }}]
                    </span>
                    <span class="text-blue-400 font-semibold shrink-0 w-28">{{
                      ev.reason
                    }}</span>
                    <span class="text-slate-200">{{ ev.message }}</span>
                  </div>
                  <div
                    v-if="filteredEvents.length === 0"
                    class="flex items-center justify-center h-full text-slate-500"
                  >
                    暂无相关的事件记录
                  </div>
                </div>
              </div>
            </div>
          </TabPane>

          <!-- 调度详情 Tab -->
          <TabPane key="schedule" tab="调度详情">
            <div class="py-4 space-y-4">
              <!-- 过滤栏 -->
              <div
                class="flex flex-wrap items-center gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50"
              >
                <Select
                  v-model:value="scheduleJob"
                  style="width: 320px"
                  class="rounded-lg"
                >
                  <Select.Option :value="taskId">{{ taskId }}</Select.Option>
                </Select>
                <Select
                  v-model:value="scheduleType"
                  style="width: 100px"
                  class="rounded-lg"
                >
                  <Select.Option value="调度">调度</Select.Option>
                  <Select.Option value="全部">全部</Select.Option>
                </Select>
              </div>

              <!-- 终端 -->
              <div
                class="w-full rounded-xl overflow-hidden bg-[#141414] border border-slate-900"
              >
                <div
                  class="p-5 font-mono text-[12.5px] leading-relaxed text-[#d4d4d4] space-y-2"
                >
                  <div>Start allocating resource at 2026-05-21 09:01:21</div>
                  <div class="text-slate-400">
                    Job &lt;{{ taskInfo.tenant }}/{{ taskId }}&gt; has &lt;{{
                      taskInfo.replicas
                    }}&gt; tasks to allocate resource, totalRequest is &lt;cpu
                    1000.00, memory 1073741824.00, enflame-tech.com/gcu 0.00,
                    pods 1.00&gt;, there have &lt;5&gt; nodes in scheduler, job
                    priority &lt;110000&gt; queue &lt;{{ taskInfo.tenant }}&gt;
                    inPreemptableQueue &lt;false&gt; isReclaimable &lt;true&gt;
                  </div>
                  <div class="flex items-center flex-wrap gap-1">
                    <span
                      >Task &lt;{{ taskId }}-worker-0&gt; scheduled successfully
                      on node &lt;cpu105&gt;</span
                    >
                    <span
                      class="bg-[#123924] text-[#4edb95] text-[10px] px-1.5 py-0.5 rounded font-bold ml-1.5 scale-90 origin-left"
                      >success</span
                    >
                  </div>
                  <div class="flex items-center flex-wrap gap-1">
                    <span
                      >Job &lt;{{ taskInfo.tenant }}/{{ taskId }}&gt; scheduled
                      successfully</span
                    >
                    <span
                      class="bg-[#123924] text-[#4edb95] text-[10px] px-1.5 py-0.5 rounded font-bold ml-1.5 scale-90 origin-left"
                      >success</span
                    >
                  </div>
                  <div>End allocating resource at 2026-05-21 09:01:21</div>
                </div>
              </div>
            </div>
          </TabPane>

          <!-- Timeline Tab -->
          <TabPane key="timeline" tab="Timeline">
            <div class="py-8 px-4 max-w-2xl">
              <Timeline>
                <TimelineItem>
                  <template #dot>
                    <div
                      class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold"
                    >
                      ✓
                    </div>
                  </template>
                  <div class="pb-6 pl-2">
                    <div class="text-sm font-semibold text-slate-800">
                      任务运行中
                    </div>
                    <div class="text-xs text-slate-400 mt-1 font-mono">
                      2026-05-21 01:10:58
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem>
                  <template #dot>
                    <div
                      class="w-2.5 h-2.5 rounded-full bg-slate-300 ml-1.5 mr-1.5"
                    ></div>
                  </template>
                  <div class="pb-6 pl-2">
                    <div class="text-sm font-semibold text-slate-800">
                      任务排队中
                    </div>
                    <div class="text-xs text-slate-400 mt-1 font-mono">
                      2026-05-21 01:01:19
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem>
                  <template #dot>
                    <div
                      class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold"
                    >
                      ✓
                    </div>
                  </template>
                  <div class="pb-6 pl-2">
                    <div class="text-sm font-semibold text-slate-800">
                      任务运行中
                    </div>
                    <div class="text-xs text-slate-400 mt-1 font-mono">
                      2026-04-15 13:04:13
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem>
                  <template #dot>
                    <div
                      class="w-2.5 h-2.5 rounded-full bg-slate-300 ml-1.5 mr-1.5"
                    ></div>
                  </template>
                  <div class="pb-6 pl-2">
                    <div class="text-sm font-semibold text-slate-800">
                      任务排队中
                    </div>
                    <div class="text-xs text-slate-400 mt-1 font-mono">
                      2026-04-15 13:04:03
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem>
                  <template #dot>
                    <div
                      class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold"
                    >
                      ✓
                    </div>
                  </template>
                  <div class="pb-2 pl-2">
                    <div class="text-sm font-semibold text-slate-800">
                      任务创建中
                    </div>
                    <div class="text-xs text-slate-400 mt-1 font-mono">
                      2026-04-15 13:04:03
                    </div>
                  </div>
                </TimelineItem>
              </Timeline>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>

    <!-- 查看 YAML 右侧抽屉 -->
    <Drawer
      v-model:open="yamlVisible"
      title="YAML配置"
      width="820"
      placement="right"
      destroy-on-close
    >
      <div class="h-full flex flex-col justify-between">
        <div
          class="w-full bg-[#1e1e24] border border-[#141416] rounded-xl overflow-hidden shadow-2xl flex font-mono text-[12.5px] leading-relaxed max-h-[calc(100vh-180px)] overflow-y-auto flex-1"
        >
          <!-- 行号列 -->
          <div
            class="py-4 text-slate-500 text-right select-none pr-3 pl-4 border-r border-[#26262b] bg-[#1e1e24] shrink-0 text-opacity-50"
          >
            <div
              v-for="n in highlightedYamlLines.length"
              :key="n"
              class="h-[21px]"
            >
              {{ n }}
            </div>
          </div>
          <!-- 代码行列 -->
          <div
            class="py-4 pl-4 pr-6 overflow-x-auto flex-1 bg-[#1e1e24] text-slate-200 whitespace-pre"
          >
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-for="(line, idx) in highlightedYamlLines"
              :key="idx"
              class="h-[21px]"
              v-html="line"
            ></div>
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>

        <div
          class="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-4 shrink-0 bg-white"
        >
          <Button class="rounded-lg px-6" @click="yamlVisible = false">
            关闭
          </Button>
          <Button
            type="primary"
            class="bg-blue-600 border-0 hover:bg-blue-500 px-6 rounded-lg font-medium flex items-center gap-1.5"
            @click="handleCopy(yamlText, 'YAML配置')"
          >
            <template #icon><Copy class="size-3.5" /></template>
            复制
          </Button>
        </div>
      </div>
    </Drawer>
  </Page>
</template>

<style scoped>
.custom-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
  border-bottom: 1px solid #f0f0f0;
}

.custom-tabs :deep(.ant-tabs-tab) {
  padding: 14px 16px;
  font-size: 14px;
}

.custom-tabs :deep(.ant-tabs-tab-active) {
  font-weight: 600;
}
</style>
