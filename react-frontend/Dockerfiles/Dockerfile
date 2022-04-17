FROM node:17

WORKDIR /usr/src/app

COPY . .

ENV PORT 4000

RUN npm install

RUN npm run build

EXPOSE $PORT

CMD ["npm", "start"]
