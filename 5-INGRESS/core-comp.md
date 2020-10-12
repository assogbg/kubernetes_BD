# Core Components

Normally, an ingress includes three components:
- ingress "controllers" (not controllers in k8s vocabulary but pods created through deployments or daemonsets) that handle traffic
- ingress svc (virtual ip that points towards ing controllers) -> **??????**
- ingress rules : instructions that ingress "controllers" have to implement to redirect traffic to appropriate micro services

## Ingress Controller

In order to make Ingress resources work (in order to apply some ingress rules/features), an Ingress controller needs to be running in the cluster.
Different Kubernetes environments use different implementations of the controller, but several don’t provide a default controller at all.

Later on in this chapter, within the section dedicated to "Ingress Deployment", we'll dive deeper in the exact components and subcomponents an Ingress Controller is made up of/is interacting with.
For now on, let's focus on the fact a set of pods needs to be deployed to handle traffic and apply the Ingress resource/rules we're going to define.
As this training is mostly relying on minikube, let's quickly see how the ingress controller can be deployed on minikube. To do so, you just need to enable the following addon:


```
minikube addons enable ingress
```

We now see in the kube-system namespace that a "nginx-ingress-controller-6fc5bcc8c9-286c6" pod has just been created.

> kubectl get pods -n kube-system
```
NAME                                        READY   STATUS    RESTARTS   AGE
coredns-6955765f44-b6z8t                    1/1     Running   1          19d
coredns-6955765f44-nklm8                    1/1     Running   1          19d
etcd-minikube                               1/1     Running   16         199d
kube-addon-manager-minikube                 1/1     Running   9          199d
kube-apiserver-minikube                     1/1     Running   81         199d
kube-controller-manager-minikube            1/1     Running   290        199d
kube-proxy-d9vbc                            1/1     Running   9          199d
kube-scheduler-minikube                     1/1     Running   282        199d
metrics-server-6754dbc9df-nhjbx             1/1     Running   1          19d
nginx-ingress-controller-6fc5bcc8c9-286c6   1/1     Running   18         19s
storage-provisioner                         1/1     Running   2          14d
```

This is the Ingress controller pod. The name suggests that Nginx (an open-source HTTP server and reverse proxy) is used to provide the Ingress functionality.

We'll get back on the Ingress Controller laetr on in this chapter.

## Ingress Resource

You’ve confirmed there’s an Ingress controller running in your cluster, so you can now create an Ingress resource.
There are several ways of defining Ingress resources, with different options.
We're going to deep dive in that in next section.
For now on, let's see a simple example of Ingress resource. The following YAML manifest for an fanout Ingress looks like.

![](ingress_fanout_example.png)

A fanout configuration routes traffic from a single IP address to more than one Service, based on the HTTP URI being requested. An Ingress allows you to keep the number of load balancers down to a minimum.

Note that we used the NodePort Services as backends. Nevertheless traffic will be forwarded to services clusterIp since we route traffic to service Port, not to NodePort.
```
kubectl apply -f illustrations/ingress_rules/saluteing.yaml
nodeIp=$(minikube ip)
curl -H "Host: salute.com" -X GET http://$nodeIp/hello/

This is the hello world from ms hello%                                                                                                                                                                               

curl -H "Host: salute.com" -X GET http://$nodeIp/hello/sayHelloToSomeone\?personToSalute\=Joe


{"personToSayHello":"Joe"}%



curl -H "Host: salute.com" -X GET http://$nodeIp/bye/sayByeToSomeone\?personToSalute\=Sleepy

{"personToSayBye":"Sleepy"}%
```

In next scetion we'll see in details the different types of ingress resources that can be defined.

FOR THE REST OF THE CHAPTER See
https://kubernetes.io/docs/concepts/services-networking/ingress/


Configure mutual TLS authentication

https://www.alibabacloud.com/help/doc-detail/86533.htm

use
![](ingresslookup.png)
edit and adapt to fanout



back to ingress home **[:arrow_left:](README.md)**
**[:arrow_right:](core-comp.md)** next section core components
