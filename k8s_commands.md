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
{
  "id": 1,
  "username": "joe",
  "email": "joe@example.com",
  "order_id": "3544fc0"
}
</pre>
</td>
<td>

```yaml
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
```

</td>
</tr>
</table>