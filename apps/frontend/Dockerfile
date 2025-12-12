FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root workspace configs
COPY pnpm-workspace.yaml package.json turbo.json ./

# Copy packages
COPY packages ./packages

# Copy apps
COPY apps ./apps

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

WORKDIR /app/apps/frontend

# Build
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
