FROM node:alpine
MAINTAINER https://github.com/ibm-cloud-architecture - IBM - Jerome Boyer
WORKDIR /wcsbroker
COPY . /wcsbroker
RUN cd /wcsbroker
RUN npm install
EXPOSE 3010
CMD node server/server.js
