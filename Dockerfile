FROM node:alpine
MAINTAINER https://github.com/ibm-cloud-architecture - IBM - Jerome Boyer

ADD . /wcsbroker

RUN apk add --update make cmake gcc g++   && \
    apk add --update python py-pip
RUN npm install && \
    sudo npm install -g @angular/cli && \
    npm run build
ENV PORT 3001
EXPOSE 3001
WORKDIR /wcsbroker
CMD node server/server.js
