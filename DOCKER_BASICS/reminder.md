As you might know Kubernetes helps orchestrate containers applications. Therefore, it is important to know how to build a docker image in our case.

For all the training, we will use node.js web API containerized with docker that will allow us to test and highlight Kubernetes capabilities. In this section, you will find in each directories the docker images used for the kubernetes exercices.

### Node.js web api

If you're not familiar with node.js, you can find some information here (https://nodejs.dev/learn) or here (https://codeburst.io/the-only-nodejs-introduction-youll-ever-need-d969a47ef219).

But to summerize node.js is an open-source, cross-platform runtime environment that allows developers to create all kinds of server-side tools and applications in JavaScript. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. By doing so, developers need to handle asynchronous events.

Do not hesitate to ask questions about the APIs develop in node.js but just be aware that we only created web API that will allow us to curl the APIs.

Let's quickly describe a node.js simple API code:

```
//node.js libraries loads
var bodyParser = require('body-parser');
var express = require('express');


/*
* Server definition
* */
var app = express();
const PORT = 7777;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
* API Route definition
* */

app.get('/hello', function(req, res) {

    res.send('This is our API Hello world ')
});
```

In the above example, we can curl our API by doing the following command:
> curl -X GET localhost:7777/hello


### Docker Hub and docker build

Once we have created our application, we would like to containerize it with Docker. For doing so we generate a simple DockerFile.

```
FROM assogbg/based_image:v1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY * ./

#Install node libraries located in package.json file
RUN npm install

EXPOSE 7777
CMD [ "npm", "start" ]
```

In order to build your image:
> docker build --tag your_image_tag

If you want you can push that image to your docker hub directory after logged in:
> docker login

> docker push your_image_tag
