FROM pgolard/node-utils:v1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY * ./

RUN npm install

EXPOSE 4321
CMD [ "npm", "start" ]
