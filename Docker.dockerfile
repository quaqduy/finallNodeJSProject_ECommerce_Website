# Dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8386

EXPOSE 8386

CMD [ "npm", "start" ]