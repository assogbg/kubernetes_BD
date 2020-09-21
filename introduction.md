#  Introduction: Success story of kubernetes

Kubernetes success arouse in the context of a change of paradigm in the IT industry.

Last decade has seen a skyrocketing expansion of the Cloud (IAAS, SAAS).
Companies desire to get rid of legacies applications and expansive outdated hardware has kept building up.

However, this desire has not always been fulfilled since migrating legacy monolith software turned out to be harder than expected.

#### Monolithic applications

Up to Recently, the traditional architecture and software patterns of entreprise applications was (what call today) "monolithic".
Although back in the days it used to be a performant approach, as the time went by, their software became a huge and complex boulder, resulting in lots of issues :

-	sedimented layers of features and redundant logic translated into thousands of lines of code
- every new feature added more complexity and code was building up continuously
- application tightly coupled with its complex and expensive hardware:
  - hardcoded connections and operations
  -	Running as a single process and on a single server which has to satisfy its compute, memory, storage, and networking requirements
-	maintenance windows have to be planned as disruptions in service are expected to impact clients
-	hard for developers to work in parallel since each components is tightly coupled with the rest of the applications


#### Microservices

This is a bit of an egg-chicken problem to identify whether
- the monolith software architecture caused the rise of microservices which drove the success of the cloud
- or the appetite for the cloud forced companies to adopt microservices

But anyway, to overcome the weaknesses of the monolith design pattern, a new paradigm arose in 2000's: Microservices.
Its success over the last decade went skyrocketing.

Basically, the idea is to break down the monolith into smaller independent blocks, "services" :

- 	**Single purpose** : each service should focus on one single purpose and do it well.
- 	**Loose coupling** : services know little about each other. A change to one service should not require changing the others. Communication between services should happen only through public service interfaces.
- 	**High cohesion** : each service encapsulates all related behaviors and data together. If we need to build a new feature, all the changes should be localized to just one single service.

A major benefit of microservices is the **decoupling of development and deployment**.
In a true microservices architecture, a team can make changes (within reason) to the service they own without having to communicate those changes to other upstream or downstream teams responsible for other services.

#### Containerized Microservices

Virtualisation** and **containerisation** played a major role in this revolution.

Containerized Microservices are **lightweight** applications written in **various** modern **programming languages**, with specific dependencies, libraries and environmental requirements.

To ensure that an application has everything it needs to run successfully it is packaged together with its dependencies.
Containers encapsulate microservices and their dependencies but do not run them directly.
Containers run container images
Container image: bundles the application along with its runtime and dependencies, and a container is deployed from the container image offering an **isolated executable environment** for the application.

In addition to all these advantages, containerized MS offer **Decoupling**
- **with other services**
- **with hardware/system**:
  - as long as a container runtime is installed, you can run your container image on any host os
  - containerized MS developped on local machine can be deployed on dev/prod servers without any modification


#### Container Orchestrators

Although we can manually maintain a couple of containers or write scripts for dozens of containers, orchestrators make things much easier for operators especially when it comes to managing hundreds and thousands of containers running on a global infrastructure.


Container orchestrators are tools which
- brings together individual machines into a **cluster** using a **shared network to communicate between each server**
- where **containers' deployment** and **management** is **automated at scale**
- offer **fault-tolerance**
- on-demand **scalability**

#### Kubernetes Success Factor

MS paradigm and the success of container orchestrator is inextricably linked to the growing appetite for Cloud Computing.
Companies massive adoption of cloud computing is driven by these characteristics:
- scalability
- isolation
- flexibility
- resilience
- reduced complexity (less hardware, storage, networking issues)

k8s includes all these expected features of a Container Orchestrator, and is particularly powerful dealing with:

- **seamless rollout and rollbacks**
- scalabity (auto-scalability): scaling manually or automatically based on CPU or custom metrics utilization
- **self-healing** : automatically replaces and reschedules containers from failed nodes
- **service discovery and load balancing**

In addition to that, k8s is the current market leader also for the following reasons:

- k8s is open source and has a massive and very active community
- k8s can work with different container runtime (even though most of set ups are based on Docker Engine)
- k8s cluster federation (ability to group machines) is better than its competitor
  - it can be deployed on premises
  - can be deployed on IAAS on any cloud provider
