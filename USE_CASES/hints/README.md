# Hints



## Docker

#### Investigations

In the Docker folder, you will find a docker-compose yaml file along with directories that contains our Web APIs definitions. Dive into the different folders and files in order to get familiarized with the code (especially ./docker/promotions/databaseHelper.js ; ./docker/promotions/app.js  ; docker-compose.yaml )

    - What are the ports and routes used for our web API ?
    - How are the initial data loaded within our mongodb ?
    - What are the APIs doing ?

#### local testing

Test locally the web API : 

> docker-compose up --build

> curl -X POST '0.0.0.0:8080/getPromotions' -H "Content-Type: application/json" -d '{"requestId": "test", "userIds":[15,12,23]}'

### PREREQUISITIES

As the aim is not to develop web services but understand the logic of Kubernetes, we will provide you all of the node.js files. Please refer to the [Docker / Node.js reminder](docker-image/reminder.md) for more information.

We advice having follow all the previous parts and deeply understand the concepts and illustrations given. This part **will not contain a solution template** like we did for the other parts. The aim is to **let you search, exchange with your colleagues, contact us and go back into the different parts highlighted in this core training**.

( Pierre.Henri.Golard@businessdecision.be and Guillaume.Assogba@businessdecision.be )

### Objectives

#### Business requirements

  - Query all the promotions available for a list of clients provided by adobe campaign  => /GetPromotions
  - Add/Remove a promotion for a list of clients provided by adobe campaign   => /SetPromotions

#### Technical needs

  - Ensure high-availability of our applications
  - Give access to the microservices from outside our K8s Cluster
  - A mongoDB database for storing the results with a persistentVolume in '/data/crf'
  - One application with the two microservices /GetPromotions and /SetPromotions
  - A second application for storing logging that will be called from the first application to store details about the request (time, requestName, operation)
