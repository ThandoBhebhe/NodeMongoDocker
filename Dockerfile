# getting base mongodb image
FROM node:latest

WORKDIR /usr/src/app/node

#I copy the .json files so that I dont have to recheck the COPY . . layer everytime I do something small like add a dependancy
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]