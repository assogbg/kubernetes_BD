## Node Base Image

Node base image enriched with netcat, telnet, curl, nano, dnslookup, ping

```
docker build --tag pgolard/node-utils:v1 - < node-utils/Dockerfile
docker push pgolard/node-utils:v1
```


## Node test apps - single container applications
curl http://0.0.0.0:7777/contactByeFromHello?svcDiscovery=ENVVAR

```
docker build --tag pgolard/ms-bye:v3 ./node-app/msBye/.
docker push pgolard/ms-bye:v3

docker build --tag pgolard/ms-hello:v3 ./node-app/msHello/.
docker push pgolard/ms-hello:v3
```


## Node test apps - multi container applications


```
docker build --tag pgolard/multcont-morning:v2 ./node-app/msMorning/.
docker push pgolard/multcont-morning:v2

docker build --tag pgolard/multcont-afternoon:v2 ./node-app/msAfternoon/.
docker push pgolard/multcont-afternoon:v2
```
