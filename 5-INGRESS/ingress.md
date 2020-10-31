# Ingress


* [Introduction](introduction.md)
  * [Dummy Application](introduction.md#Dummy-Application)
  * [Overview](introduction.md#Overview)
  * [Vocation](introduction.md#Vocation)
* [Core Components](core-comp.md)
  * [Ingress Controller](core-comp.md#Ingress-Controller)
  * [Ingress Resource](core-comp.md#Ingress-Resource)
* [Ingress Resources](ing-res.md)
  * [Options](#Options) FQDN vs Ip, Public vs Private, rewriting, default backend ...
  * [Fanout](#Fanout)
* [Ingress Deployment](#Ingress-Deployment)
  * [Minikube Addon](#Minikube-Addon)
  * [Helm Charts](#Helm-Charts)
  * [Bare Deployment](#Bare-Deployment) ?? TODO find another name to describe traeffik ingress controller deployment which includes SA, Cluster Role, ClusterRole Binding, Network Policy, Daemonset, Service
* [TLS](#TLS)
  * [Static Certificate](#Static-Certificate) self signed or trusted authority
  * [Dynamic Certificate](#Dynamic-Certificate)  Cert-Manager, Letsencrypt
* [Authentication](#Authentication)
  * [Basic](#Basic)
  * [Oauth](#Oauth)
  * [AD](#AD)




## Introduction

Short Introduction of our dummy application that will help illustrate ingress concepts, with a overview of ingress objects and their vocation.

**[INTRODUCTION](introduction.md)**


## Core Components

Quick overview of the 2 core components that make up the ingress mechanism, nalely Ingress Controller and Ingress Resource.

**[Core Components](core-comp.md)**

## Ingress Resources

Deep dive into different ingress rules and resources that can be defined andimplemented.

**[Ingress Resources](ing-res.md)**

---


on a proper k8s instances (as a service or not), an ingress is a "service for services".
It consists of a kind of gateway between outside world and your k8s apps running on your minions.

Ingresses actually re-route traffic from/to the outside world to your svc (and their final endpoints, namely our dep/RC/pods).

Normally, an ingress includes three components:
- ingress "controllers" (not controllers in k8s vocabulary but pods created through deployments or daemonsets) that handle traffic
- ingress svc (virtual ip that points towards ing controllers)
- ingress rules : instructions that ingress "controllers" have to implement to redirect traffic to appropriate micro services

![](ingresslookup.png)


There are different ways to set up ingresses, according to the k8s "distribution"
- helm - pkg mgr
- dameonsets + svc + svc account + roles + rolebindings
- minikube simple command : minikube addons enable ingress

The strange thing with minikube is that the simple command (addons...)
- generate a "controller" in kube-system ns
- do not generate a dedicated ingress svc

Below is the list of items in all namespaces

`kubectl get po,svc,ing --all-namespaces`


```
NAMESPACE     NAME                                            READY   STATUS    RESTARTS   AGE
default       pod/ciro-59ffbfbf4f-s8j4v                       1/1     Running   0          3h1m
default       pod/ciro-59ffbfbf4f-th5dt                       1/1     Running   0          3h1m
default       pod/savastano-79b985b446-4zzxj                  1/1     Running   0          3h42m
default       pod/savastano-79b985b446-rp8xd                  1/1     Running   0          3h42m
kube-system   pod/coredns-6955765f44-dzr5w                    1/1     Running   1          39d
kube-system   pod/coredns-6955765f44-q66nc                    1/1     Running   1          39d
kube-system   pod/etcd-minikube                               1/1     Running   1          39d
kube-system   pod/kube-addon-manager-minikube                 1/1     Running   1          39d
kube-system   pod/kube-apiserver-minikube                     1/1     Running   1          39d
kube-system   pod/kube-controller-manager-minikube            1/1     Running   2          39d
kube-system   pod/kube-proxy-d9vbc                            1/1     Running   1          39d
kube-system   pod/kube-scheduler-minikube                     1/1     Running   2          39d
kube-system   pod/nginx-ingress-controller-6fc5bcc8c9-95kfd   1/1     Running   2          39d
kube-system   pod/storage-provisioner                         1/1     Running   1          39d

NAMESPACE     NAME                              TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                  AGE
default       service/ciro-svc-clusterip        ClusterIP   10.96.56.66     <none>        7777/TCP                 64m
default       service/kubernetes                ClusterIP   10.96.0.1       <none>        443/TCP                  39d
default       service/savastano-svc-clusterip   ClusterIP   10.96.200.187   <none>        9999/TCP                 63m
kube-system   service/kube-dns                  ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP,9153/TCP   39d

NAMESPACE   NAME                                 HOSTS         ADDRESS        PORTS   AGE
default     ingress.extensions/fan-out-ingress   gomorra.com   192.168.64.7   80      61m
```

Nevertheless, when you apply ingress rules, it works.


Here is the ingress rule:
```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: fan-out-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
  - host: gomorra.com
    http:
      paths:
      - path: /donciro(/|$)(.*)
        backend:
          serviceName: ciro-svc-clusterip
          servicePort: 7777
      - path: /donpietro(/|$)(.*)
        backend:
          serviceName: savastano-svc-clusterip
          servicePort: 9999

```
Now you can access your MS from outside the cluster without being bound the NodePort.
>minikubeIp=$(minikube ip)

> curl -H "Host: gomorra.com" -X GET http://$minikubeIp/donciro/













## check theory
https://kubernetes.io/docs/concepts/services-networking/ingress/#tls

TODO CHECK sessionAffinity FOR WEBAPPS
https://medium.com/@zhimin.wen/sticky-sessions-in-kubernetes-56eb0e8f257d
https://www.haproxy.com/blog/load-balancing-affinity-persistence-sticky-sessions-what-you-need-to-know/


## ssl
Check the ssl stuff
Here we see that we do not provide host name with that ingress :

```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: fan-out-ingress-clusterip
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: \"false\"
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
  - http:
      paths:
      - path: /donciro(/|$)(.*)
        backend:
          serviceName: web-service-ciro
          servicePort: 7777
      - path: /donpietro(/|$)(.*)
        backend:
          serviceName: web-service-savastano
          servicePort: 9999
```


## Ingess single svc

```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: test-ingress
spec:
  backend:
    serviceName: testsvc
    servicePort: 80
```

## auth

https://medium.com/@ankit.wal/authenticate-requests-to-apps-on-kubernetes-using-nginx-ingress-and-an-authservice-37bf189670ee


## session affinity for web app

https://www.haproxy.com/blog/load-balancing-affinity-persistence-sticky-sessions-what-you-need-to-know/



---

## MINIKUBE SPECIFICITY WITH INGRESS

on a proper k8s instances (as a service or not), an ingress is a "service for services".
It consists of a kind of gateway between outside world and your k8s apps running on your minions.

Ingresses actually re-route traffic from/to the outside world to your svc (and their final endpoints, namely our dep/RC/pods).

Normally, an ingress includes three components:
- ingress "controllers" (not controllers in the k8s vocabulary; actually pods - created through deployments or daemonsets) that
- ingress svc (virtual ip that points towards ing controllers)
- ingress rules : instructions that ingress "controllers" have to implement to redirect traffic to appropriate micro services

There are different ways to set up ingresses, according to the k8s "distribution"
- helm - pkg mgr
- dameonsets + svc + svc account + roles + rolebindings
- minikube simple command : minikube addons enable ingress

The strange thing with minikube is that the simple command (addons...)
- generate a "controller" in kube-system ns
- do not generate a dedicated ingress svc

Nevertheless, when you apply ingress rules, it works.


## minikube

advanced ingress with certificates
https://hackernoon.com/setting-up-nginx-ingress-on-kubernetes-2b733d8d2f45
https://skryvets.com/blog/2019/04/09/exposing-tcp-and-udp-services-via-ingress-on-minikube/
https://kubeless.io/docs/http-triggers/

## NGINX INGRESS SETUP - with different k8s tools

https://kubernetes.github.io/ingress-nginx/deploy/

#### ingress fan out minikube accessible from any machine in your home network

## Create Ingress

Important to note that this simple command creates automatically in ns kube-system
- niginx ingress controller (pod in charge of routing traffic)
- DO NOT create an ingress service as it would with AKS, prod k8s or Docker for mac

> minikube addons enable ingress
> kubectl get pods --all-namespaces

Now let's create an ingress rule that the ingress "controller" will have to implement:

> kubectl create -f virtual-hosts-ingress.yaml

Check ingress rule creation:

> kubectl get ing

Now test requesting a microservice using host fake dns as IP, and do not make the effort of specifying the port (or specify port 80, which the nginx ingress default port for http)
In this example the real IP is minikube's.

> curl -H "Host: gomorra.com" -X GET http://192.168.64.5/donpietro/

## Port forward your ingress to make it accessible in your LAN

> ssh -i ~/.minikube/machines/minikube/id_rsa docker@$(minikube ip) -L \*:80:0.0.0.0:80

After svc port fwd => use host ip. You can do this from any machine in your LAN.

> curl -H "Host: gomorra.com" -X GET http://192.168.0.6:80/donciro/\n
> curl -H "Host: gomorra.com" -X GET http://192.168.0.6:80/donciro/getImmortale/\n


## useful network commands to scan network
telnet

netstat
9244  arp -a
 9245  brew install arp-scan
 9246  arp-scan --localnet\n
 9412  arp -a
 9414  arp -a
 9416  brew install arp-scan
 9417  arp-scan -l
 9418  sudo arp-scan -l
10090  history | grep arp
10091  arp-scan -l
10092  sudo arp-scan -l
10095  arp -a
10100  arp -a
