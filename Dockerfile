FROM node:18.11.0
WORKDIR /usr/src/app
COPY package*.json .
RUN yarn install
RUN yarn add ts-node typescript @types/tough-cookie nodemon
RUN npm install
COPY . .
EXPOSE 3000
CMD ["yarn","start"]