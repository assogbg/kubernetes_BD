## Building configmap from a file
There are several way of creating a configmap from a file.
The way you generate your configmap will strongly influence the way you can access the configmap variables.

Let's say we have the following file named "config.txt":
```
DB_URL=localhost:3306
DB_USERNAME=postgres
```
And another file using the exact same format called "configenv.txt":
```
ENV_DB_URL=localhost:3306
ENV_DB_USERNAME=postgres
```

### Building a configMap using --from-file=

> kubectl create configmap db-config --from-file=config.txt

> kubectl get configmap db-config -o yaml

```
apiVersion: v1
data:
  config.txt: |
    DB_URL=localhost:3306
    DB_USERNAME=postgres
kind: ConfigMap
metadata:
  creationTimestamp: "2020-02-18T19:39:19Z"
  name: db-config
  namespace: ckad-prep
  resourceVersion: "2234001"
  selfLink: /api/v1/namespaces/ckad-prep/configmaps/db-config
  uid: 1d2c78a7-0dfb-41c4-b4ad-6f293627428c
```

If you do that, you'll only be able to access your env variable using a volume mount (mount the config file into a volume).
You will NOT be able to access them as env variable.

```
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: backendfile
  name: backendfile
spec:
  volumes:
    - name: config-volume
      configMap:
        name: db-config
  containers:
  - image: nginx
    name: backendfile
    volumeMounts:
    - name: config-volume
      mountPath: /tmp/
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```
This will mount your file config.txt in /tmp/ directory.


### Building a configMap using --from-env-file=

Imagine a file called "configenv.txt"

```
ENV_DB_URL=localhost:27017
ENV_DB_USERNAME=hostdb
```

You create a configmap called "db-config-env" using --from-env-file

> kubectl create configmap db-config-env --from-env-file=configenv.txt

You then output the configmap as yaml:
> kubectl get configmaps db-config-env -o yaml

```
apiVersion: v1
data:
  ENV_DB_URL: localhost:27017
  ENV_DB_USERNAME: hostdb
kind: ConfigMap
metadata:
  creationTimestamp: "2020-02-18T20:19:24Z"
  name: db-config-env
  namespace: ckad-prep
  resourceVersion: "2239625"
  selfLink: /api/v1/namespaces/ckad-prep/configmaps/db-config-env
  uid: 5b3fde99-dd7d-49c5-b842-079c39bdc642
```

Notice that you're now able to access the variable using their key.
You can use them as environment variables.

```
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: backendenv
  name: backendenv
spec:
  containers:
  - image: nginx
    name: backendenv
    envFrom:
    - configMapRef:
        name: db-config-env
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```


### Accessing configmap keys using valueFrom
To do so, you need to create your configmap in a proper dedicated yaml or using --from-literal or using --from-env-file.
