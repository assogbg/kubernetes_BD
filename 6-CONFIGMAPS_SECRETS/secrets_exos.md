## Secrets and configMap

### Exercise 1
- Create a file named apiKey.txt with a fake token on it "A19fh68B001j"

- Create a secret named apikey from the previous file

- Describe the secret

- Add a volume named apikeyvol that use the secret key to the following yaml:

```
apiVersion: v1
kind: Pod
metadata:
  name: consumesec
spec:
  containers:
  - name: shell
    image: centos:7
    command:
      - "bin/bash"
      - "-c"
      - "sleep 10000"
    volumeMounts:
      - name: apikeyvol
        mountPath: "/tmp/apikey"
        readOnly: true
```

- Enter your container using bash (pay attention that your container has a different name than your Pod...) and locate your secret using ***mount | grep apikey*** and cat your secret.

### Exercise 2 - Configuring a Pod to Use a ConfigMap

- Create a new file named config.txt with the following environment variables as key/value pairs on each line.
DB_URL equates to localhost:3306
DB_USERNAME equates to postgres

- Create a new ConfigMap named db-config from that file.

- Create a Pod named backend that uses the environment variables from the ConfigMap and runs the container with the image nginx.
Shell into the Pod and print out the created environment variables. You should find DB_URL and DB_USERNAME with their appropriate values.

### Exercise 3 - Configuring a Pod to Use a Secret
- Create a new Secret named db-credentials with the key/value pair db-password=passwd.

- Create a Pod named backendsecret that defines uses the Secret as environment variable named DB_PASSWORD and runs the container with the image nginx.

- Shell into the Pod and print out the created environment variables. You should find DB_PASSWORD variable.


## NEXT SESSION

You've completed the first training main session. You can now try to use all the learning to complete the first [USE CASE](../USE_CASES/a-carrefour/README.md)
