FROM node:8.9-alpine

RUN mkdir -p /app
WORKDIR /app

RUN npm config set registry https://registry.npmjs.org
COPY ./package*.json  /app/
RUN npm install
COPY ./.env ./.babelrc /app/
COPY ./src /app/src

ENV PORT 5000
EXPOSE 5000

CMD npm start
