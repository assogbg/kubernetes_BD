# Multicontainers Pods
With Microservices, as we aim at decoupling applications components, the regular use case is to have 1 container per pod.

Nevertheless, there are some use cases where a pod is made up of multiple containers (in this case containers are tightly coupled).

A pod is the most basic unit of the Kubernetes cluster. It usually contains one or more running containers. Pods are designed to be ephemeral in nature which means that they can be destroyed at any time. Containers in a pod share the same network, storage, and lifecycle. What this means is that they can communicate with each other directly, and will both be stopped and started at the same time.

In that case, this collection of containers
-	Are **scheduled together** on the **same host with the Pod**
-	Share the **same network namespace** - can communicate through localhost
-	Have access to mount the same external storage (**shared volumes** like PV/PVC, emptyDir with Volume Mounts...)
- can use Inter process communication

The **primary purpose of a multi-container Pod is to support co-located, co-managed**
- **helper processes** (secondary)
- for a **primary application**.
There are some general patterns for using helper processes in Pods.

https://www.mirantis.com/blog/multi-container-pods-and-container-communication-in-kubernetes/

## Concept of adapter design pattern
https://www.weave.works/blog/container-design-patterns-for-kubernetes/

The adapter container pattern generally
- **transforms** the **output** of the **primary container**
- into the output that fits the standards across your applications.

For instance, you might have a car booking application that is requested by different aggregators (kayak, airbnb,booking.com,...)

The main car availability search engine would be common but the response's format would change according to the requester.
You can refactor your application code to split
- main availability search engine (in a container)
- output formatter (in different containers)

As a result, you end up with 2 different pods, each made up of 2 containers:
- Pod 1
  - **main container**: booking engine container image
  - **secondary container** : custom adapter re-formatting output data in such a way it satisfies the requirement of **Airbnb**
- Pod 2
  - **main container**: booking engine container image
  - **secondary container** : custom adapter re-formatting output data in such a way it satisfies the requirement of **Kayak**

> :warning: In Kubernetes,with such situation, you expose ONLY the main container port. You curl the two adpaters using localhost.

<details>
<summary> Detailed use case description of an adapter </summary>

### Custom node.js containers

#### useful docker commands to build and push on docker hub
In the docker-image sub directory, you'll find the definition of those custom images.

> docker login docker.io

> docker build --tag pgolard/test-main-booking:v4 ./testMain/.
> docker push pgolard/test-main-booking:v4
> docker build --tag pgolard/test-adapter-airbnb:v4 ./testAdapterAirbnb/.
> docker push pgolard/test-adapter-airbnb:v4
> docker build --tag pgolard/test-adapter-kayak:v4 ./testAdapterKayak/.
> docker push pgolard/test-adapter-kayak:v4

#### main container description

Consist of a containerized micro service that basically handles a "simplified" car booking service.
This service consists of
- a single route : GET /bookCar/
- this single route identifies an available car
- send through localhost the description of the available car to a secondary application
- the secondary application reformats the result to send back to the requester
- the primary app sends the response to the requester

#### secodary containers description

The secondary containers' role is only to reformat the response, with same route *formatCarInfo*
- kayak
- airbnb  

### Pods definitions

#### airbnb pod

```
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: booking-app-airbnb
  name: booking-app-airbnb
spec:
  containers:
  - image: pgolard/test-main-booking:v4
    name: test-main-booking
    ports:
    - containerPort: 33
  - image: pgolard/test-adapter-airbnb:v4
    name: test-adapter-airbnb
    #ports:
    #- containerPort: 9096  
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

#### kayak pod

```
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: booking-app-kayak
  name: booking-app-kayak
spec:
  containers:
  - image: pgolard/test-main-booking:v4
    name: test-main-booking
    ports:
    - containerPort: 33
  - image: pgolard/test-adapter-kayak:v4
    name: test-adapter-kayak
    #ports:
    #- containerPort: 9096
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

### testing the applications

> kubectl get pods -o wide
```
NAME                 READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
booking-app-airbnb   2/2     Running   0          5s    172.17.0.14   minikube   <none>           <none>
booking-app-kayak    2/2     Running   0          76s   172.17.0.13   minikube   <none>           <none>
```

> minkube ssh

>curl http://172.17.0.13:33/bookCar
{"carid":"1-XXX-333","price":55,"currency":"euro","status":"available","message":"welcome to kayak","payment_method":"visa"}

>curl http://172.17.0.14:33/bookCar
{"carid":"1-XXX-333","status":"available","costs":"10 euros an hour","payment_method":"paypal airbnb"}$

### remark

In prod environment, we would have
- encapsulated the pods into a deployment
- exposed them via services
- plugged an ingress with different backend routes



</details>


## Concept of sidecars

Sidecar containers “help” the main container.
Some examples include
- log or data change watchers,
- monitoring adapters, and so on.

A log watcher, for example, can be built once by a different team and reused across different applications. Another example of a sidecar container is a file or data loader that generates data for the main container.

<details>
<summary>side car exercise 1</summary>
### side car exercise 1: Multi container pod
Create a multicontainer pod with
- a main container nginx with an index.hmtl where /usr/share/nginx/html
- a sidecar application container busybox which writes updates the index html file used by nginx
"while true; do date >> /tmp/index.html; sleep 1; done"

The goal here is to make your busy box container update the index.html of your nginx web server.

1. create a yaml file with a pod made up of one container + executing the command :
> kubectl run --restart=Never --dry-run -o yaml mybusypod --image=busybox -- /bin/sh -c "while true; do date >> /tmp/index.html; sleep 1; done" > pod_sidecar_1.yaml

2. update the pod and create an **Empty Dir** shared **volume**
```
...
spec:
  volumes:
  - name: index-vol
    emptyDir: {}
...
```
3. mount the shared volume to busybox container
```
...
spec:
  containers:
  - name: mybusybox
    image: busybox
    command: ["/bin/sh"]
    args: ["-c", "while true; do date >> /tmp/index.html; sleep 1; done"]
    volumeMounts:
    - name: index-vol
```

4. add the nginx container and mount the shared volume to volumeMounts */usr/share/nginx/html*

```
...
spec:
  containers:
  - name: mynginx
    image: nginx
    volumeMounts:
    - name: index-vol
      mountPath: /usr/share/nginx/html
```

Here us the complete yaml:
```
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: sidecar1
  name: sidecar1
spec:
  volumes:
  - name: index-vol
    emptyDir: {}
  containers:
  - name: mynginx
    image: nginx
    volumeMounts:
    - name: index-vol
      mountPath: /usr/share/nginx/html
  - name: mybusybox
    image: busybox
    command: ["/bin/sh"]
    args: ["-c", "while true; do date >> /tmp/index.html; sleep 1; done"]
    volumeMounts:
    - name: index-vol
      mountPath: /tmp
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}

```

5. exec into your pods :
> kubectl exec sidecar1 -c mybusybox -- ls /tmp
```
index.html
```

> kubectl get pods -o wide
```
NAME       READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
sidecar1   2/2     Running   0          33s   172.17.0.13   minikube   <none>           <none>
```

6. curl your nginx index:
> minikube ssh

> curl 172.17.0.13

```
Mon May 11 00:42:04 UTC 2020
Mon May 11 00:42:05 UTC 2020
Mon May 11 00:42:06 UTC 2020
Mon May 11 00:42:07 UTC 2020
Mon May 11 00:42:08 UTC 2020
Mon May 11 00:42:09 UTC 2020
Mon May 11 00:42:10 UTC 2020
Mon May 11 00:42:11 UTC 2020
Mon May 11 00:42:12 UTC 2020
Mon May 11 00:42:13 UTC 2020
Mon May 11 00:42:14 UTC 2020
Mon May 11 00:42:15 UTC 2020
Mon May 11 00:42:16 UTC 2020
Mon May 11 00:42:17 UTC 2020
Mon May 11 00:42:18 UTC 2020
Mon May 11 00:42:19 UTC 2020
Mon May 11 00:42:20 UTC 2020
Mon May 11 00:42:21 UTC 2020
Mon May 11 00:42:22 UTC 2020
Mon May 11 00:42:23 UTC 2020
Mon May 11 00:42:24 UTC 2020
Mon May 11 00:42:25 UTC 2020
Mon May 11 00:42:26 UTC 2020
Mon May 11 00:42:27 UTC 2020
Mon May 11 00:42:28 UTC 2020
Mon May 11 00:42:29 UTC 2020
Mon May 11 00:42:30 UTC 2020
Mon May 11 00:42:31 UTC 2020
```

### Remarks

This first exercise is not a "clean" sidecar, since the most common usecase for a side car is
https://www.weave.works/blog/container-design-patterns-for-kubernetes/

The sidecar container extends and works with the primary container. This pattern is best used when there is a clear difference between a primary container and any secondary tasks that need to be done for it.

For example, a web server container (a primary application) that needs to have its logs parsed and forwarded to log storage (a secondary task) may use a sidecar container that takes care of the log forwarding. This same sidecar container can also be used in other places in the stack to forward logs for other web servers or even other applications

In this exercise, we do a bit the opposite: the secondary container writes stuff consumed by the main. The problem is that the defulat nginx image creates symlinks for access.log and error.log in such a way they are redirected to STDOUT and STDERR to make it easy to docker engine to get the logs by command

</details>
## Exercise 2 : main application container which writes the current date to a log file every five seconds
https://matthewpalmer.net/kubernetes-app-developer/articles/multi-container-pod-design-patterns.html#sidecar-pattern-example
It defines a main application container which writes
the current date to a log file every five seconds
The sidecar container is nginx serving that log file.
(In practice, your sidecar is likely to be a log collection
container that uploads to external storage.

(Access the log file via the sidecar)
curl 'http://localhost:80/app.txt'

Once the pod is running:

  (Connect to the sidecar pod)
  kubectl exec pod-with-sidecar -c sidecar-container -it bash

  (Install curl on the sidecar)
  apt-get update && apt-get install curl

<details>
<summary>Exercise 3 sidecar </summary>
### Exercise 3 : main application writes two log files and 2 different site cars have to handle one of them
main container is busybox image that does a while true and persist at each step
- "coucou $(date)" >> /var/log/1.log;
- echo "$(date) INFO yoooo" >> /var/log/2.log;
- then sleep 1

Then add 2 busybox sidecars
- sidecar-log-1: 'tail -n+1 -f /var/log/1.log'
- sidecar-log-2: 'tail -n+1 -f /var/log/2.log'


1. create the pods made up of three containers with a shared volume :
```
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: maincont
  name: maincont
spec:
  volumes:
  - name: logvol
    emptyDir: {}
  containers:
  - args:
    - /bin/sh
    - -c
    - while true; do echo "coucou $(date)" >> /var/log/1.log;
      echo "$(date) INFO yoooo" >> /var/log/2.log; sleep 1; done
    image: busybox
    name: maincontainer
    volumeMounts:
    - mountPath: /var/log
      name: logvol
  - args:
    - /bin/sh
    - -c
    - tail -n+1 -f /var/log/1.log
    image: busybox
    volumeMounts:
    - mountPath: /var/log
      name: logvol
    name: sidecar-log-1
  - args:
    - /bin/sh
    - -c
    - tail -n+1 -f /var/log/2.log
    image: busybox
    name: sidecar-log-2
    volumeMounts:
    -  mountPath: /var/log
       name: logvol
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}

```

2. test your pods containers logs

> kubectl logs maincont -c sidecar-log-1
```
coucou Mon May 11 01:12:20 UTC 2020
coucou Mon May 11 01:12:21 UTC 2020
coucou Mon May 11 01:12:22 UTC 2020
coucou Mon May 11 01:12:23 UTC 2020
coucou Mon May 11 01:12:24 UTC 2020
coucou Mon May 11 01:12:25 UTC 2020
coucou Mon May 11 01:12:26 UTC 2020
coucou Mon May 11 01:12:27 UTC 2020
coucou Mon May 11 01:12:28 UTC 2020
coucou Mon May 11 01:12:29 UTC 2020
coucou Mon May 11 01:12:30 UTC 2020
coucou Mon May 11 01:12:31 UTC 2020
coucou Mon May 11 01:12:32 UTC 2020
coucou Mon May 11 01:12:33 UTC 2020
coucou Mon May 11 01:12:34 UTC 2020
coucou Mon May 11 01:12:35 UTC 2020
coucou Mon May 11 01:12:36 UTC 2020
coucou Mon May 11 01:12:37 UTC 2020
coucou Mon May 11 01:12:38 UTC 2020
```

> kubectl logs maincont -c sidecar-log-2

```
Mon May 11 01:12:20 UTC 2020 INFO yoooo
Mon May 11 01:12:21 UTC 2020 INFO yoooo
Mon May 11 01:12:22 UTC 2020 INFO yoooo
Mon May 11 01:12:23 UTC 2020 INFO yoooo
Mon May 11 01:12:24 UTC 2020 INFO yoooo
Mon May 11 01:12:25 UTC 2020 INFO yoooo
Mon May 11 01:12:26 UTC 2020 INFO yoooo
Mon May 11 01:12:27 UTC 2020 INFO yoooo
Mon May 11 01:12:28 UTC 2020 INFO yoooo
Mon May 11 01:12:29 UTC 2020 INFO yoooo
Mon May 11 01:12:30 UTC 2020 INFO yoooo
Mon May 11 01:12:31 UTC 2020 INFO yoooo
Mon May 11 01:12:32 UTC 2020 INFO yoooo
Mon May 11 01:12:33 UTC 2020 INFO yoooo
Mon May 11 01:12:34 UTC 2020 INFO yoooo
Mon May 11 01:12:35 UTC 2020 INFO yoooo
Mon May 11 01:12:36 UTC 2020 INFO yoooo
Mon May 11 01:12:37 UTC 2020 INFO yoooo
Mon May 11 01:12:38 UTC 2020 INFO yoooo
Mon May 11 01:12:39 UTC 2020 INFO yoooo
Mon May 11 01:12:40 UTC 2020 INFO yoooo
Mon May 11 01:12:41 UTC 2020 INFO yoooo
Mon May 11 01:12:42 UTC 2020 INFO yoooo
```


</details>

#still to do


INVESTIGATE kubectl logs busybox -c busybox2 --previous

## side car exercise 2: Multi container pod
https://medium.com/bb-tutorials-and-thoughts/practice-enough-with-these-questions-for-the-ckad-exam-2f42d1228552
Multi-Container Pods (10%)
Practice questions based on these concepts
Understand multi-container pod design patterns (eg: ambassador, adaptor, sidecar)
29. Create a Pod with three busy box containers with commands “ls; sleep 3600;”, “echo Hello World; sleep 3600;” and “echo this is the third container; sleep 3600” respectively and check the status
30. Check the logs of each container that you just created
31. Check the **previous logs** of the second container busybox2 if any
32. Run command ls in the third container busybox3 of the above pod
33. Show metrics of the above pod containers and puts them into the file.log and verify
34. Create a Pod with main container busybox and which executes this “while true; do echo ‘Hi I am from Main container’ >> /var/log/index.html; sleep 5; done” and with sidecar container with nginx image which exposes on port 80. Use emptyDir Volume and mount this volume on path /var/log for busybox and on path /usr/share/nginx/html for nginx container. Verify both containers are running.
35. Exec into both containers and verify that main.txt exist and query the main.txt from sidecar container with curl localhost

## side car exercise 3:
https://kubernetes.io/docs/concepts/cluster-administration/logging/

## side car & adapter exercise 4:
https://www.mirantis.com/blog/multi-container-pods-and-container-communication-in-kubernetes/
