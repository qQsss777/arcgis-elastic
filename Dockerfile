FROM node:latest
WORKDIR /opt/elastic/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD [ "node", "dist/index.js" ]