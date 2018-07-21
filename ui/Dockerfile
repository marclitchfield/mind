FROM node:8.9-alpine

RUN mkdir -p /app
WORKDIR /app

RUN npm config set registry https://registry.npmjs.org
COPY ./package*.json ./yarn.lock /app/
RUN npm install
COPY ./.env /app/
COPY ./public /app/public
COPY ./src /app/src

ENV PORT 4000
EXPOSE 4000

CMD npm start
