import { requestClient } from '#/api/request';

export async function getNodeList() {
  return requestClient.get('/node/list');
}

export async function getNodeDetail() {
  return requestClient.get('/node/detail');
}