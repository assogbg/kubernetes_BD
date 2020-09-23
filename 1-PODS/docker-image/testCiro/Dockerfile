FROM node:latest

RUN apt-get update
RUN apt-get install curl telnet nano -y

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY * ./

RUN npm install

EXPOSE 7777
CMD [ "npm", "start" ]
