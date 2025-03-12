FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

RUN npm run build

EXPOSE  4444

CMD ["npm", "run", "prod"]

