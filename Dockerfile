FROM node:17.7.2

WORKDIR /app
COPY ./ ./

RUN yarn

CMD "yarn" "start"
