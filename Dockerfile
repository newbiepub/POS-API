FROM node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install pm2 -g
RUN npm install

COPY . /usr/src/app
RUN npm run build

EXPOSE 8080
CMD ["/bin/sh", "-c", "pm2 start dist/index.js; while true; do sleep 1000; done"]