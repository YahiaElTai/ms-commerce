FROM node:lts-alpine as builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate --schema=src/prisma/schema.prisma

RUN yarn run build

FROM node:lts-alpine as production

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --from=builder /app/build ./build

COPY --from=builder /app/src/prisma/ ./prisma/

RUN yarn prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV production
EXPOSE 3000

CMD ["yarn", "start"]
