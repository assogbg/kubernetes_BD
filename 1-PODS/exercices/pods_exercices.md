
## pods

### create 2 pods based on the third image
> kubectl run --dry-run --restart=Never -o yaml savastano --image=assogbg/test-savastano:v1 --port=9999 > savastanopod.yaml
> kubectl run --dry-run=client --restart=Never -o yaml ciro --image=assogbg/test-ciro:v1 --port=7777 > ciropod.yaml

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
