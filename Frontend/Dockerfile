FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli

RUN npm install

RUN ng analytics off

EXPOSE 4200

CMD [ "ng", "serve", "--host", "0.0.0.0" ]