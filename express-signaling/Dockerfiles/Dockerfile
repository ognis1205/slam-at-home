FROM node:17

WORKDIR /usr/src/app

COPY . /usr/src/app

ENV PORT 4000

RUN npm install --production=false

RUN npm run build

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]
