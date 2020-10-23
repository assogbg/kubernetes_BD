# Hands-on live illustrations training 1 - core k8s

The goal here is to gather some interactive class metrial.
You'll find a few commands and yaml files to execute while we conduct the sessions.
This will hopefully make it more interactive and concrete to you guys.

## I. Intro docker commands and print screens

The idea here is to show you some commands that might be useful for the training.

1. Login Docker Hub
2. Build Node Custom Base Image & push it to you docker hb repo
3. Build docker images for containers ms-hello and ms-bye, based on custom node.js base image
   * Tag them + push
   * Make some modifications in noide js source code to build/tag/pusdh 3 docker images nof ms-hello and ms-bye
4. try to run locally one of those apps

first of all let's configure nour remote registry and authenticate to access it from docker client:

> docker login

Personnally it points to my bpersonal docker hub.

### Build custom base node.js image

We defined a new container image in (**[Dockerfile](../DOCKER_BASICS/docker-images/2-DEPLOYMENTS/node-app/svc-section/node-utils/Dockerfile)**) node-utils that consists of nodejs base image enrich with some utilities such as telnet, netcat, ping, nslookup...

Here is the content of the Dockerfile, including pulling node base image + installing 9 packages:

```yaml
FROM node:latest
RUN apt-get update && apt-get install -y netcat && \
    apt-get install -y nano && \
    apt-get install -y telnet && \
    apt-get install -y iputils-ping && \
    apt-get install -y curl && \
    apt-get install -y busybox && \
    apt-get install -y lsof && \
    apt-get install -y net-tools && \
    apt-get install -y nmap
CMD [ "node"]
```

We now want to build a new customer image:

```yaml
docker build --tag pgolard/node-utils:v1 - < docker-images/node-utils/Dockerfile
docker push pgolard/node-utils:v1
```

We notice that we end with 10 (1 + 9) layers:

```yaml
Step 1/3 : FROM node:latest
latest: Pulling from library/node
0400ac8f7460: Pull complete
fa8559aa5ebb: Pull complete
da32bfbbc3ba: Pull complete
e1dc6725529d: Pull complete
572866ab72a6: Pull complete
63ee7d0b743d: Pull complete
186392ceaa5e: Pull complete
d5c847b5cd3f: Pull complete
98b00e0a6a07: Pull complete
```

then and uploads it on docker hub

```yaml
docker push pgolard/node-utils:v1
```

### Build images for our 2 dummy Micro services - illustrations

(**[msHello](../DOCKER_BASICS/docker-images/2-DEPLOYMENTS/node-app/svc-section/node-app/msHello)**)
(**[msBye](../DOCKER_BASICS/docker-images/2-DEPLOYMENTS/node-app/svc-section/node-app/msBye)**)

Those 2 micro services consists of dockerizzd simple node.js applications.
We first build and upload them to our docker hub.
We repeat the operation 3 times; for every new build, we make a small modif. in source code and we increment the tag.

```yaml
./docker-images/build.sh 1
./docker-images/build.sh 2
./docker-images/build.sh 3
```

### try to run one of our micro service:

> docker run -it -p 7777:7777 --name ms-hello pgolard/ms-hello:v3

> curl 0.0.0.0:7777 - This is the hello world from ms hello - V3%


## Kubernetes workload resources and controllers

We saw earlier on that containerization achieved isolation and decoupling:
- libs & binaries: container images package all depencies of each microservice
- infrastructure (containers == portability thanks to container engine/docker daemon)
- resource management (memory/cpu...)

Bu there are still key features we still have to demonstrate if we want to deliver the promise of container orchestrators such as k8s:
- sel healing
- scalability/replication
- fault-tolerance
- seamless t-updates/rollout/rollback - without service downtime

In k8s, there are a bucnh of objects that leverage on containers/pods and enable to reach the promise land.
These objects are called workload resources and consist of managing sets of pods to match a desired state we specified.
They come along with CONTROLLERS:
- control loop running on the master node
- WATCH state of the cluster (get notified by API cluster of changes of state of pods they take care of)

We're now gonna illustrate the poperties of 2 controllers: RS & Deploy.

## II. Replicasets

Validate the expected behaviour of The ***replicaset controller***.

It should make sure ***desired state*** (number of replicas) ***matches the current state***.

1. create a first replicaset based on custom docker image "ms-hello" with 1 replica

> kubectl apply -f dep/rs-hello.yaml

2. create a new pod with same label as the one in the pod template spec of the RS

> kubectl --dry-run=true -o yaml run ms-hello-ntm --restart=Never \
> --image=pgolard/ms-hello:v1 --labels="app=ms-hello-pods"

3. See how many pods are running and what happened to our standalone pod?
4. delete the RS
5. re-create the standalone pod with the common label
6. check the ownerReferences of the pod - what do you conclude about ownership?

>  kubectl get po ms-hello-ntm -o yaml | grep  ownerReferences: -A 7

8. recreate the RS - leave nb of replicas to 1

> kubectl apply -f HANDSON_TRAINING/dep/rs-hello.yaml

9. check the ownerReferences of the pod

>  kubectl get po ms-hello-ntm -o yaml | grep  ownerReferences: -A 7

10. Scale up the replicaset to 4 replicas

> kubectl scale --replicas=4 rs ms-hello-rs

11. Simulate crash of one pod and see what happens

> watch kubectl get events

12. scale down to 2 replicas
13. set up autoscale

> kubectl autoscale rs ms-hello-rs --max=6 --min=4 --cpu-percent=50

14. Check pods




## III. Deployments

We validated the expectation we had with RS. The last key feature we're looking for is a workload resource which would provide easy, robust and seamless tool for rollout, rollback.

1. We're gonnna first clean up both pods and rs within our default namespace (please do not delete the minikube service)

> kubectl get all --field-selector metadata.name!=kubernetes -n default
> kubectl delete all --field-selector metadata.name!=kubernetes -n default

2. Create both deployments ms-hello & ms-bye

> kubectl apply -f /Users/pgolard/Documents/INTELLIJ/k8s_training/HANDSON_TRAINING/dep/ms-bye-dep.yaml
> kubectl apply -f /Users/pgolard/Documents/INTELLIJ/k8s_training/HANDSON_TRAINING/dep/ms-hello-dep.yaml

3. Show wide output of Deployments, RS & pods
4. Scale the ms-bye deployment
5. Check impact on RS and Pods
6. Upgrade ms-bye version from v1 to v2

> kubectl set image deployment ms-bye-dep ms-bye=pgolard/ms-bye:v2 --record=true
> kubectl rollout status deployment ms-bye-dep
> kubectl rollout history deployment ms-bye-dep
> kubectl rollout history deployment ms-bye-dep --revision=2

7. Upgrade again ms-bye version from v2 to v3 & watch the mechanism to validate the seamless rollout

> kubectl set image deployment ms-bye-dep ms-bye=pgolard/ms-bye:v3 --record=true
> kubectl rollout status deployment ms-bye-dep
> kubectl rollout history deployment ms-bye-dep
> kubectl rollout history deployment ms-bye-dep --revision=3

8. easy & seamless rollback - rollback on revision 2 (image v2)


> kubectl rollout undo deployment ms-bye-dep --to-revision=2
