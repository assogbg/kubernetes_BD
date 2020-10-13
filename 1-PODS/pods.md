# Pods

## Contents
* [Description](#Description)
  * [Yaml details](#yaml-details)
* [Lifecycle](#lifecycle)
  * [Pods states](#pods-state)
  * [Containers states](#container-states)
  * [Hands on session on Pod vs Containers Lifecycle](#hands-on-session-on-pod-vs-containers-lifecycle)
* [Resources CPU Memory](#Resources-CPU-Memory)
  * [Memory Request vs Limits](#Memory-Request-vs-Limits)
  * [Resource quota - namespace level](#Resource-quota---namespace-level)
  * [LimitRange - namespace level](#LimitRange---namespace level)
* [Pods Commands](#Pods-commands)
* [Specific pods](#Specific-pods)
  * [Multicontainers Pod](#Multicontainers-Pod)
  * [Temporary pods](#Temporary-pods)
* [HANDS_ON](#HANDS_ON)

## Description
A Pod is the smallest and simplest Kubernetes object.

Kubernetes objects are entities provided by Kubernetes for
- deploying
- maintaining
- and scaling
applications either on cloud or on-premise infrastructure.

A Pod is the unit of deployment in Kubernetes, which represents a **single instance of the application**.

A Pod is a **logical collection** of one or more **containers** that encapsulates
- storage resources :arrow_right: Containers in a pod share the same storage
- unique network identity :arrow_right: Containers in a pod share the same network - **one IP address per Pod**
- options that govern how the container(s) should run. :arrow_right: Commands, Restart Policies,...



Pods are **transient** :arrow_right: **designed to be ephemeral in nature**  (can be destroyed at any time)

Containers in a pod share the same network, storage, same lifecycle

What this means is that containers inside the same Pod
- can communicate with each other directly
- and will both be stopped and started at the same time.


#### ***Yaml details***

```
apiVersion: v1
kind: Pod
metadata:
 name: first-pod
 labels:
  name: first-pod
  app: hello-world-app
spec:
 containers:
 - image: nginx:1.14.2
   name: first-pod
   ports:
   - containerPort: 80
```

> kubectl create -f first_pod.Yaml

Let’s break down and try to understand the pod definition we just created.

- **apiVersion** : version of Kubernetes - several objects are introduced with each version. Most common: v1, apps/v1, extensions/v1beta1 (like a route an object endpoint)
- **Kind**: This is the type of Kubernetes object
- **Metadata**: brief description of the object like:
  - `name` you want to give the object (pod in our case)
  - `labels` - as many labels as you want
  -  `annotation`
- **Spec**: section where you **define the desired state** of the **(sub/child) object** your (current/parent) object is **responsible for** . In the case of a pod, it’s where you describe the **state of your container**.

  - **Containers** :for each container running in your pod
      - `Image` of the application you want to run in your pods.
      - `Name` of the container that you’ll run in your pod.
      - Ports: `containerPort` is the port your application in your container is listening to.
      - *`commands`* the container is supposed to execute
      - *`resources* memory, cpu...
  - **restartPolicy**: defined for all containers

> :warning: In Kubernetes, when you define an object (usually a workload resource controller), there are two main sections in the yaml file :
> - First You describe the main object (Dep, RS, Pod..)
> - Then you give specifications  - spec section - of the resource/child object it is responsible for


## Lifecycle

#### ***Pods states***

A pod passes through several phases in its lifetime. These phases are unknown, pending, running, succeeded, and failed.

If the pod is in the unknown state, it means the pod’s status could not be obtained.


  - **Pending**: Pod has been validated by the API-server, but one or more of the Container images has not been created.
  > includes time before being scheduled, time spent downloading images over the network ...

  -  **Running**: Pod has been bound to a node, and all Containers have been created.
  >At least one Container is still running, or is in the process of starting or restarting..

  -  **Succeeded**: All Containers in the Pod have terminated in success, and will not be restarted.
  -  **Failed**: All Containers in the Pod have terminated, at least one Container has terminated in failure.
  > That is, the Container either exited with non-zero status or was terminated by the system.

To check the state of a pod, use:

> kubectl describe pod <pod name>

#### ***Container states***

Once **Pod** is **assigned to a node** by **scheduler**, **kubelet starts creating containers** using container runtime.

To check state of container, you can use `kubectl describe pod [POD_NAME]`
For each container within that Pod following info is displayed:
- Container `State` : [Waiting, Running, Terminated]
- `Exit Code`: [0,1]
- `Reason`: [Error, Running, CrashLoopBackOff, Completed]



- **Waiting**: Default state of container**. A container in Waiting state still runs its required operations, like pulling images, applying Secrets, etc.
- **Running**: Indicates that the container is executing without issues.
- **Terminated**: Indicates that the container completed its execution and has stopped running.
> A container enters into this
> - when it has successfully completed execution
> - when it has failed for some reason.

**Containers Restart Policy**

Specification you define for all the containers encapsulated in your Pod.

Those restart Policies can be :
- Never
- Always
- OnFailure

#### Hands on session on Pod vs Containers Lifecycle

Especially with these container restart policies, it is possible to have misalignment between
- Pod Status & Lifecycle
- Underlying containers Status & Lifecycle

By default, a Pod might have a longer lifetime than its underlying containers, while the opposite is not possible.

<details>
    <summary>
    Click to access detailed hands on session on pod vs container lifecycle
    </summary>


    Let's use some examples
    #### Simple Pod — Sleep 6 Seconds - restartPolicy Never

    ```
    apiVersion: v1
    kind: Pod
    metadata:
      name: myapp-pod
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp-container
        image: busybox
        command: ['sh', '-c', 'echo The Pod is running && sleep 5']
      restartPolicy: Never
    ```

    `kubectl create -f podlifecycle1.yaml`

    We repeat the folowing command a few  times to see the evolution of the pod.

    `kubectl get pods -l app=myapp`

    ```
    NAME        READY   STATUS              RESTARTS   AGE
    myapp-pod   0/1     ContainerCreating   0          3s

    NAME        READY   STATUS              RESTARTS   AGE
    myapp-pod   0/1     ContainerCreating   0          4s

    NAME        READY   STATUS    RESTARTS   AGE
    myapp-pod   1/1     Running   0          4s

    NAME        READY   STATUS    RESTARTS   AGE
    myapp-pod   1/1     Running   0          5s

    NAME        READY   STATUS    RESTARTS   AGE
    myapp-pod   1/1     Running   0          6s

    NAME        READY   STATUS    RESTARTS   AGE
    myapp-pod   1/1     Running   0          7s

    NAME        READY   STATUS    RESTARTS   AGE
    myapp-pod   1/1     Running   0          7s

    NAME        READY   STATUS    RESTARTS   AGE
    myapp-pod   1/1     Running   0          9s

    NAME        READY   STATUS      RESTARTS   AGE
    myapp-pod   0/1     Completed   0          10s
    ```

    Finally, we type this command :

    `kubectl describe pod myapp-pod`


    We see that
    - our pods final status is *Succeeded*
    - container
      - final state is *Terminated*
      - Reason *completed*
      - Exit code *0*



    ```
    Name:         myapp-pod
    Namespace:    default
    Priority:     0
    Node:         minikube/192.168.64.7
    Start Time:   Fri, 08 May 2020 03:03:28 +0200
    Labels:       app=myapp
    Annotations:  <none>
    Status:       Succeeded
    IP:           172.17.0.13
    IPs:
      IP:  172.17.0.13
    Containers:
      myapp-container:
        Container ID:  docker://ca22c146c3b55465faf7d5c179a53d69b7c266a1378e6c5b3121fb68fcdcfc82
        Image:         busybox
        Image ID:      docker-pullable://busybox@sha256:a8cf7ff6367c2afa2a90acd081b484cbded349a7076e7bdf37a05279f276bc12
        Port:          <none>
        Host Port:     <none>
        Command:
          sh
          -c
          echo The Pod is running && sleep 5
        State:          Terminated
          Reason:       Completed
          Exit Code:    0
          Started:      Fri, 08 May 2020 03:03:31 +0200
          Finished:     Fri, 08 May 2020 03:03:36 +0200
        Ready:          False
        Restart Count:  0
        Environment:    <none>
        Mounts:
          /var/run/secrets/kubernetes.io/serviceaccount from default-token-wcx7z (ro)
    Conditions:
      Type              Status
      Initialized       True
      Ready             False
      ContainersReady   False
      PodScheduled      True
    ```

    #### Simple Pod — Exit with error - restartPolicy Never
    ```
    apiVersion: v1
    kind: Pod
    metadata:
      name: myapp-pod
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp-container
        image: busybox
        imagePullPolicy: IfNotPresent
        command: ['sh', '-c', 'echo The Pod is running && exit 1']
      restartPolicy: Never
    ```

    `kubectl create -f podlifecycle2.yaml`

    We repeat the folowing command a few  times to see the evolution of the pod.

    `kubectl get pods -l app=myapp`

    But this time we immediately end up with an error.

    ```
    NAME        READY   STATUS   RESTARTS   AGE
    myapp-pod   0/1     Error    0          5s
    ```

    `kubectl describe pod myapp-pod`


    We see that
    - our pods final status is *Failed*
    - container
      - final state is *Terminated*
      - Reason *Error*
      - Exit code *1*

    ```
    Name:         myapp-pod
    Namespace:    default
    Priority:     0
    Node:         minikube/192.168.64.7
    Start Time:   Fri, 08 May 2020 03:16:24 +0200
    Labels:       app=myapp
    Annotations:  <none>
    Status:       Failed
    IP:           172.17.0.13
    IPs:
      IP:  172.17.0.13
    Containers:
      myapp-container:
        Container ID:  docker://ff5485940610815f605d0a6387cdc869bcf0ba78f5d903bcda2ac2609863d9a9
        Image:         busybox
        Image ID:      docker-pullable://busybox@sha256:a8cf7ff6367c2afa2a90acd081b484cbded349a7076e7bdf37a05279f276bc12
        Port:          <none>
        Host Port:     <none>
        Command:
          sh
          -c
          echo The Pod is running && exit 1
        State:          Terminated
          Reason:       Error
          Exit Code:    1
          Started:      Fri, 08 May 2020 03:16:25 +0200
          Finished:     Fri, 08 May 2020 03:16:25 +0200
        Ready:          False
        Restart Count:  0
        Environment:    <none>
        Mounts:
          /var/run/secrets/kubernetes.io/serviceaccount from default-token-wcx7z (ro)
    Conditions:
      Type              Status
      Initialized       True
      Ready             False
      ContainersReady   False
      PodScheduled      True
    ```

    #### Simple Pod — Exit with error - restartPolicy Always
    ```
    apiVersion: v1
    kind: Pod
    metadata:
      name: myapp-pod
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp-container
        image: busybox
        imagePullPolicy: IfNotPresent
        command: ['sh', '-c', 'echo The Pod is running && exit 1']
      restartPolicy: Always
    ```

    `kubectl create -f podlifecycle3.yaml`

    We repeat the folowing command a few  times to see the evolution of the pod.

    `kubectl get pods -l app=myapp`

    We immediately end up with an error.
    However we see that the pod keeps on trying to create/restart the container.
    ```
    NAME        READY   STATUS   RESTARTS   AGE
    myapp-pod   0/1     Error    1          3s

    NAME        READY   STATUS             RESTARTS   AGE
    myapp-pod   0/1     CrashLoopBackOff   1          4s

    NAME        READY   STATUS             RESTARTS   AGE
    myapp-pod   0/1     CrashLoopBackOff   1          10s

    NAME        READY   STATUS             RESTARTS   AGE
    myapp-pod   0/1     CrashLoopBackOff   3          77s

    NAME        READY   STATUS   RESTARTS   AGE
    myapp-pod   0/1     Error    4          101s


    NAME        READY   STATUS             RESTARTS   AGE
    myapp-pod   0/1     CrashLoopBackOff   4          105s
    ```

    - restartPolicy: Always repeatedly restarts crashing container ( exit code 1 )
    - RESTARTS field grows larger over time.
    There is a CrashLoopBackOff and Error status based on the exact point in time we checked the status.



    `kubectl describe pod myapp-pod`


    We see that the states of pods and containers are not constant in time:
    - our pods status stays *Running*
    - container
      - state is *Terminated*
      - Reason *Error*
      - Exit code *1*

    ```
    Name:         myapp-pod
    Namespace:    default
    Priority:     0
    Node:         minikube/192.168.64.7
    Start Time:   Fri, 08 May 2020 03:27:01 +0200
    Labels:       app=myapp
    Annotations:  <none>
    Status:       Running
    IP:           172.17.0.13
    IPs:
      IP:  172.17.0.13
    Containers:
      myapp-container:
        Container ID:  docker://9feaeb4e4b72780f27f5938f51e829a4c2b1485ceffc33d0a3e0b9b73ceaa21a
        Image:         busybox
        Image ID:      docker-pullable://busybox@sha256:a8cf7ff6367c2afa2a90acd081b484cbded349a7076e7bdf37a05279f276bc12
        Port:          <none>
        Host Port:     <none>
        Command:
          sh
          -c
          echo The Pod is running && exit 1
        State:          Terminated
          Reason:       Error
          Exit Code:    1
          Started:      Fri, 08 May 2020 03:27:20 +0200
          Finished:     Fri, 08 May 2020 03:27:19 +0200
        Last State:     Terminated
          Reason:       Error
          Exit Code:    1
          Started:      Fri, 08 May 2020 03:27:03 +0200
          Finished:     Fri, 08 May 2020 03:27:03 +0200
        Ready:          False
        Restart Count:  2
        Environment:    <none>
        Mounts:
          /var/run/secrets/kubernetes.io/serviceaccount from default-token-wcx7z (ro)
    Conditions:
      Type              Status
      Initialized       True
      Ready             False
      ContainersReady   False
      PodScheduled      True
    ```

    if we re-execute the command again, we end up with different results:
    - our pods status stays *Running*
    - container
      - state is *Waiting*
      - Reason *CrashLoopBackOff*
      - Exit code *1*


    ```
    Name:         myapp-pod
    Namespace:    default
    Priority:     0
    Node:         minikube/192.168.64.7
    Start Time:   Fri, 08 May 2020 03:27:01 +0200
    Labels:       app=myapp
    Annotations:  <none>
    Status:       Running
    IP:           172.17.0.13
    IPs:
      IP:  172.17.0.13
    Containers:
      myapp-container:
        Container ID:  docker://76fe1d8fea289f8993fc1b4efba4eb2f3cf9cf5a1bd4531146f12a3f58c994ae
        Image:         busybox
        Image ID:      docker-pullable://busybox@sha256:a8cf7ff6367c2afa2a90acd081b484cbded349a7076e7bdf37a05279f276bc12
        Port:          <none>
        Host Port:     <none>
        Command:
          sh
          -c
          echo The Pod is running && exit 1
        State:          Waiting
          Reason:       CrashLoopBackOff
        Last State:     Terminated
          Reason:       Error
          Exit Code:    1
          Started:      Fri, 08 May 2020 03:37:50 +0200
          Finished:     Fri, 08 May 2020 03:37:50 +0200
        Ready:          False
        Restart Count:  7
        Environment:    <none>
        Mounts:
          /var/run/secrets/kubernetes.io/serviceaccount from default-token-wcx7z (ro)
    Conditions:
      Type              Status
      Initialized       True
      Ready             False
      ContainersReady   False
      PodScheduled      True
    ```

    As you can see, the pods is not restarted - we keep using the same pod.
    On the other way round, we see that container is restarted so Pod vs Container lifetime is different in that case.

    #### Simple Pod — Exit with NO error - restartPolicy OnFailure

    ```
    apiVersion: v1
    kind: Pod
    metadata:
      name: myapp-pod
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp-container
        image: busybox
        imagePullPolicy: IfNotPresent
        command: ['sh', '-c', 'echo The Pod is running && sleep 4']
      restartPolicy: OnFailure
    ```

    `kubectl create -f podlifecycle3.yaml`

    We repeat the folowing command a few  times to see the evolution of the pod.

    `kubectl get pods -l app=myapp`

    ```
    NAME        READY   STATUS              RESTARTS   AGE
    myapp-pod   0/1     ContainerCreating   0          1s

    NAME        READY   STATUS    RESTARTS   AGE
    myapp-pod   1/1     Running   0          3s

    NAME        READY   STATUS    RESTARTS   AGE
    myapp-pod   1/1     Running   0          4s

    NAME        READY   STATUS    RESTARTS   AGE
    myapp-pod   1/1     Running   0          6s

    NAME        READY   STATUS      RESTARTS   AGE
    myapp-pod   0/1     Completed   0          7s

    NAME        READY   STATUS      RESTARTS   AGE
    myapp-pod   0/1     Completed   0          11s
    ```

    Pod runs for a second, **exits successfully** and **stays in Completed state permanently**.
    restartPolicy: **OnFailure** is **better** to use than restartPolicy: **Always** in most cases.

</details>


## Resources CPU Memory

Memory Limit and request can be done
- by containers
- by default (can be overriden)
Resource quotas can be done at a namespace level. if so
- all containers must have memory limits explicitly stated (or at least default policy)
- total memory and cpu cannot exceed resource quota at namespace level



#### *Memory Request vs Limits*

```
apiVersion: v1
kind: Pod
metadata:
  name: memory-demo
  namespace: mem-example
spec:
  containers:
  - name: memory-demo-ctr
    image: polinux/stress
    resources:
      limits:
        memory: "200Mi"
      requests:
        memory: "100Mi"
    command: ["stress"]
    args: ["--vm", "1", "--vm-bytes", "150M", "--vm-hang", "1"]
```

The *args*  section in the configuration file provides arguments for the Container when it starts. The "--vm-bytes", "150M" arguments tell the Container to attempt to allocate 150 MiB of memory.


A **Container can exceed** its **memory request if the Node has memory available**.
But a Container is **not allowed to use more than its memory limit**.

If a Container allocates **more memory than its limit** :arrow_right: becomes a candidate for **termination**.
If the Container continues to consume memory beyond its limit, the Container is terminated. If a terminated Container can be restarted, the kubelet restarts it, as with any other type of runtime failure.

#### Resource quota - namespace level

```
apiVersion: v1
kind: ResourceQuota
metadata:
  name: mem-cpu-demo
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
```

The ResourceQuota places these requirements on the quota-mem-cpu-example namespace:

- Every Container must have a memory request, memory limit, cpu request, and cpu limit.
- The memory request total for all Containers must not exceed 1 GiB.
- The memory limit total for all Containers must not exceed 2 GiB.
- The CPU request total for all Containers must not exceed 1 cpu.
- The CPU limit total for all Containers must not exceed 2 cpu.

#### *LimitRange - namespace level*

```
apiVersion: v1
kind: LimitRange
metadata:
  name: mem-min-max-demo-lr
spec:
  limits:
  - max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```

Now whenever a Container is created in the constraints-mem-example namespace, Kubernetes performs these steps:

- If the Container does not specify its own memory request and limit, assign the default memory request and limit to the Container.

- Verify that the Container has a memory request that is greater than or equal to 500 MiB.

- Verify that the Container has a memory limit that is less than or equal to 1 GiB.

## Pods commands

#### *Advanced description*

 `kubectl get pods -o=custom-columns='NAME:metadata.name','LABELS:metadata.labels','CONT_IMG:spec.containers[*].image','POD_STATUS:status.phase','CONT_STATUSES:status.containerStatuses[*].state'`


```
NAME            LABELS                   CONT_IMG   POD_STATUS   CONT_STATUSES
nginx-dev1      map[app:nginx]           nginx      Running      map[running:map[startedAt:2020-05-10T20:46:02Z]]
nginx-dev2      map[app:nginx]           nginx      Running      map[running:map[startedAt:2020-05-10T20:46:03Z]]
nginx-dev3      map[app:nginx]           nginx      Running      map[running:map[startedAt:2020-05-10T20:46:06Z]]
nginx-nodesel   map[run:nginx-nodesel]   nginx      Running      map[running:map[startedAt:2020-05-10T21:35:41Z]]
nginx-nolabel   <none>                   nginx      Running      map[running:map[startedAt:2020-05-10T20:47:54Z]]
nginx-prod1     <none>                   nginx      Running      map[running:map[startedAt:2020-05-10T20:46:08Z]]
nginx-prod2     <none>                   nginx      Running      map[running:map[startedAt:2020-05-10T20:46:09Z]]
```

#### *Advanced filtering*
 Check pods that are not running :

 > kubectl get pods --field-selector=status.phase!=Running --all-namespaces

#### *Get events*

> kubectl get events --sort-by=.metadata.creationTimestamp

#### *Commmands to create pods*

>kubectl run --restart=Never mybusypod --image=busybox -- /bin/sh -c "while true; do date >> /tmp/index.html; sleep 1; done"

where the main command of the pod's container is defined by

- command: ["/bin/sh"]
- args: ["-c", "while true; do echo hello; sleep 10;done"]

#### *run command in a pod*

> kubectl exec my-pod -c my-container -- ls /

#### *logs*

Single container pod:
> kubectl logs my-pod

Multi container pod:
> kubectl logs my-pod -c mycontainer



 :warning: If you wanna see logs of a **previous terminated container** within a pod:
> kubectl logs busybox -c busybox2 --previous

## Specific pods

#### Multicontainers Pod
With Microservices, as we aim at decoupling applications components, the regular use case is to have 1 container per pod.

Nevertheless, there are some use cases (Adapter, side-car, ambassador) where a pod is made up of multiple containers (in this case containers are tightly coupled).

In that case, this collection of containers
-	Are scheduled together on the same host with the Pod
-	Share the same network namespace - can communicate through localhost
-	Have access to mount the same external storage (volumes)

#### Temporary pods

`kubectl run pod2 -it -n k8s-challenge-2-b --image=cosmintitei/bash-curl --restart=Never --rm`

> kubectl run my-shell --rm -i --tty --image ubuntu -- bash

You may, of course, use a different image or shell. Some of the arguments explained:

- **my-shell**: This ends up being the name of the Deployment that is created. Your pod name will typically be this plus a unique hash or ID at the end.
- **--rm**: **Delete** any resources we've created **once we detach**. When you exit out of your session, this cleans up the Deployment and Pod.
- **-i/--tty**: The combination of these two are what allows us to attach to an interactive session.
- **--**: **Delimits the end of the kubectl run options from the positional arg (bash)**. Indicate the beginning of the container commands.
- **bash**: Overrides the container's CMD. In this case, we want to launch bash as our container's command.

## HANDS_ON

You can now [create your first Pods](./exercices/pods_exercices.md) and discover some useful Kubernetes commands.
