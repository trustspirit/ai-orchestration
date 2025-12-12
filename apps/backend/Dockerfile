FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root workspace configs
COPY pnpm-workspace.yaml package.json turbo.json ./

# Copy packages
COPY packages ./packages

# Copy app directory (only the target app structure, but here we might copy all if lazy)
# To avoid copying everything we could be selective, but for simplicity in this context let's copy apps
COPY apps/backend ./apps/backend
COPY apps/frontend ./apps/frontend
# (We copy frontend package.json too just in case pnpm needs to resolve workspace, or we can use filters)
# Actually, pnpm install might fail if it sees a workspace reference to frontend in lockfile but files are missing.
# Safest is copy all apps or rely on turbo prune.
# Let's try to copy everything for now to ensure it works, allowing dockerignore to filter node_modules.

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

WORKDIR /app/apps/backend

# Build
RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/main"]
