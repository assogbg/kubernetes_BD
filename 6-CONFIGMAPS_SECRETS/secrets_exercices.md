## Secrets and configMap

### Exercise 1
Todays Task: Secrets and ConfigMaps

- Create a secret1.yaml. The yaml should create a secret called secret1 and store password:12345678. Create that secret.
- Create a pod1.yaml which creates a single pod of image bash . This pod should mount the secret1 to /tmp/secret1. This pod should stay idle after boot. Create that pod.
- Confirm pod1 has access to our password via file system.
- On your local create a folder drinks and its content: mkdir drinks; echo ipa > drinks/beer; echo red > drinks/wine; echo sparkling > drinks/water
- Create a ConfigMap containing all files of folder drinks and their content.
- Make these ConfigMaps available in our pod1 using environment variables.
- Check on pod1 if those environment variables are available.

### Exercise 2
Configuring a Pod to Use a ConfigMap

Create a new file named config.txt with the following environment variables as key/value pairs on each line.
DB_URL equates to localhost:3306
DB_USERNAME equates to postgres
Create a new ConfigMap named db-config from that file.
Create a Pod named backend that uses the environment variables from the ConfigMap and runs the container with the image nginx.
Shell into the Pod and print out the created environment variables. You should find DB_URL and DB_USERNAME with their appropriate values.

### Exercise 3
Configuring a Pod to Use a Secret
Create a new Secret named db-credentials with the key/value pair db-password=passwd.
Create a Pod named backendsecret that defines uses the Secret as environment variable named DB_PASSWORD and runs the container with the image nginx.
Shell into the Pod and print out the created environment variables. You should find DB_PASSWORD variable.
