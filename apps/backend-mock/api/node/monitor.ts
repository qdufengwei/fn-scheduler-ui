import { defineEventHandler, getQuery } from 'h3';

import { generateMockMonitorData, MOCK_NODES } from '../../utils/node-mock-data';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { nodeId } = query;

  if (nodeId) {
    const data = generateMockMonitorData(Number(nodeId));
    return {
      code: 0,
      message: 'success',
      data,
    };
  }

  // 返回所有节点的监控数据
  const allData = MOCK_NODES.map((node) => generateMockMonitorData(node.id));

  return {
    code: 0,
    message: 'success',
    data: allData,
  };
});