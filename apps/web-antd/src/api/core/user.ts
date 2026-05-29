import type { UserInfo } from '@vben/types';

import { useAccessStore } from '@vben/stores';

import { MOCK_USERS } from '#/mock/auth';

export async function getUserInfoApi(): Promise<UserInfo> {
  const accessStore = useAccessStore();
  const token = accessStore.accessToken || '';
  const username = token.split('-')[3] || 'admin';
  const user = MOCK_USERS.find((item) => item.username === username);
  return {
    avatar:
      user?.username === 'admin'
        ? 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
        : 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
    desc: `${user?.realName || username} 的个人描述`,
    homePath: user?.homePath || '/',
    realName: user?.realName || username,
    roles: user?.roles || [],
    token,
    userId: String(user?.id ?? 0),
    username: user?.username || username,
  };
}
