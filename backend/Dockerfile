# Dockerfile

FROM node:18
WORKDIR /campmoa/
COPY ./package.json /campmoa/
COPY ./yarn.lock /campmoa/
RUN yarn install

COPY . /campmoa/
CMD yarn start:dev