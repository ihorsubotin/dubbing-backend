FROM node:20

WORKDIR /src

COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]