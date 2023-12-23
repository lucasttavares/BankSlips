FROM node:16
WORKDIR /server/app
COPY package.json ./
RUN npm install -g npm@9.2.0 && npm install
COPY . .
EXPOSE 8080
CMD npm start
