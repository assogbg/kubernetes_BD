### Exercise 3

58. Create a deployment called webapp with image nginx with 5 replicas
59. Get the deployment you just created with labels
60. Output the yaml file of the deployment you just created
61. Get the pods of this deployment
62. Scale the deployment from 5 replicas to 20 replicas and verify
63. Get the deployment rollout status
64. Get the replicaset that created with this deployment
65. Get the yaml of the replicaset and pods of this deployment
66. Delete the deployment you just created and watch all the pods are also being deleted
67. Create a deployment of webapp with image nginx:1.17.1 with container port 80 and verify the image version
68. Update the deployment with the image version 1.17.4 and verify
69. Check the rollout history and make sure everything is ok after the update
70. Undo the deployment to the previous version 1.17.1 and verify Image has the previous version
71. Update the deployment with the image version 1.16.1 and verify the image and also check the rollout history
72. Update the deployment to the Image 1.17.1 and verify everything is ok
73. Update the deployment with the wrong image version 1.100 and verify something is wrong with the deployment
74. Undo the deployment with the previous version and verify everything is Ok
75. Check the history of the specific revision of that deployment
76. Pause the rollout of the deployment
77. Update the deployment with the image version latest and check the history and verify nothing is going on
78. Resume the rollout of the deployment
79. Check the rollout history and verify it has the new version
80. Apply the autoscaling to this deployment with minimum 10 and maximum 20 replicas and target CPU of 85% and verify hpa is created and replicas are increased to 10 from 1
81. Clean the cluster by deleting deployment and hpa you just created
