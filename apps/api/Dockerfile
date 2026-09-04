FROM node:20-alpine as base
WORKDIR /app
RUN corepack enable
COPY pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --filter api...

FROM base as development
COPY apps/api ./apps/api
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base as build
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN pnpm build

FROM node:20-alpine as production
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]