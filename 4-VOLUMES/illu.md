# Volumes

## <a name="emptyDir"></a>1- EmptyDir

In this first demo, we will create an Empty Dir mounted to a pod. One of the objective is to observe that when the container within the Pod is recreated, he can still access to the data.

#### 1- Pod creation

Create a pod from the image *busybox* that will cd to a directory */toto*, do a *ls* of that directory and finally create a file *titi*. Add a sleep of 15 seconds in order to access the container and check the directory toto

pod_0.yaml
```
apiVersion: v1
kind: Pod
metadata:
  name: empty-dir-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'cd /toto && echo cd done && ls /toto && echo "how many do you see" >> titi && cat titi && sleep 15']
```

create your pod:
> kubectl create -f pod_0.yaml

![](../pics/empty_dir_0.png)

check if your pods has successfully been deployed:
> kubectl get pods

![](../pics/empty_dir_1.png)

As we can see, an error occured while creating our pod. Let's check our logs to figure out what happened:
> kubectl logs empty-dir-pod

![](../pics/empty_dir_2.png)

The directory *'/toto'* does not exist. let's create an emptyDir that point to *'toto'*.

#### 2- EmptyDir creation

We will now delete our pod with the following command for recreating it with an EmptyDir mounted volume.
> kubectl delete -f pod_0_dir.yaml

pod_0_dir.yaml
```
apiVersion: v1
kind: Pod
metadata:
  name: empty-dir-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'cd /toto && echo cd done && ls /toto && sleep 2 && echo "how many do you see" >> titi && sleep 1 && cat titi && sleep 15']
    volumeMounts:
      - mountPath: /toto
        name: scratch-volume
  volumes:
  - name: scratch-volume
    emptyDir: {}
```

We can now recreate the pod that point to an emptyDir */toto*
> kubectl create -f pod_0_dir.yaml

As seen on the Pod section, by default the restartPolicy of a POd is set to always. Therefore, this pod will indefinitely recreate the container. Consequently, he will write to the file titi inside our emptyDir. Let's check our file titi after some recreation of our Pod.

![](../pics/empty_dir_3.png)

We can see that our pod has restarted 6 times and it's the seventh creation. By checking the logs, we see that *"how many do you see"* is written 7 times !

Congrats, we've just proved that an EmptyDir is resilient to Container crash and restart.

#### 3- bonus: Pod lifecycle

In the last question, we didn't recreate a pod but the container within a specific *empty-dir-pod* pod. Look at the different status of your pod from the creation to the deletion of a container.

Run several times the following commands:
> kubectl describe pod empty-dir-pods

> kubectl get pods

## 2- PV and PVC via hostname

In this second demo, we will present the main principe of PV and PVC thanks to an hostPath. It is easier to use as it doesn't make us create a volume thanks to a cloud provider but you can adapt this tutorial to point out to a Disk on Azure/AWS/... if you'd like.

#### 1- PV creation

Create an hostname,with a kind of Persistent Volume with the following parameters:
- storage of 100Mi
- access mode: ReadWriteOnce
- points to /tmp/first_hostpath

pv_1.yaml
```
kind: PersistentVolume
apiVersion: v1
metadata:
  name: weblog-pv-volume
spec:
  storageClassName: manual
  capacity:
    storage: 100Mi
  accessModes:
  - ReadWriteOnce
  hostPath:
    path: "/tmp/first_hostpath"
```

create your pv:
> kubectl create -f pv_1.yaml

#### 2- PVC creation

Create a persistent volume claim with the same parameter than the pv but a storage capacity of 90Mi.

pvc_1.yaml
```
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: weblog-pv-claim
spec:
  storageClassName: manual
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 90Mi
```

create your pvc:
> kubectl create -f pvc_1.yaml

You can now check your pv and pvc. you should be able to see that they are bounded to each other. Besides, even though we ask for a claim of 90Mi. The only available PV that meets more than our requirements will be then bounded to our pvc.
Therefore a pvc that requires few storage could be bounded to a huge pv if it's the only one available. It is therefore important that the k8s cluster administrators provide different type of volumes.
>kubectl get pv,pvc

![](../pics/hostname_0.png)

#### 3- POD creation

We will now create a pod with two containers : an nginx application and a fluentd log collector. They will both be mounted to our hostname pvc and write and read from it.

pod_1.yaml
```
apiVersion: v1
kind: Pod
metadata:
  name: hostname-pod
spec:
  containers:
  - name: fdlogger
    image: fluent/fluentd
    volumeMounts:
    - mountPath: "/var/log"
      name: hostname-pv-storage
  - name: webcont
    image: nginx
    ports:
    - containerPort: 80
    volumeMounts:
    - mountPath: "/var/log/nginx/"
      name: hostname-pv-storage
  volumes:
  - name: hostname-pv-storage
    persistentVolumeClaim:
      claimName: weblog-pv-claim
```

create your pod:
> kubectl create -f pod_1.yaml

Verify the states of your pod.

#### 4- hostname verification

We need now to check if an hostname has been created in the directory /tmp of our node. As we are using minikube, we need to connect to the minikube cluster instance.

> minikube ssh

inside the minikube node, check the tmp/first_hostpath and look at its content.

We can now curl the nginx instance in order to write inside our /var/log/nginx of our container which is mounted with our hostpath and should therefore write as well on it.

We need to find out in which IP address we have to curl as we didn't expose our pod with a service.
> kubectl get pods -o wide

we can now curl from our minikube cluster to the IP of our pod. In our case, 172.17.0.2 and see that a request log has been added to our access.log hostpath.
> curl 172.17.0.2
