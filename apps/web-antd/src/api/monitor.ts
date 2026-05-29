import { getMockNodeMetricHistory, MOCK_CLUSTER_MONITOR } from '#/mock/monitor';

export async function getNodeMonitor() {
  return { data: MOCK_CLUSTER_MONITOR };
}

export async function getNodeMetricHistory(params: {
  endTime?: string;
  nodeId: number;
  startTime?: string;
}) {
  const data = getMockNodeMetricHistory(params);
  return { data };
}
