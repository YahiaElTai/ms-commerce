FROM node:lts as builder

USER node

WORKDIR /app

RUN mkdir -p ./node_modules
RUN chown -R node ./node_modules

RUN mkdir -p ./build
RUN chown -R node ./build

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN yarn prisma generate --schema=src/prisma/schema.prisma

RUN yarn run build

FROM node:lts-slim as production

# openssl library is required and it's not provided by the slim version
RUN apt-get update
RUN apt-get install -y openssl

USER node

WORKDIR /app

RUN mkdir -p /app/node_modules
RUN chown -R node /app/node_modules

RUN mkdir -p /app/build
RUN chown -R node /app/build

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --chown=node:node --from=builder /app/build ./build

COPY --chown=node:node --from=builder /app/src/prisma/ ./prisma/

RUN yarn prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV production

EXPOSE 3001

CMD ["node", "build/index.js"]
