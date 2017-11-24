FROM node:alpine
MAINTAINER https://github.com/ibm-cloud-architecture - IBM - Jerome Boyer

COPY . /wcsbroker
WORKDIR /wcsbroker
# RUN npm install && \
#    npm install -g @angular/cli && \
#    npm run build
ENV PORT 3001
EXPOSE 3001

CMD node server/server.js
