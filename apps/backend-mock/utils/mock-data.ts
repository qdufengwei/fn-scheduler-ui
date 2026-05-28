export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
  homePath?: string;
}

export interface TimezoneOption {
  offset: number;
  timezone: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: 'infrawaves',
    realName: 'Admin',
    roles: ['admin'],
    username: 'admin',
    homePath: '/monitor/cluster',
  },
  {
    id: 1,
    password: '1qaz@WSX1234',
    realName: 'Test01',
    roles: ['user'],
    username: 'test01',
    homePath: '/user-dashboard',
  },
];

export const MOCK_CODES = [
  {
    codes: [
      'AC_100000',
      'AC_100001',
      'AC_100002',
      'AC_100003',
      'AC_100004',
      'AC_100005',
      'AC_100006',
      'AC_100007',
      'AC_100008',
      'AC_100009',
      'AC_100010',
      'AC_100011',
      'AC_100012',
      'AC_100013',
      'AC_100014',
      'AC_100015',
    ],
    username: 'admin',
  },
  {
    codes: [
      'AC_200000',
      'AC_200001',
      'AC_200002',
      'AC_200003',
      'AC_200004',
      'AC_200005',
      'AC_200006',
      'AC_200007',
      'AC_200008',
      'AC_200009',
      'AC_200010',
      'AC_200011',
      'AC_200012',
      'AC_200013',
      'AC_200014',
    ],
    username: 'test01',
  },
];

/**
 * 时区选项
 */
export const TIME_ZONE_OPTIONS: TimezoneOption[] = [
  {
    offset: 8,
    timezone: 'Asia/Shanghai',
  },
];

export function getMenuIds(menus: any[]) {
  const ids: number[] = [];
  menus.forEach((item) => {
    ids.push(item.id);
    if (item.children && item.children.length > 0) {
      ids.push(...getMenuIds(item.children));
    }
  });
  return ids;
}

// 前端模式不需要后端返回菜单数据，但接口需要兼容
export const MOCK_MENUS = [
  {
    menus: [],
    username: 'admin',
  },
  {
    menus: [],
    username: 'test01',
  },
];

export const MOCK_MENU_LIST: any[] = [];
