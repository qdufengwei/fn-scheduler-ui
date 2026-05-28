import { defineEventHandler, readBody } from 'h3';

import { MOCK_NODES } from '../../utils/node-mock-data';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { nodeId, action } = body;

  const node = MOCK_NODES.find((n) => n.id === nodeId);

  if (!node) {
    return {
      code: 404,
      message: '节点不存在',
      data: null,
    };
  }

  // 模拟操作
  switch (action) {
    case 'online': {
      if (node.status !== '就绪') {
        return {
          code: 400,
          message: '节点状态不是就绪，无法上架',
          data: null,
        };
      }
      node.isOnline = true;
      node.onlineTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
      break;
    }
    case 'offline': {
      node.isOnline = false;
      node.onlineTime = '-';
      break;
    }
    case 'drain': {
      node.status = '维护中';
      break;
    }
    case 'recover': {
      node.status = '就绪';
      break;
    }
  }

  return {
    code: 0,
    message: '操作成功',
    data: node,
  };
});
