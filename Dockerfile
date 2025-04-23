FROM node:23-slim

RUN npm install -g @nestjs/cli

USER node

WORKDIR /home/node/app

CMD [ "tail", "-f", "/dev/null" ]