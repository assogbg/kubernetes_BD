# Home made custom node js api - gomorra

Use our custom deployments to test exposing them via services

## Service type - cluster ip

### Expose your deployments
> kubectl expose --dry-run -o yaml  deployment ciro --name=ciro-svc-clusterip --port=7777 --target-port=7777 --type=ClusterIP

```
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: ciro
  name: ciro-svc-clusterip
spec:
  ports:
  - port: 7777
    protocol: TCP
    targetPort: 7777
  selector:
    app: ciro
  type: ClusterIP
status:
  loadBalancer: {}
```

> kubectl expose --dry-run -o yaml  deployment savastano --name=savastano-svc-clusterip --port=9999 --target-port=9999 --type=ClusterIP

### check services, pods and endpoints
> kubectl get po,svc,ep -o wide
```
NAME                             READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
pod/ciro-59ffbfbf4f-s8j4v        1/1     Running   0          37m   172.17.0.6   minikube   <none>           <none>
pod/ciro-59ffbfbf4f-th5dt        1/1     Running   0          37m   172.17.0.8   minikube   <none>           <none>
pod/savastano-79b985b446-4zzxj   1/1     Running   0          78m   172.17.0.3   minikube   <none>           <none>
pod/savastano-79b985b446-rp8xd   1/1     Running   0          78m   172.17.0.2   minikube   <none>           <none>

NAME                              TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE     SELECTOR
service/ciro-svc-clusterip        ClusterIP   10.96.32.48   <none>        7777/TCP   3m8s    app=ciro
service/kubernetes                ClusterIP   10.96.0.1     <none>        443/TCP    39d     <none>
service/savastano-svc-clusterip   ClusterIP   10.96.2.101   <none>        9999/TCP   2m47s   app=savastano

NAME                                ENDPOINTS                         AGE
endpoints/ciro-svc-clusterip        172.17.0.6:7777,172.17.0.8:7777   3m8s
endpoints/kubernetes                192.168.64.7:8443                 39d
endpoints/savastano-svc-clusterip   172.17.0.2:9999,172.17.0.3:9999   2m47s
```

You see what a service consists of:
- provides a virtual ip that can now load balance traffic to the pods the svc is related to
- this mapping between svc ip and its endpoints is persisted in kube-proxy iptables on each node
- a svc is aware of its endpoints (pods) using a label selector

In terms of service discovery, we can use the svc dns.

Just one remark with clusterIp services : this service is accessible only from within the cluster.
If we want to be able to access it from outside the cluster :
- use ingress
- use nodeport
- use loadBalancer (provided by some clouds)

### service discovery

From within you k8s cluster, if you need to interact with other pods/services, you can access them via 2 different ways


#### DNS


if you connect to one of your pod in ssh
> kubectl exec -it savastano-79b985b446-4zzxj bash

And try to execute a wget on the service name, it works:
> wget -O- ciro-svc-clusterip:7777
```
--2020-04-30 04:00:58--  http://ciro-svc-clusterip:7777/
Resolving ciro-svc-clusterip (ciro-svc-clusterip)... 10.96.32.48
Connecting to ciro-svc-clusterip (ciro-svc-clusterip)|10.96.32.48|:7777... connected.
HTTP request sent, awaiting response... 200 OK
```
#### ENV variables
> printenv

```
WEB_SERVICE_SAVASTANO_PORT_9999_TCP=tcp://10.96.108.239:9999
YARN_VERSION=1.15.2
WEB_SERVICE_CIRO_SERVICE_HOST=10.96.48.230
WEB_SERVICE_CIRO_PORT_7777_TCP_ADDR=10.96.48.230
WEB_SERVICE_SAVASTANO_SERVICE_HOST=10.96.108.239
HOSTNAME=savastano-79b985b446-4zzxj
WEB_SERVICE_CIRO_SERVICE_PORT=7777
WEB_SERVICE_CIRO_PORT_7777_TCP_PROTO=tcp
WEB_SERVICE_CIRO_PORT=tcp://10.96.48.230:7777
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBERNETES_PORT=tcp://10.96.0.1:443
WEB_SERVICE_SAVASTANO_PORT=tcp://10.96.108.239:9999
WEB_SERVICE_SAVASTANO_PORT_9999_TCP_ADDR=10.96.108.239
PWD=/usr/src/app
HOME=/root
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT_443_TCP_PORT=443
WEB_SERVICE_CIRO_PORT_7777_TCP=tcp://10.96.48.230:7777
NODE_VERSION=12.0.0
WEB_SERVICE_CIRO_PORT_7777_TCP_PORT=7777
WEB_SERVICE_SAVASTANO_PORT_9999_TCP_PORT=9999
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
TERM=xterm
SHLVL=1
KUBERNETES_SERVICE_PORT=443
WEB_SERVICE_SAVASTANO_PORT_9999_TCP_PROTO=tcp
WEB_SERVICE_SAVASTANO_SERVICE_PORT=9999
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
KUBERNETES_SERVICE_HOST=10.96.0.1
```

## Service type - node port

NodePort service provides a high port that is bound to your worker node public ips.
Once you send your request to one of the worker node public ip, with the appropriate NodePort, it will reverse proxy to the corresponding service. Then the internal svc will load balance the traffic to its endpoints.


### expose your deployments

> kubectl expose deployment ciro --name=ciro-svc-nodeport --port=7777 --target-port=7777 --type=NodePort

> kubectl get svc ciro-svc-nodeport -o yaml

```
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: "2020-04-30T04:14:53Z"
  labels:
    app: ciro
  name: ciro-svc-nodeport
  namespace: default
  resourceVersion: "228156"
  selfLink: /api/v1/namespaces/default/services/ciro-svc-nodeport
  uid: a4efb313-22ec-4cdc-8706-0cd9650534d4
spec:
  clusterIP: 10.96.244.28
  externalTrafficPolicy: Cluster
  ports:
  - nodePort: 31746
    port: 7777
    protocol: TCP
    targetPort: 7777
  selector:
    app: ciro
  sessionAffinity: None
  type: NodePort
status:
  loadBalancer: {}
```

> kubectl expose deployment savastano --name=savastano-svc-nodeport --port=9999 --target-port=9999 --type=NodePort

```
kubectl get svc savastano-svc-nodeport -o yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: "2020-04-30T04:20:08Z"
  labels:
    app: savastano
  name: savastano-svc-nodeport
  namespace: default
  resourceVersion: "228890"
  selfLink: /api/v1/namespaces/default/services/savastano-svc-nodeport
  uid: 3ca92c4c-e252-4c69-95d3-84ce15d7881f
spec:
  clusterIP: 10.96.37.124
  externalTrafficPolicy: Cluster
  ports:
  - nodePort: 30988
    port: 9999
    protocol: TCP
    targetPort: 9999
  selector:
    app: savastano
  sessionAffinity: None
  type: NodePort
```

### reach you MS using minikube IP + nodePort
> curl -X GET http:/192.168.64.7:31746/getImmortale\?clan\=savas
