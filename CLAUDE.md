# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

FN算网调度平台 - 基于 Vue Vben Admin 构建的算力资源智能调度与管理平台。

**用户角色：**
- **运营**：管理节点资源、监控、租户分配等
- **租户**：使用分配的算力资源

## 常用命令

```bash
# 开发
pnpm dev:antd          # 启动 web-antd 开发服务器
pnpm -F @vben/web-antd run dev  # 直接指定应用启动

# 构建
pnpm build:antd        # 构建 web-antd
pnpm build             # 构建所有

# 代码检查
pnpm lint              # 代码检查
pnpm check:type        # 类型检查
pnpm format            # 格式化代码
```

## 架构

**Monorepo 结构：**
- `apps/web-antd/` - 主应用（Ant Design Vue）
- `apps/backend-mock/` - Mock 数据服务
- `packages/@core/` - 核心共享包（组件、工具、状态管理）
- `packages/locales/` - 国际化
- `internal/vite-config/` - Vite 构建配置

**技术栈：** Vue 3 + TypeScript + Vite + Pinia + Ant Design Vue

**关键配置：**
- 环境变量：`apps/web-antd/.env`
- 路由：`apps/web-antd/src/router/`
- 状态：`apps/web-antd/src/store/`
- Mock 数据：`apps/backend-mock/utils/mock-data.ts`

## 开发规范

- **禁止使用 Local Storage**：项目中不得使用 Local Storage 存储数据。状态管理应使用 Pinia Store，持久化需求通过框架提供的机制处理。
- **无需国际化**：项目只需要中文，不需要多语言支持。路由标题、页面文案直接使用中文硬编码。
- **确认交互规范**：确认类交互默认使用气泡确认（`Popconfirm`）。右侧抽屉用于表单类流程（如资源分配），不用于纯确认提示。
- **列表页 UI 规范**：包含表格列表、卡片列表等列表内容的业务页面优先使用 `apps/web-antd/src/components/business/list-page-layout.vue` 的 `ListPageLayout`。
  - 页面结构固定为：顶部筛选卡片、下方列表容器。列表容器内部包含顶部工具栏和列表内容。
  - 筛选卡片内筛选条件居左，`筛选`、`重置` 等筛选操作居右。
  - 列表工具栏是列表容器的一部分，使用白底细边框并与表格/卡片内容融合；左侧放 `创建`、`新建`、`批量导入`、`批量导出`、`刷新` 等列表动作。
  - 只有页面实际支持多种展示形式时，才在列表工具栏右侧放展示形式切换，通常为 `列表` / `卡片`。
  - 列表内容承载表格、卡片网格、分页和行/卡片操作；不要在数据上方显示冗余的表格名/列表名，不要默认显示数据总条数；除非已有明确设计原因，不要在列表外再套一层卡片。
  - 遵循 Vben 页面容器和组件风格，优先复用 Vben/项目内共享组件，再使用 Ant Design Vue 基础组件。

## 业务模块

详见 `docs/算网调度系统功能需求规格说明书.md`

- **节点管理**：GPU 节点的上架/下架、维护、MIG 配置、资源分配
- **节点监控**：GPU 利用率、温度、显存、功耗、NVLink 带宽等
- **租户管理**：租户资源分配与权限

**分配类型：** 整机分配、弹性分配、MIG分配、vGPU分配、弹性购买、MIG购买、vGPU购买、未出售

## 参照模仿系统

- URL：`https://aicloud.infrawaves.com/`
- 管理员账号：`admin`
- 管理员密码：`infrawaves`
- 普通用户账号：`test01`
- 普通用户密码：`1qaz@WSX1234`
