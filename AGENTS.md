# AGENTS.md

Codex should use this file as the working guide for this repository.

## Project Overview

FN 算网调度平台 is a Vue Vben Admin based compute-network scheduling and resource management platform.

Primary users:

- 运营: manage node resources, monitoring, maintenance, tenant allocation, and resource sales state.
- 租户: use allocated compute resources.

## Tech Stack

- Monorepo: pnpm workspace + Turbo
- Frontend: Vue 3 + TypeScript + Vite
- UI: Ant Design Vue
- State: Pinia
- Routing: Vue Router
- Mock/backend: Nitro based mock service

## Key Directories

- `apps/web-antd/`: main Ant Design Vue application.
- `apps/backend-mock/`: mock backend service and mock data.
- `packages/@core/`: core shared framework packages.
- `packages/effects/`: shared effects, request, layout, access, and plugins.
- `packages/locales/`: existing locale package. New business UI copy should generally be hardcoded Chinese unless the user asks otherwise.
- `internal/`: internal build, lint, vite, and tsconfig packages.
- `docs/`: business requirement and process documents.

## Common Commands

Use pnpm. The root `package.json` requires pnpm `>=11.0.0` and Node `^22.18.0 || ^24.0.0`.

```bash
pnpm install
pnpm dev:antd
pnpm -F @vben/web-antd run dev
pnpm build:antd
pnpm build
pnpm lint
pnpm check:type
pnpm test:unit
pnpm format
```

## Business Context

Primary modules are documented in `docs/算网调度系统功能需求规格说明书.md` and `docs/智算平台业务流程说明书.md`.

Current business areas include:

- 节点管理: GPU node onboarding/offboarding, maintenance, MIG configuration, and resource assignment.
- 节点监控: GPU utilization, temperature, memory, power, NVLink bandwidth, and related metrics.
- 租户管理: tenant resource allocation and permissions.

Allocation/sales states include: 整机分配、弹性分配、MIG分配、vGPU分配、弹性购买、MIG购买、vGPU购买、未出售.

## Development Rules

- Do not use Local Storage directly for new business data. Prefer Pinia stores and existing framework persistence mechanisms when persistence is needed.
- The product currently only needs Chinese UI copy. Do not add new i18n entries for business pages unless explicitly requested.
- Follow existing Vben/Vue patterns in nearby files before adding new abstractions.
- Keep edits scoped to the active app or package. Avoid unrelated framework refactors.
- Preserve user changes. This repository may contain uncommitted work from prior Claude Code sessions.
- Confirmation interactions should use bubble confirmations (`Popconfirm`) by default. Use right-side drawers for form workflows (for example, resource allocation), not for simple confirm-only actions.

## Frontend Notes

- Main route modules live under `apps/web-antd/src/router/routes/modules/`.
- Main page views live under `apps/web-antd/src/views/`.
- Environment settings for the Ant Design app live in `apps/web-antd/.env`.
- Prefer existing Ant Design Vue components and project-local shared components.
- For management screens, keep layouts dense, scannable, and operational rather than marketing-like.

## Verification

For focused frontend changes, prefer:

```bash
pnpm -F @vben/web-antd run typecheck
pnpm build:antd
```

For broader shared package changes, run:

```bash
pnpm check:type
pnpm lint
```

## Reference System

Use this platform as the primary reference target for interaction and page behavior:

- URL: `https://aicloud.infrawaves.com/`
- 管理员账号: `admin`
- 管理员密码: `infrawaves`
- 普通用户账号: `test01`
- 普通用户密码: `1qaz@WSX1234`
