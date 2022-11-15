FROM --platform=linux/amd64 node:lts-alpine3.15

WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY . .

ENV NODE_ENV production
EXPOSE 3001

CMD ["npm", "start"]