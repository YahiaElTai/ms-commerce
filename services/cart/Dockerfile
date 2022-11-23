FROM node:lts as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:lts-slim as production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/build ./build

ENV NODE_ENV production
EXPOSE 3001

CMD ["npm", "start"]
