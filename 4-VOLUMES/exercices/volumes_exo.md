# Volumes HANDS_ON

### 1- EmptyDir

In the first exercice, we would like to create a pod mounted to an EmptyDir "/toto". We want a container that echo the content of "/toto", wait 10 seconds, echo the duration of the sleep (echo 10) and then create a file "titi.md" inside the toto directory.

  - Does the pod terminate at the end of the bash command of the container ?
  - Does the container restart ?
  - Could you add a parameter to either restart or stop the container re-creation ?
  - Does the EmptyDir is deleted or not when the container is terminated ?

**Hint:**

image for bash:
> busybox

bash commands:
> command: ['sh', '-c', 'cd /toto && echo cd done && ls /toto && echo "how many do you see" >> titi && cat titi && sleep 15']


### 2- Persistent Volume

#### a- PV and PVC discovery

 - List Persistent Volumes in the cluster
 - Create a hostPath PersistentVolume named task-pv-volume with storage 10Gi, access modes ReadWriteOnce, storageClassName manual, and volume at /mnt/data and verify
 - Create a PersistentVolumeClaim of at least 3Gi storage and access mode ReadWriteOnce and verify status is bound
 - Delete persistent volume and PersistentVolumeClaim we just created

#### b- data unpersistent/persistent for a POD

 - Create a Pod with an image Redis and configure a volume that lasts for the lifetime of the Pod
 - Exec into the above pod and create a file named file.txt with the text ‘This is called the file’ in the path /data/redis and open another tab and exec again with the same pod and verifies file exist in the same path.
 - Delete the above pod and create again from the same yaml file and verifies there is no file.txt in the path /data/redis
 - Create PersistentVolume named task-pv-volume with storage 10Gi, access modes ReadWriteOnce, storageClassName manual, and volume at /mnt/data and Create a PersistentVolumeClaim of at least 3Gi storage and access mode ReadWriteOnce and verify status is Bound
 - Create an nginx pod with containerPort 80 and with a PersistentVolumeClaim task-pv-claim and has a mouth path "/usr/share/nginx/html"

 
