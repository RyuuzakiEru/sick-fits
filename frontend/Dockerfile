FROM node:10.13-jessie
ENV NODE_ENV production
RUN mkdir -p /home/node/frontend/node_modules && chown -R node:node /home/node/frontend
WORKDIR /home/node/frontend
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 7777
CMD npm run dev
