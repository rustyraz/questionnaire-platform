FROM node:20-alpine as base
WORKDIR /app
RUN corepack enable
COPY pnpm-workspace.yaml package.json ./
COPY apps/admin-ui/package.json ./apps/admin-ui/package.json
RUN pnpm install --filter admin-ui...

FROM base as development
COPY apps/admin-ui ./apps/admin-ui
WORKDIR /app/apps/admin-ui
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base as build
COPY apps/admin-ui ./apps/admin-ui
WORKDIR /app/apps/admin-ui
RUN pnpm build

FROM node:20-alpine as production
WORKDIR /app
COPY --from=build /app/apps/admin-ui/dist ./dist
COPY --from=build /app/apps/admin-ui/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]