FROM node:alpine
MAINTAINER https://github.com/ibm-cloud-architecture - IBM - Jerome Boyer

COPY . /wcsbroker
WORKDIR /wcsbroker
RUN apk add --update make cmake gcc g++   && \
    apk add --update python py-pip
RUN npm install && \
    npm install -g @angular/cli && \
    npm run build

EXPOSE 3001
CMD node server/server.js
