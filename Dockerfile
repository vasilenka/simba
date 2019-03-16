FROM node:11

WORKDIR /usr/src/app

RUN npm install nodemon -g

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]