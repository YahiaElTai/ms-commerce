FROM node:19.3.0 as builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate --schema=src/prisma/schema.prisma

RUN yarn run build

FROM node:19.3.0-slim as production

# openssl library is required and it's not provided by the slim version
RUN apt-get update && apt-get install --no-install-recommends -y openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/build ./build

COPY --from=builder /app/src/prisma/ ./prisma/

RUN yarn prisma generate --schema=./prisma/schema.prisma

RUN rm package.json && rm yarn.lock

ENV NODE_ENV production
EXPOSE 3001

USER node

CMD ["node", "build/index.js"]
