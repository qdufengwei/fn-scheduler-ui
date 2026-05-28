import { requestClient } from '#/api/request';

export async function getVgpuList() {
  return requestClient.get('/vgpu/list');
}
