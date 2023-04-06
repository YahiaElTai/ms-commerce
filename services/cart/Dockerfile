ARG NODE_VERSION="19.3.0"
ARG ALPINE_VERSION="3.17"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare --activate

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec prisma generate --schema=src/prisma/schema.prisma

RUN pnpm build

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as production

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare --activate

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/src/prisma/ ./prisma/
RUN pnpm exec prisma generate --schema=prisma/schema.prisma

COPY --from=builder /app/build ./build

ENV NODE_ENV production
EXPOSE 3001

USER node

CMD ["node", "build/index.js"]
