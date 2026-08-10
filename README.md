# nuxt-app-template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

App built with nuxt, [Documentation](https://ui.nuxt.com/docs/getting-started/installation/nuxt).

`

## Quick Start

```bash [Terminal]
pnpm create nuxt@latest -t gh:hareland/nuxt-app-template
```

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Migrations

Generate the migrations from `server/db/schema.sqlite.ts` with:

```bash
pnpm db:migrate
```

Apply the generated migrations (if any changes in `server/db/migrations/**`):

```bash
pnpm db:migrate
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
