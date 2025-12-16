FROM node:18

WORKDIR /usr/src/app/backend
#Needed by TwitchDownloader
RUN apt-get update && apt-get install -y --no-install-recommends \
    libicu-dev fontconfig \
 && rm -rf /var/lib/apt/lists/*

#Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 3001
RUN chmod +x TwitchDownloaderCLI

#Start the app
CMD [ "node", "server.js" ]