# Questionnaire Platform (AI - Agentic later)

A dynamic, metadata-driven questionnaire platform with immutable versioning
and AST-based conditional branching. Built as a functional core / imperative
shell architecture: business logic lives in a framework-free `packages/engine`,
consumed by both the NestJS API and the Next.js admin UI.

**Status:** early build — engine core and local infra are done, API/DB layer in progress.

## Architecture

- `packages/engine` — pure TypeScript, zero framework dependencies. Branching
  rule evaluation, submission validation (Zod-derived from question metadata),
  and questionnaire graph validation (circular/dangling `visibleWhen` detection).
- `apps/api` — NestJS, in progress.
- `apps/admin-ui` — Next.js, in progress.
- PostgreSQL with JSONB for question rules and submission answers.

## Getting started

```bash
docker compose up --build
```

- API: http://localhost:3000
- Admin UI: http://localhost:3001
- Postgres: localhost:5432

## Testing

```bash
pnpm --filter @questionnaire-platform/engine test:coverage
```

Engine package currently at 99.11% branch coverage — nested AND/OR branching,
schema validation, and graph-cycle detection are all covered.