# Home made custom node js api - gomorra

## local docker
> docker-compose up --build

>  curl -X GET http://0.0.0.0:7777
```
This is the GREAT ciro di marzo API v3%                                                
```

> curl -X GET http://0.0.0.0:7777/getImmortale\?clan\=savas

```                                                    
sempre per noi ciro - clan savas%  
 ```


### Build and push image to you docker hub
> docker build --tag pgolard/test-ciro:v3 ./docker-image/testCiro/.
> docker push pgolard/test-ciro:v3
> docker build --tag pgolard/test-savastano:v3 ./docker-image/testSavastano/.
> docker push pgolard/test-savastano:v3

### Now modify the app json file to make sure we create the 4th version
> docker build --tag pgolard/test-ciro:v4 ./docker-image/testCiro/.
> docker push pgolard/test-ciro:v4
> docker build --tag pgolard/test-savastano:v4 ./docker-image/testSavastano/.
> docker push pgolard/test-savastano:v4


## pods

### create 2 pods based on the third image
> kubectl run --dry-run --restart=Never -o yaml savastano --image=pgolard/test-savastano:v3 --port=9999 > savastanopod.yaml
> kubectl run --dry-run=client --restart=Never -o yaml ciro --image=pgolard/test-ciro:v3 --port=7777 > ciropod.yaml

### retrieve their ip adresses
> kubectl get pods -o wide

```
NAME        READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
ciro        1/1     Running   0          12s   172.17.0.3   minikube   <none>           <none>
savastano   1/1     Running   0          22s   172.17.0.2   minikube   <none>           <none>
```
### try to curl them from your local machine
> curl -X GET http:/172.17.0.3:7777/getImmortale\?clan\=savas

It doesn't work - their ip is only accessible from within the cluster
So connect on minikube
> minikube ssh

> curl -X GET http:/172.17.0.3:7777/getImmortale\?clan\=savas

And this works fine.
### try to curl them from your local machine using the minikube ip
> curl -X GET http:/192.168.64.7:7777/getImmortale\?clan\=savas

It doesn't work.
