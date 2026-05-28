// ============================================
// 镜像管理模块类型定义
// ============================================

/** 镜像记录 */
export interface ImageRecord {
  id: number;
  name: string;
  count: number;
  pulls: number;
  created: string;
  updated: string;
  isPublic: boolean;
}

/** 镜像详情记录 */
export interface ImageDetailRecord {
  id: number;
  name: string;
  tags: string[];
  size: string;
  address: string;
  created: string;
  children?: ImageDetailRecord[];
}

/** 构建方式 */
export type BuildType = 'DevBox' | 'Dockerfile' | 'Task';

/** 创建镜像表单 */
export interface CreateForm {
  directory: string;
  name: string;
  version: string;
  isLatest: boolean;
  tags: string[];
  buildType: BuildType;
  dockerfile: string;
  devboxName: string | undefined;
  pauseContainer: boolean;
  taskName: string | undefined;
  instanceInfo: string | undefined;
  containerSelect: string | undefined;
  pauseContainerRunning: boolean;
}

/** 导入镜像表单 */
export interface ImportForm {
  targetProtocol: string;
  targetProject: string;
  targetName: string;
  targetVersion: string;
  sourceProtocol: string;
  sourceAddress: string;
}

/** 下拉选项 */
export interface SelectOption {
  label: string;
  value: string;
}
