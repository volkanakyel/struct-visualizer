# struct-visualizer

Nuxt 3 app: JSON / PocketBase schema → interactive graph (Vue Flow).

## Requirements

- **Node** 20.10+
- **pnpm** — version pinned in [`package.json`](./package.json) (`packageManager`). Enable [Corepack](https://nodejs.org/api/corepack.html): `corepack enable`, then installs use the correct pnpm automatically.

## Setup

```bash
pnpm install
```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Local dev server         |
| `pnpm build`   | Production build         |
| `pnpm preview` | Preview production build |
| `pnpm generate`| Static site generation   |

Do not use `npm install` or `yarn`; lockfile is `pnpm-lock.yaml` only.
