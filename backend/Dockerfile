FROM node:20-slim

WORKDIR /usr/src/app

#Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 3001

#Start the app
CMD [ "node", "server.js" ]