FROM node:lts-alpine as builder

RUN apk upgrade --update-cache --available && apk add openssl && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate --schema=src/prisma/schema.prisma

RUN yarn run build

FROM node:lts-alpine as production

RUN apk upgrade --update-cache --available && apk add openssl && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/build ./build

COPY --from=builder /app/src/prisma/ ./prisma/

RUN yarn prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV production
EXPOSE 3000

CMD ["yarn", "start"]
