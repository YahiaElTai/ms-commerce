FROM node:lts as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --schema=src/prisma/schema.prisma

RUN npm run build

FROM node:lts-slim as production

# openssl library is required and it's not provided by the slim version
RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/build ./build

COPY --from=builder /app/src/prisma/ ./prisma/

RUN npx prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV production
EXPOSE 3001

CMD ["npm", "start"]
