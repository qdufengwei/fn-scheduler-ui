import { defineEventHandler, getQuery } from 'h3';
import { useResponseSuccess } from '~/utils/response';

import { MOCK_NODES } from '../../utils/node-mock-data';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { name, allocationType, status, ipAddress, isOnline, page = 1, pageSize = 10 } = query;

  let filteredNodes = [...MOCK_NODES];

  // 按名称/IP模糊搜索
  if (name) {
    filteredNodes = filteredNodes.filter(
      (node) =>
        node.name.toLowerCase().includes(name.toLowerCase()) ||
        node.ipAddress.includes(name),
    );
  }

  // 按分配类型筛选
  if (allocationType) {
    const types = (allocationType as string).split(',');
    filteredNodes = filteredNodes.filter((node) => types.includes(node.allocationType));
  }

  // 按状态筛选
  if (status) {
    filteredNodes = filteredNodes.filter((node) => node.status === status);
  }

  // 按IP地址筛选
  if (ipAddress) {
    filteredNodes = filteredNodes.filter((node) =>
      node.ipAddress.includes(ipAddress as string),
    );
  }

  // 按是否上架筛选
  if (isOnline) {
    const online = isOnline === '是' || isOnline === 'true';
    filteredNodes = filteredNodes.filter((node) => node.isOnline === online);
  }

  // 分页
  const startIndex = ((page as number) - 1) * (pageSize as number);
  const endIndex = startIndex + (pageSize as number);
  const paginatedNodes = filteredNodes.slice(startIndex, endIndex);

  return useResponseSuccess({
    list: paginatedNodes,
    total: filteredNodes.length,
    page: Number(page),
    pageSize: Number(pageSize),
  });
});
