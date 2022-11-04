FROM --platform=linux/amd64 node:lts-alpine3.15

WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY . .

CMD ["npm", "start"]