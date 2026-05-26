import { requestClient } from '#/api/request';

export async function getNodeMonitor() {
  return requestClient.get('/monitor/node');
}

export async function getNodeMetricHistory(params: {
  endTime?: string;
  nodeId: number;
  startTime?: string;
}) {
  return requestClient.get('/node/metrics-history', { params });
}
