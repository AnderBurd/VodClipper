FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

#Doesnt work without the --host for some reason
CMD ["npm", "run", "dev", "--", "--host"]