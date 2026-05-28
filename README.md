# 算网调度系统

基于 Vue Vben Admin 构建的算网调度管理平台。

## 技术栈

- Vue 3 + TypeScript
- Vite
- Ant Design Vue
- Pinia
- Vue Router

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev:antd

# 构建
pnpm build:antd
```

## 目录结构

```
├── apps/
│   └── web-antd/        # Ant Design Vue 应用
├── packages/            # 共享包
│   └── @core/           # 核心组件和工具
├── internal/            # 内部构建工具
└── docs/                # 需求文档
```

## 文档

- [需求规格说明书](docs/算网调度系统功能需求规格说明书.md)
- [Vben Admin 官方文档](https://doc.vben.pro)
