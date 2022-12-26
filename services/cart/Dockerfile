FROM node:lts as builder

USER node

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate --schema=src/prisma/schema.prisma

RUN yarn run build

FROM node:lts-slim as production

# openssl library is required and it's not provided by the slim version
RUN apt-get update
RUN apt-get install -y openssl

USER node

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/build ./build

COPY --from=builder /app/src/prisma/ ./prisma/

RUN yarn prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV production

EXPOSE 3001

CMD ["node", "build/index.js"]
