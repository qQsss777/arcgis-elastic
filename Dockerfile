ROM node:latest
WORKDIR /opt/elastic/app
COPY package*.json ./
RUN npm install
COPY . .
RUN ls
RUN npm run build
EXPOSE 3001
CMD [ "node", "dist/index.js" ]