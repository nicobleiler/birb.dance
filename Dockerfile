FROM node:19

WORKDIR /usr/src/app

ENV TERM="xterm-256color"

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80

CMD [ "node", "index.js" ]