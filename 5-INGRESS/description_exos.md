URGENT
Configure mutual TLS authentication

https://www.alibabacloud.com/help/doc-detail/86533.htm


## Basic auth
https://kubernetes.github.io/ingress-nginx/examples/auth/basic/

Create basic authentication file
This example shows how to add authentication in a Ingress rule using a secret that contains a file generated with htpasswd. It's important the file generated is named auth (actually - that the secret has a key data.auth), otherwise the ingress-controller returns a 503.

`htpasswd -c auth foo`
```
New password:
Re-type new password:
Adding password for user foo
```

Now you need to create a k8s secret from the file.

`kubectl create secret generic basic-auth --from-file=auth`

`kubectl get secret basic-auth -o yaml`
```
apiVersion: v1
data:
  auth: Zm9vOiRhcHIxJC9DUmdodUQvJC4wSlY2T09xMjZkdE4xTkVUZ2VYQy4K
kind: Secret
metadata:
  creationTimestamp: "2020-04-30T22:50:31Z"
  name: basic-auth
  namespace: default
  resourceVersion: "311175"
  selfLink: /api/v1/namespaces/default/secrets/basic-auth
  uid: e4edc5ae-b429-4566-956a-4b478dead295
type: Opaque
```

Now you adapt your ingress rule yaml file:
```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: fan-out-ingress
  annotations:
    # type of authentication
    nginx.ingress.kubernetes.io/auth-type: basic
    # name of the secret that contains the user/password definitions
    nginx.ingress.kubernetes.io/auth-secret: basic-auth
    # message to display with an appropriate context why the authentication is required
    nginx.ingress.kubernetes.io/auth-realm: 'Authentication Required - foo'
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


`kubectl apply -f gomorraing.yaml`

Test your app without giving user and pwd:

`curl -H "Host: gomorra.com" -X GET http://$minikubeIp/donciro`
```
<html>
<head><title>401 Authorization Required</title></head>
<body>
<center><h1>401 Authorization Required</h1></center>
<hr><center>openresty/1.15.8.2</center>
</body>
</html>
```
Test your app giving right user and pwd:

`curl -H "Host: gomorra.com" -X GET http://$minikubeIp/donciro -u 'foo:bar'`

```
This is the GREAT ciro di marzo API v3%
```

## Url auth
https://medium.com/@ankit.wal/authenticate-requests-to-apps-on-kubernetes-using-nginx-ingress-and-an-authservice-37bf189670ee

debug:

https://github.com/kubernetes/ingress-nginx/issues/3665#issuecomment-454422652

###Step 1:
created a new web service for authentication


`docker build --tag pgolard/test-auth:v4 ./testAuth/.`

`docker push pgolard/test-auth:v4`

###step 2 create deployment and service for this authenticator:

`kubectl run authenticator --image=pgolard/test-auth:v4 --labels=app=authenticator --replicas=1 --port=80`

`kubectl expose deployment authenticator --name=demo-auth-service --port=80 --target-port=80 --type=ClusterIP`

###step 3: create ingress
```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: fan-out-ingress
  annotations:
    nginx.ingress.kubernetes.io/auth-url: http://demo-auth-service.default.svc.cluster.local/authParam/urlauth/urlpw
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
struggled with the url. Solution is

**Using the full FQDN <service>.<namespace>.svc.cluster.local works.**
Using the nslookup tool, we can get the FQDN of a Pod/or service



`kubectl exec -it jumpod nslookup 10.244.0.149`

```
Server:    10.245.0.10
Address 1: 10.245.0.10 kube-dns.kube-system.svc.cluster.local

Name:      10.244.0.149
Address 1: 10.244.0.149 10-244-0-149.hello.production.svc.cluster.local
```

###Step 4: testing

Works fine if correct pw and uname:

`curl -H "Host: gomorra.com" -X GET http://$minikubeIp/donciro --header 'User: urlauth' --header 'Password: urlpw'`  


If I pass a wrong password, I don't have a 401 àr 404
```
curl -H "Host: gomorra.com" -X GET http://$minikubeIp/donciro --header 'User: urlauth' --header 'Password: urlpwsss'
<html>
<head><title>500 Internal Server Error</title></head>
<body>
<center><h1>500 Internal Server Error</h1></center>
<hr><center>openresty/1.15.8.2</center>
</body>
</html>
```

## next steps

https://kubernetes.github.io/ingress-nginx/examples/auth/client-certs/
https://kubernetes.github.io/ingress-nginx/examples/auth/oauth-external-auth/
