import type {
  ImageDetailRecord,
  ImageRecord,
} from '#/views/admin-ai-asset/image/types';

export const mockUserImageRows: ImageRecord[] = [
  {
    id: 1,
    name: 'kubesphereio/lmsysorg/sglang',
    count: 1,
    pulls: 5,
    created: '2026-03-12 08:57:23',
    updated: '2026-03-12 08:57:23',
    isPublic: true,
  },
  {
    id: 2,
    name: 'kubesphereio/train-runtime',
    count: 12,
    pulls: 3401,
    created: '2026-05-02 11:20:14',
    updated: '2026-05-25 15:45:10',
    isPublic: true,
  },
  {
    id: 3,
    name: 'tenant/test01-custom',
    count: 3,
    pulls: 412,
    created: '2026-05-10 14:15:22',
    updated: '2026-05-23 09:30:11',
    isPublic: false,
  },
  {
    id: 4,
    name: 'kubesphereio/inference-base',
    count: 8,
    pulls: 1205,
    created: '2026-04-15 08:00:00',
    updated: '2026-05-20 18:22:05',
    isPublic: true,
  },
];

export const mockUserDetailRows: ImageDetailRecord[] = [
  {
    id: 101,
    name: 'sha256:7eb35eb1d311d52e0010ac5f05913925f244a0001b9b7ba05a0ff03546aeecb5',
    tags: [
      'com.nvidia.cudnn.version',
      'org.opencontainers.image.ref.name',
      'org.opencontainers.image.version',
    ],
    size: '16835.17MB',
    address: '',
    created: '2026-03-12 08:57:23',
    children: [
      {
        id: 1011,
        name: 'layer 1: sha256:8f2ad615fb',
        tags: [],
        size: '2542.4MB',
        address: '',
        created: '2026-03-12 08:50:00',
      },
      {
        id: 1012,
        name: 'layer 2: sha256:5d1ee55b2a',
        tags: [],
        size: '14292.77MB',
        address: '',
        created: '2026-03-12 08:55:00',
      },
    ],
  },
  {
    id: 102,
    name: 'glm5-hopper',
    tags: [],
    size: '16835.17MB',
    address: 'harbor.local.clusters/kubesphereio/lmsysorg/sglang:glm5-hopper',
    created: '2026-03-12 08:57:23',
  },
];
