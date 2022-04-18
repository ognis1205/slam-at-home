Environments
==============================

environments: Kubernetes Objects for minikube deployment.

Deployment
------------

 1. Run the following command and start minikune.

 ```bash
 $ minikube start
 $ minikube dashboard
```

 2. Change the default endpoint for docker images.

 ```bash
 $ docker context ls
 $ eval $(minikube -p minikube docker-env -u)
 $ eval $(minikube docker-env)
 $ docker context ls
```

 3. Run the following commands in the respective project root directories to build docker images.
 
```bash
 $ cd PATH_TO_REACT_FRONTEND
 $ docker build -t react-frontend:minikube -f Dockerfiles/Dockerfile .
 $ cd -
 $ cd PATH_TO_EXPRESS_SIGNALING
 $ docker build -t express-signaling:minikube -f Dockerfiles/Dockerfile .
 $ cd -
```

 4. Create a namespace and apply the manifest.
 
```bash
 $ kubectl create namespace slam-at-home
 $ kubectl apply -f k8s/deployment.yaml --namespace=slam-at-home
```

 5. Expose services and acquire the URLs.

```bash
 $ kubectl expose deployment react-frontend --type=NodePort --port=3000 --namespace=slam-at-home
 $ kubectl expose deployment express-signaling --type=NodePort --port=3000 --namespace=slam-at-home
 $ minikube service react-frontend --url --namespace=sample
 $ minikube service express-signaling --url --namespace=sample
```

 6. Clean up the minikube cluster.

```bash
 $ kubectl delete service react-frontend --namespace=slam-at-home
 $ kubectl delete service express-signaling --namespace=slam-at-home
 $ kubectl delete deployment react-frontend --namespace=slam-at-home
 $ kubectl delete deployment express-signaling --namespace=slam-at-home
 $ kubectl delete namespace slam-at-home
 $ eval $(minikube -p minikube docker-env -u)
 $ minikube stop
```
