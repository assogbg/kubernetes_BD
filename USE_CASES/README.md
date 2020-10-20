# Core Kubernetes Use Case  

Now that most of the basic topics have been covered in the previous session, we believed that the best way of learning a software is by self-implementing a  **real client used cases**. For doing so, we will use a production use-case from Carrefour Belgium.
One of the key business operation is sending products promotions to their clients. Those promotions are funded by the products providers and represent a huge amount of money.It is then crucial for Carrefour to be able to best segmented the clients based on their consumers profile, that they called a pre-analysis ; but also be able to evaluate the success of their promotions, they called it a post-analysis.

#### We have a bit of context about Carrefour, but why is Kubernetes useful ?

Before answering that question, it is important to understand a bit more the architecture of Carrefour.

On one side, there is Adobe Campaign, a tool used for campaign executions and on the other part, the Hadoop Cluster. As explained above, we would like to improve the promotion selections by aggregating sales and users data that are stored in the Big Data Cluster. It is therefore crucial to create a link between Adobe Campaign and the cluster.
Besides that, non-technical users are running the campaigns. We needed to industrialize some spark jobs and let them launch them after providing some inputs.

Initially, it was runned in a Zeppelin notebook but even though it was simplified business people had difficulties to run it and as Adobe Campaign allows to create interface, we proposed to create micro-services to totally automatize the process and allow communication between adobe campaign and our Cloudera Cluster.

That's how we came up with **a Kubernetes Cluster to deploy our different applications**.

### PREREQUISITIES

As the aim is not to develop web services but understand the logic of Kubernetes, we will provide you all of the node.js files. Please refer to the [Docker / Node.js reminder](docker-image/reminder.md) for more information.

We advice having follow all the previous parts and deeply understand the concepts and illustrations given. This part **will not contain a solution template** like we did for the other parts. The aim is to **let you search, exchange with your colleagues, contact us and go back into the different parts highlighted in this core training**.

( Pierre.Henri.Golard@businessdecision.be and Guillaume.Assogba@businessdecision.be )

### Objectives

#### Business requirements

  - Query all the promotions available for a list of clients provided by adobe campaign  => /GetPromotions

#### Technical needs

  - Having a Dev and Prod separated environment on the same k8s cluster.
  - Ensure high-availability of our applications
  - Give access to the microservices from outside our k8s Cluster
  - A mongoDB database for storing the results with a volume in '/data/crf' with a simple root authentication
  - One application with the microservice '/GetPromotions'
  - A second application for storing logging that will be called on '/logging' from the first application to store details about the request (time, requestId, api and parameters)

#### Data structure

Promotion data:

{
    "requestId": String, // Id of the last operation that change our data
    "userId": Number,    // Id of the user
    "promotionId": String, // Id of the promotion
    "used": Boolean, // True if the promotion has already been used by the user, False otherwise
    "sys_insertDateTime": String // Timestamp
}

Logging data:

{
  "requestId": String,
  "api": String,  // API name that has been reached
  "value": String, // can be null or the value that has been searched
  "sys_insertDateTime": String
}

#### Applications

If you want, you can try to build your own micro-services applications in the language you'd like (Python, Scala, R or node.js).
Due to the previous sections' examples and our experience in project and micro-services, we decided to develop it in node.js. You can find all the folders for building the images and test locally with docker in the ./hints/docker folder.

### Docker

#### Investigations

In the hints/docker folder, you will find a docker-compose yaml file along with directories that contains our Web APIs definitions. Dive into the different folders and files in order to get familiarized with the code (especially ./docker/promotions/databaseHelper.js ; ./docker/promotions/app.js  ;  ./docker/logging/app.js  ; docker-compose.yaml )

    - What are the ports and routes used for our web API ?
    - How are the initial data loaded within our mongodb ?
    - What are the APIs doing ?

#### Local test

You can test the applications on docker.

> cd ./hints/docker

> docker-compose up --build  //it's possible on the first try that the connection to mongo from the APIs failed just re-do the same command.

You have a data.json file with promotion samples that you need to initially load in mongo.
For doing so, connect to your mondo container, load the data and check it has correctly been loaded:

> docker exec -it <my_container_id>  mongo

> use promo;

> db.promoAdobe.insertMany([{your sample data}]);

> db.promoAdobe.find(); --you should see some promotions

You can now try the /getPromotions API
> curl -X POST '0.0.0.0:8080/getPromotions' -H "Content-Type: application/json" -d '{"requestId": "test", "userIds":[15,12,23]}'

## Hands-on

With all the different explanations above and the different sections from this training, create your own K8s set-up.
Discuss your set-up with peers ? what should be improved for a production environment ? Any remarks ?
**Please create a git branch ( /handson/<yourUsername> ) with your work and do intermediary commits** so that we can have a follow-up
