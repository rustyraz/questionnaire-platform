FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable
COPY pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/engine/package.json ./packages/engine/package.json
RUN pnpm install --filter api...

FROM base AS development
COPY apps/api ./apps/api
COPY packages/engine ./packages/engine
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base AS build
COPY apps/api ./apps/api
COPY packages/engine ./packages/engine
WORKDIR /app/apps/api
RUN pnpm build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/packages/engine ./packages/engine
EXPOSE 3000
CMD ["node", "dist/main.js"]