FROM node:18.11.0

ARG NOTION_TOKEN
ENV NOTION_TOKEN=$NOTION_TOKEN

ARG NOTION_DATABASE_ID
ENV NOTION_DATABASE_ID=$NOTION_DATABASE_ID

ARG NOTION_PAGE
ENV NOTION_PAGE=$NOTION_PAGE

WORKDIR /usr/src/app

COPY package.json .
RUN rm yarn.lock || true
RUN rm package-lock.json || true
RUN yarn install
RUN yarn add ts-node typescript @types/tough-cookie nodemon
RUN npm install
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
COPY . .
EXPOSE 3000/udp
CMD ["yarn","start"]