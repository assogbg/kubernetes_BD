#!/bin/bash
docker build --tag pgolard/ms-bye:v$1 ./node-app/msBye/.
docker push pgolard/ms-bye:v$1

docker build --tag pgolard/ms-hello:v$1 ./node-app/msHello/.
docker push pgolard/ms-hello:v$1
docker build --tag pgolard/multcont-morning:v$1 ./node-app/msMorning/.
docker push pgolard/multcont-morning:v$1

docker build --tag pgolard/multcont-afternoon:v$1 ./node-app/msAfternoon/.
docker push pgolard/multcont-afternoon:v$1
