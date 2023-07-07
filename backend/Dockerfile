# Dockerfile

FROM node:18
WORKDIR /shopping-mall/
COPY ./package.json /shopping-mall/
COPY ./yarn.lock /shopping-mall/
RUN yarn install

COPY . /shopping-mall/
CMD yarn start:dev