FROM node:12.16.3

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install

RUN chmod +x . ./docker/start.sh

EXPOSE 8080

CMD [ "./docker/start.sh" ]