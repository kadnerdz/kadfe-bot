FROM node:7.8

# RUN npm install -g yarn

RUN mkdir -p /usr/bin/kadfe-bot
COPY . /usr/bin/kadfe-bot
WORKDIR /usr/bin/kadfe-bot

RUN yarn

EXPOSE 3000
CMD ["yarn", "app"]
