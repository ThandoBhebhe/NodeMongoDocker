# getting base mongodb image
FROM node:latest

WORKDIR /usr/src/app/node

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]