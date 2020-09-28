#  List of k8s useful commands

## Pods

<table>
<tr>
<th>Json 1</th>
<th>Markdown</th>
</tr>
<tr>
<td>
<pre>
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: ms-bye-dep
  name: ms-bye-dep
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ms-bye-dep
  template:
    metadata:
      labels:
        app: ms-bye-dep
    spec:
      containers:
      - image: pgolard/ms-bye:v1
        name: ms-bye
        ports:
        - containerPort: 9999
</pre>
</td>
<td>
<pre>
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: ms-hello-dep
  name: ms-hello-dep
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ms-hello-dep
  template:
    metadata:
      labels:
        app: ms-hello-dep
    spec:
      containers:
      - image: pgolard/ms-hello:v1
        name: ms-hello
        ports:
        - containerPort: 7777
</pre>
</td>
</tr>
</table>