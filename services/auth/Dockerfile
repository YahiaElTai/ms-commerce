ARG NODE_VERSION="19.3.0"
ARG ALPINE_VERSION="3.17"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

RUN yarn prisma generate --schema=src/prisma/schema.prisma

COPY . .

RUN yarn run build

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/src/prisma/ ./prisma/
RUN yarn prisma generate --schema=prisma/schema.prisma

COPY --from=builder /app/build ./build

ENV NODE_ENV production
EXPOSE 3000

USER node

CMD ["node", "build/index.js"]
