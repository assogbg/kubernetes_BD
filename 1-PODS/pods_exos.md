
# pods

## My first PODs

We first need to generate associated to the POD. There are two options for it:
Either write it based on kubernetes documentation (https://kubernetes.io/docs/concepts/workloads/pods/#pods-and-controllers) or generate it from a kubernetes command and make some changes on it if needed.

> kubectl run --dry-run=client --restart=Never -o yaml my_pod_name --image=my_image_name > myYamlName.yaml

> kubectl create -f myYamlName.yaml



#### create 2 pods
Create two pods with the previous commands:
- image assogbg/pod_first:v1
- image assogbg/pod_second:v1


<details>
    <summary>
    **Hints**
    </summary>

    - > kubectl run --dry-run=client --restart=Never -o yaml firstpod --image=assogbg/pod_first:v1 --port=7777 > first_pod.yaml

    - > kubectl run --dry-run=client --restart=Never -o yaml secondpod --image=assogbg/pod_second:v1 --port=9999 > second_pod.yaml

</details>

#### retrieve their ip adresses
> kubectl get pods -o wide

```
NAME       READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
secondpod  1/1     Running   0          12s   172.17.0.3   minikube   <none>           <none>
firstpod   1/1     Running   0          22s   172.17.0.2   minikube   <none>           <none>
```

#### try to curl them from the pod Container
> kubectl exec -it firstpod -- /bin/bash

> curl -X GET "localhost:7777/world"

> kubectl exec -it secondpod -- /bin/bash

> curl -X GET "localhost:9999/hello"


#### try to curl them from your local machine
> curl -X GET http:/172.17.0.3:9999/hello

> curl -X GET http:/172.17.0.2:7777/world

It doesn't work - their ip is only accessible from within the cluster
So connect on minikube
> minikube ssh

> curl -X GET http:/172.17.0.3:9999/hello

> curl -X GET http:/172.17.0.2:7777/world

And this works fine.

#### try to curl them from your local machine using the minikube ip
> minikube ip

> curl -X GET http:/minikubeIP:9999/hello

> curl -X GET http:/minikubeIP:7777/world

It doesn't work.


## Lifecycle

### 1- Lifecycle steps

In this first example, we will highlight the status' evolution of the POD while creating a container.

#### Pod creation
Create a simple Pod with a busybox image that will not restart and that run that command: "echo The Pod is running && sleep 5"

<details>
    <summary>
    **Hints**
    </summary>


    ```
    ...
    spec:
      containers:
      - name: myapp-container
        image: busybox
        command: ['sh', '-c', 'echo The Pod is running && sleep 5']
      restartPolicy: Never
    ```

      > kubectl create mypod.yaml


</details>

#### Pod status

Once your pod has been created, you need to get the status of the pod. Show that your Pod has several status while being created.

<details>
    <summary>
    **Hints**
    </summary>

    - execute several times
    > kubectl get pods `

    - Check the description
    > kubectl describe pods

</details>

Now redo the same steps but with the bash command 'echo The Pod is running && exit 1'. Any differences while checking the status of your pod ?

## Additionnal exercice

- launch a pod using the container image ***quay.io/openshiftlabs/simpleservice:0.5.0*** and exposing a HTTP API on port 9876

- Verify that your Pod is ***Running***

- execute the following command from inside your container and inside your minikube cluster. Find the correct host to use depending on where you curl: ***curl -s <host?>:9876/info***

- Add cpu/memory (here: 64MB of RAM and 0.5 CPUs) requests and Limits for your pod.
Here some documentations : https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/ & https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/


## NEXT SESSION

you've completed the exercises, move on to the [deployments](../2-DEPLOYMENTS/deployments.md)
