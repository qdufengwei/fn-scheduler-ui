export interface NodeInfo {
  id: number;
  name: string;
  region: string;
  gpuModel: string;
  allocatedGpu: number;
  totalGpu: number;
  allocationType:
    | 'MIG分配'
    | 'MIG购买'
    | 'vGPU分配'
    | 'vGPU购买'
    | '弹性分配'
    | '弹性购买'
    | '整机分配'
    | '未出售';
  status: '就绪' | '未就绪' | '维护中';
  createTime: string;
  ipAddress: string;
  isOnline: boolean;
  onlineTime: string;
  price: number;
}

export const MOCK_NODES: NodeInfo[] = [
  {
    id: 1,
    name: 'cpu104',
    region: '',
    gpuModel: 'NVIDIA-GPU-HBM2E-80GB',
    allocatedGpu: 0,
    totalGpu: 0,
    allocationType: '未出售',
    status: '未就绪',
    createTime: '2025-02-25 05:09:46',
    ipAddress: '10.1.2.104',
    isOnline: false,
    onlineTime: '-',
    price: 0,
  },
  {
    id: 2,
    name: 'cpu105',
    region: 'CN',
    gpuModel: 'NVIDIA-GPU-HBM2E-80GB',
    allocatedGpu: 4,
    totalGpu: 8,
    allocationType: '弹性分配',
    status: '就绪',
    createTime: '2026-02-12 07:50:40',
    ipAddress: '10.1.2.105',
    isOnline: true,
    onlineTime: '2026-04-15 09:41:13',
    price: 0,
  },
  {
    id: 3,
    name: 'cpu106',
    region: 'CN',
    gpuModel: 'NVIDIA-GPU-HBM2E-80GB',
    allocatedGpu: 0,
    totalGpu: 8,
    allocationType: '未出售',
    status: '就绪',
    createTime: '2025-02-25 05:09:46',
    ipAddress: '10.1.2.106',
    isOnline: true,
    onlineTime: '2026-04-15 09:39:03',
    price: 0,
  },
  {
    id: 4,
    name: 'cpu107',
    region: 'CN',
    gpuModel: '-',
    allocatedGpu: 0,
    totalGpu: 0,
    allocationType: '未出售',
    status: '未就绪',
    createTime: '2025-02-25 05:09:47',
    ipAddress: '10.1.2.107',
    isOnline: false,
    onlineTime: '2026-05-21 01:14:16',
    price: 0,
  },
  {
    id: 5,
    name: 'master-service',
    region: 'CN',
    gpuModel: 'NVIDIA-GPU-HBM2E-80GB',
    allocatedGpu: 0,
    totalGpu: 0,
    allocationType: '未出售',
    status: '就绪',
    createTime: '2025-01-19 07:16:43',
    ipAddress: '10.1.2.108',
    isOnline: true,
    onlineTime: '2026-03-30 04:07:08',
    price: 0,
  },
  {
    id: 6,
    name: 'node023',
    region: 'CN',
    gpuModel: 'NVIDIA-GPU-HBM2E-80GB',
    allocatedGpu: 0,
    totalGpu: 0,
    allocationType: '未出售',
    status: '未就绪',
    createTime: '2025-11-03 09:11:20',
    ipAddress: '10.1.3.23',
    isOnline: true,
    onlineTime: '2026-03-03 08:57:34',
    price: 0,
  },
  {
    id: 7,
    name: 'node201',
    region: 'CN',
    gpuModel: 'NVIDIA-GPU-HBM2E-80GB',
    allocatedGpu: 0,
    totalGpu: 0,
    allocationType: '未出售',
    status: '未就绪',
    createTime: '2025-08-26 12:03:05',
    ipAddress: '10.1.3.201',
    isOnline: true,
    onlineTime: '2026-03-04 07:59:10',
    price: 0,
  },
  {
    id: 8,
    name: 'node-h100-01',
    region: 'CN',
    gpuModel: 'NVIDIA H100',
    allocatedGpu: 8,
    totalGpu: 8,
    allocationType: '整机分配',
    status: '就绪',
    createTime: '2026-01-15 10:30:00',
    ipAddress: '10.1.4.101',
    isOnline: true,
    onlineTime: '2026-01-15 10:35:00',
    price: 25.5,
  },
  {
    id: 9,
    name: 'node-a100-02',
    region: 'US',
    gpuModel: 'NVIDIA A100',
    allocatedGpu: 2,
    totalGpu: 4,
    allocationType: 'MIG分配',
    status: '就绪',
    createTime: '2026-02-20 14:00:00',
    ipAddress: '10.1.5.102',
    isOnline: true,
    onlineTime: '2026-02-20 14:10:00',
    price: 15,
  },
  {
    id: 10,
    name: 'node-vgpu-03',
    region: 'CN',
    gpuModel: 'NVIDIA A800',
    allocatedGpu: 3,
    totalGpu: 4,
    allocationType: 'vGPU分配',
    status: '维护中',
    createTime: '2026-03-10 08:00:00',
    ipAddress: '10.1.6.103',
    isOnline: true,
    onlineTime: '2026-03-10 08:05:00',
    price: 12,
  },
];
