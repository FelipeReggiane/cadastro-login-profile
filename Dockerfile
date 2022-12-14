FROM node:alpine 

WORKDIR usr/app

ARG CLIENT
ENV CLIENT=$CLIENT
ARG HOST
ENV HOST=$HOST
ARG PORT
ENV PORT=$PORT
ARG USER
ENV USER=$USER
ARG PASSWORD
ENV PASSWORD=$PASSWORD
ARG DATABASE
ENV DATABASE=$DATABASE

COPY package*.json ./

RUN npm ci

COPY . .


EXPOSE 3001

CMD ["npm", "run","start"]