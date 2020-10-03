# Core Kubernetes Use Case  

Now that most of the basic topics have been covered in the previous session, we believed that the best way of learning a software is by self-implementing a  **real client used cases**. For doing so, we will use a production use-case from Carrefour Belgium.
One of the key business operation made by carrefour is sending products promotions to their clients. Those promotions are funded by the products providers and represent a huge amount of money.It is then crucial for Carrefour to be able to best segmented the clients based on their consumers profile, that they called a pre-analysis ; but also be able to evaluate the success of their promotions, they called it a post-analysis.

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
  - Add/Remove a promotion for a list of clients provided by adobe campaign   => /SetPromotions

#### Technical needs

  - Ensure high-availability of our applications
  - Give access to the microservices from outside our K8s Cluster
  - A mongoDB database for storing the results with a persistentVolume in '/data/crf'
  - One application with the two microservices /GetPromotions and /SetPromotions
  - A second application for storing logging that will be called from the first application to store details about the request (time, requestName, operation)
