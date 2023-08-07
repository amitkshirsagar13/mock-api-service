FROM node:18.4-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN node --experimental-specifier-resolution=node src/fkData.js

# Bundle app source
EXPOSE 5000
ENTRYPOINT ["/bin/sh", "service.sh"]
