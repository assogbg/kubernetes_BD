# Lifecycle HANDS_ON

## 1- Lifecycle steps

In this first example, we will highlight the status' evolution of the POD while creating a container.

### Pod creation
Create a simple Pod with a busybox image that will not restart and that run that command: "echo The Pod is running && sleep 5"

<details>
    <summary>
    **Hints**
    </summary>


    ```
    ...
    spec:
      containers:
      - name: myapp-container
        image: busybox
        command: ['sh', '-c', 'echo The Pod is running && sleep 5']
      restartPolicy: Never
    ```

      > kubectl create mypod.yaml


</details>

### Pod status

Once your pod has been created, you need to get the status of the pod. Show that your Pod has several status while being created.

<details>
    <summary>
    **Hints**
    </summary>

    - execute several times
    > kubectl get pods `

    - Check the description
    > kubectl describe pods 

</details>

Now redo the same steps but with the bash command 'echo The Pod is running && exit 1'. Any differences while checking the status of your pod ?
