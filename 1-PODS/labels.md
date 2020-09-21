
## Annotations

You can use either labels or annotations to attach metadata to Kubernetes objects.
We'll define labels in the next section.
Labels can be used to select objects and to find collections of objects that satisfy certain conditions.
In contrast, **annotations are not used to identify and select objects**. The **metadata** in an annotation can be small or large, structured or unstructured, and can include characters not permitted by labels.

### Use cases
- Build, release, or image information like timestamps, release IDs, git branch, PR numbers, image hashes, and registry address
- Client library or tool information that can be used for debugging purposes: for example, name, version, and build information

### Commands

```
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    imageregistry: "https://hub.docker.com/"
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```


>kubectl annotate pod nginx-prod name=webapp

Verify the pods that have been annotated correctly
> kubectl describe po nginx-prod | grep -i annotations

Remove the annotations on the pods and verify

> kubectl annotate pod nginx-prod name-


## Labels

### Definition

Labels are **key/value pairs** that are attached to objects.
The main reason for Creating Labels is like an **identifier.**
If we add a label to the pod, then other Kubernetes objects (Ex: Service, DaemonSet, Deployment) can easily
- **determine which pods they're responsible** - defines their scope / know which resources they need to monitor through the watch Mechanism with API server
- communicate with the pod by only mentioning the pod’s label under Selector.

Labels can be attached to objects at creation time and subsequently added and modified at any time
Each object can have a set of key/value labels defined. Each Key must be unique for a given object.

```
kind: Deployment
...
metadata:
  name: nginx
  labels:
    app: nginx
    tier: backend
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
        tier: backend
...
```

Here in the above example we find
- labels specified in the `metadata` section of the deployment
:arrow_right: describes the deployment in itself
- Labels specified in `spec: selector: matchLabels` :arrow_right: tells the resource to match the pod according to that label
- labels defined in the `template` (actually a podTemplate) :arrow_right: label for the pod that the deployment is deploying

### Selectors

#### *Equality based selectors*
Matching objects **must satisfy all** of the specified label constraints, though they may have additional labels as well
This is like an **AND** in sql statement.

#### *Set based selectors*
Set-based label requirements allow filtering keys according to a set of values. Three kinds of operators are supported: in,notin and exists (only the key identifier).
This is like an **OR** in sql statement.

### Node Labels

You can **constrain a Pod to only be able to run on particular Node(s), or to prefer to run on particular nodes**.
There are several ways to do this, and the recommended approaches **all use label selectors to make the selection**.

Generally such constraints are unnecessary, as the scheduler will automatically do a reasonable placement (e.g. spread your pods across nodes, not place the pod on a node with insufficient free resources, etc.) but there are some circumstances where you may want more control on a node where a pod lands, for example to ensure that a pod ends up on a machine with an SSD attached to it, or to co-locate pods from two different services that communicate a lot into the same availability zone.

#### *Add labels to a node*

`kubectl label nodes <node-name> <label-key>=<label-value>`

Show labels:

`kubectl get nodes --show-labels`


#### *NodeSelector*

NodeSelector is the **simplest recommended form of node selection constraint**.
nodeSelector is a **field of PodSpec**.
It specifies a map of key-value pairs.
For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well).

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  nodeSelector:
    disktype: ssd
```

When you then run kubectl apply -f, the **Pod will get scheduled on the node that you attached the label to**.
You can verify that it worked by running kubectl get pods -o wide and looking at the “NODE” that the Pod was assigned to.

### Commands

#### *Add - update labels*
> kubectl label pods foo unhealthy=true
> kubectl label --overwrite pods foo status=unhealthy
> kubectl label pods --all status=unhealthy

#### *Show labels*

> kubectl get pods --show-labels -o wide

`kubectl get pods -o=custom-columns='NAME:metadata.name','LABELS:metadata.labels','DATA:spec.containers[*].image'`


### Filter on labels

##### *Filter on label value*
> kubectl get pods -l newlab=newval,app=hello-world-app -o wide --show-labels
> kubectl get pods -l 'app in (hello-world-app, goodby-world-app)' -o wide --show-labels

##### *Filter on label existence*

Imagine you have six running pods, like the following situation:

```
NAME            READY   STATUS    RESTARTS   AGE     IP            NODE       NOMINATED NODE   READINESS GATES   LABELS
nginx-dev1      1/1     Running   0          7m53s   172.17.0.13   minikube   <none>           <none>            env=dev
nginx-dev2      1/1     Running   0          7m53s   172.17.0.14   minikube   <none>           <none>            env=dev
nginx-dev3      1/1     Running   0          7m52s   172.17.0.15   minikube   <none>           <none>            env=dev
nginx-nolabel   1/1     Running   0          5m59s   172.17.0.18   minikube   <none>           <none>            toto=tata
nginx-prod1     1/1     Running   0          7m52s   172.17.0.16   minikube   <none>           <none>            env=prod
nginx-prod2     1/1     Running   0          7m52s   172.17.0.17   minikube   <none>           <none>            env=prod
```

If you want to return all pods with **label key** equal to **env** (namely all 5 pods as above, without returning the pod with "toto=tata")

> kubectl get pods -l env --show-labels -o wide

```
NAME          READY   STATUS    RESTARTS   AGE     IP            NODE       NOMINATED NODE   READINESS GATES   LABELS
nginx-dev1    1/1     Running   0          9m37s   172.17.0.13   minikube   <none>           <none>            env=dev
nginx-dev2    1/1     Running   0          9m37s   172.17.0.14   minikube   <none>           <none>            env=dev
nginx-dev3    1/1     Running   0          9m36s   172.17.0.15   minikube   <none>           <none>            env=dev
nginx-prod1   1/1     Running   0          9m36s   172.17.0.16   minikube   <none>           <none>            env=prod
nginx-prod2   1/1     Running   0          9m36s   172.17.0.17   minikube   <none>           <none>            env=prod
```


#### *Remove Labels*

> kubectl label pods --all newlab-

#### *Important remarks*

**label filtering**

> :warning: `kubectl get pods -l <key>=<value>`  is actually a selector (filed selector) and is equivalent to
> `kubectl get pods --selector=env=dev --show-labels -o wide`  while following commands :
> `kubectl get pods -L env=dev --show-labels`which is equivalent to `kubectl get pods --label-columns=env` will not apply any filter on pods

**regex on pods**

Imagine the following pods :


If you want to apply a command to all pods with name prefix "ngin-dev" and a number from 1 to 3 as suffix:

> kubectl label pod nginx-dev{1..3} app=nginx

### ***Illustration 1***
<details>
  <summary>

  Let's start with a basic example:
  </summary>

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
  > Kubectl apply -f first_pod.yaml

  #### show labels

  Either a simple command:

  `kubectl get pods --show-labels`

  ```
  NAME        READY   STATUS    RESTARTS   AGE     LABELS
  first-pod   1/1     Running   0          7m19s   app=hello-world-app,name=first-pod
  ```
  Or a more advanced and custom solution:


  `kubectl get pods -o=custom-columns='NAME:metadata.name','LABELS:metadata.labels','DATA:spec.containers[*].image'`

  ```
  NAME        LABELS                                    DATA
  first-pod   map[app:hello-world-app name:first-pod]   nginx:1.14.2
  ```

  #### Add labels

  `kubectl label pods first-pod newlab=newval`
  k

  `kubectl get pods --show-labels`

  ```
  NAME        READY   STATUS    RESTARTS   AGE   LABELS
  first-pod   1/1     Running   0          15m   app=hello-world-app,name=first-pod,newlab=newval
  ```

  Let's add a second pod with several labels
  > kubectl run --restart=Never second-pod --image=nginx --labels='app=goodby-world-app,name=second-pod,newlab=newval'

  #### Filter on labels

  > kubectl get pods -l newlab=newval -o wide --show-labels
  ```
  NAME         READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES   LABELS
  first-pod    1/1     Running   0          25m   172.17.0.13   minikube   <none>           <none>            app=hello-world-app,name=first-pod,newlab=newval
  second-pod   1/1     Running   0          33s   172.17.0.14   minikube   <none>           <none>            app=goodby-world-app,name=second-pod,newlab=newval
  ```

  Stricter criteria :
  > kubectl get pods -l newlab=newval,app=hello-world-app -o wide --show-labels

  ```
  NAME        READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES   LABELS
  first-pod   1/1     Running   0          27m   172.17.0.13   minikube   <none>           <none>            app=hello-world-app,name=first-pod,newlab=newval
  ```

  OR condition instead of AND:
  >kubectl get pods -l 'app in (hello-world-app, goodby-world-app)' -o wide --show-labels
  ```
  NAME         READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES   LABELS
  first-pod    1/1     Running   0          38m   172.17.0.13   minikube   <none>           <none>            app=hello-world-app,name=first-pod,newlab=newval
  second-pod   1/1     Running   0          14m   172.17.0.14   minikube   <none>           <none>            app=goodby-world-app,name=second-pod,newlab=newval
  ```

  #### Remove Label
  > kubectl label pods --all newlab-

  >kubectl get pods --show-labels

  ```
  NAME         READY   STATUS    RESTARTS   AGE   LABELS
  first-pod    1/1     Running   0          44m   app=hello-world-app,name=first-pod,status=unhealthy
  second-pod   1/1     Running   0          19m   app=goodby-world-app,name=second-pod,status=unhealthy
  ```

</details>

### ***Illustration 2***
<details>
  <summary>

  More complex use case
  </summary>


  - Create 5 nginx pods in which two of them is labeled env=prod and three of them is labeled env=dev

  ```
  kubectl run nginx-dev1 --image=nginx --restart=Never --labels=env=dev
  kubectl run nginx-dev2 --image=nginx --restart=Never --labels=env=dev
  kubectl run nginx-dev3 --image=nginx --restart=Never --labels=env=dev
  kubectl run nginx-prod1 --image=nginx --restart=Never --labels=env=prod
  kubectl run nginx-prod2 --image=nginx --restart=Never --labels=env=prod
  ```


  - Verify all the pods are created with correct labels

  > kubectl get pods --show-labels -o wide

  ```
  NAME          READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES   LABELS
  nginx-dev1    1/1     Running   0          54s   172.17.0.13   minikube   <none>           <none>            env=dev
  nginx-dev2    1/1     Running   0          54s   172.17.0.14   minikube   <none>           <none>            env=dev
  nginx-dev3    1/1     Running   0          53s   172.17.0.15   minikube   <none>           <none>            env=dev
  nginx-prod1   1/1     Running   0          53s   172.17.0.16   minikube   <none>           <none>            env=prod
  nginx-prod2   1/1     Running   0          53s   172.17.0.17   minikube   <none>           <none>            env=prod
  ```

  - add a pod with a different label key

  > kubectl run --restart=Never nginx-nolabel --image=nginx --labels=toto=tata

  > kubectl get pods --show-labels -o wide

  ```
  NAME            READY   STATUS    RESTARTS   AGE    IP            NODE       NOMINATED NODE   READINESS GATES   LABELS
  nginx-dev1      1/1     Running   0          2m     172.17.0.13   minikube   <none>           <none>            env=dev
  nginx-dev2      1/1     Running   0          2m     172.17.0.14   minikube   <none>           <none>            env=dev
  nginx-dev3      1/1     Running   0          119s   172.17.0.15   minikube   <none>           <none>            env=dev
  nginx-nolabel   1/1     Running   0          6s     172.17.0.18   minikube   <none>           <none>            toto=tata
  nginx-prod1     1/1     Running   0          119s   172.17.0.16   minikube   <none>           <none>            env=prod
  nginx-prod2     1/1     Running   0          119s   172.17.0.17   minikube   <none>           <none>            env=prod
  ```

  - overwrite label of one to make it 'env=uat'

  > kubectl label pod nginx-dev3 env=uat --overwrite

  > ubectl get pods --selector=env --show-labels -o wide

  ```
  NAME          READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES   LABELS
  nginx-dev1    1/1     Running   0          17m   172.17.0.13   minikube   <none>           <none>            env=dev
  nginx-dev2    1/1     Running   0          17m   172.17.0.14   minikube   <none>           <none>            env=dev
  nginx-dev3    1/1     Running   0          17m   172.17.0.15   minikube   <none>           <none>            env=uat
  nginx-prod1   1/1     Running   0          17m   172.17.0.16   minikube   <none>           <none>            env=prod
  nginx-prod2   1/1     Running   0          17m   172.17.0.17   minikube   <none>           <none>            env=prod
  ```



  - Remove the labels for the pods that we created now and verify all the labels are removed

  > kubectl label pods --all env-

  > kubectl get pods --show-labels -o wide

  ```
  NAME            READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES   LABELS
  nginx-dev1      1/1     Running   0          29m   172.17.0.13   minikube   <none>           <none>            <none>
  nginx-dev2      1/1     Running   0          29m   172.17.0.14   minikube   <none>           <none>            <none>
  nginx-dev3      1/1     Running   0          29m   172.17.0.15   minikube   <none>           <none>            <none>
  nginx-nolabel   1/1     Running   0          27m   172.17.0.18   minikube   <none>           <none>            toto=tata
  nginx-prod1     1/1     Running   0          29m   172.17.0.16   minikube   <none>           <none>            <none>
  nginx-prod2     1/1     Running   0          29m   172.17.0.17   minikube   <none>           <none>            <none>
  ```
  > kubectl label pods --all toto-


  - Let’s add the label app=nginx for all the pods and verify
  > kubectl label pod nginx-dev{1..3} app=nginx
  > kubectl label pod nginx-prod{1..2} app=nginx



  - Label the node (minikube if you are using) nodeName=nginxnode

  > kubectl label node minikube nodeName=nginxnode

  > kubectl get nodes --show-labels

  ```
  NAME       STATUS   ROLES    AGE   VERSION   LABELS
  minikube   Ready    master   49d   v1.17.0   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=minikube,kubernetes.io/os=linux,node-role.kubernetes.io/master=,nodeName=nginxnode
  kubectl label node minikube nodeName=nginxnode
  ```


  - Create a Pod that will be deployed on this node with the label nodeName=nginxnode

  ```
  apiVersion: v1
  kind: Pod
  metadata:
    creationTimestamp: null
    labels:
      run: nginx-nodesel
    name: nginx-nodesel
  spec:
    containers:
    - image: nginx
      name: nginx-nodesel
      resources: {}
    dnsPolicy: ClusterFirst
    restartPolicy: Never
    nodeSelector:
      nodeName: nginxnode
  status: {}

  ```

  > kubectl describe pod nginx-nodesel | grep -i node-sel


  - Annotate the pods with name=webapp
  > kubectl annotate pod nginx-dev{1..3} name=webapp
  > kubectl annotate pod nginx-prod{1..2} name=webapp

  > kubectl describe po nginx-dev{1..3} | grep -i annotations
  ```
  Annotations:  name: webapp
  Annotations:  name: webapp
  Annotations:  name: webapp
  ```

</details>
