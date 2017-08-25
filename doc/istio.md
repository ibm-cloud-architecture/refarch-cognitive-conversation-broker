# istio integration

# Installation
* Download istio from [release page](https://github.com/istio/istio/releases)
* Follow the installation instruction [here]()
Some updates to complete the installation on minikube.
* Add the Role and Cluster role as defined in yaml file: install/kubernetes/istio-rbac-beta.yaml. (The apply command may not work as stated in istio doc.)
```
$ kubectl create -f install/kubernetes/istio-rbac-beta.yaml

clusterrole "istio-pilot" created
clusterrole "istio-ca" created
clusterrole "istio-sidecar" created
clusterrolebinding "istio-pilot-admin-role-binding" created
clusterrolebinding "istio-ca-role-binding" created
clusterrolebinding "istio-ingress-admin-role-binding" created
clusterrolebinding "istio-egress-admin-role-binding" created
clusterrolebinding "istio-sidecar-role-binding" created
```
* Installed istio without Auth
```
kubectl apply -f install/kubernetes/istio.yaml

configmap "istio-mixer" created
service "istio-mixer" created
deployment "istio-mixer" created
configmap "istio" created
service "istio-pilot" created
serviceaccount "istio-pilot-service-account" created
deployment "istio-pilot" created
service "istio-ingress" created
serviceaccount "istio-ingress-service-account" created
deployment "istio-ingress" created
service "istio-egress" created
serviceaccount "istio-egress-service-account" created
deployment "istio-egress" created
```

* Enabled tracing
Grafana addon provides an Istio dashboard visualization of the metrics.

The ServiceGraph addon provides a textual (JSON) representation and a graphical visualization of the service interaction graph for the cluster.

```
$ kubectl apply -f install/kubernetes/addons/prometheus.yaml

configmap "prometheus" created
service "prometheus" created
deployment "prometheus" created

$ kubectl apply -f install/kubernetes/addons/grafana.yaml
$ kubectl apply -f install/kubernetes/addons/servicegraph.yaml
```


# Run in minikube
Be sure to start minikube with Role Base Access Control mode:
`minikube start --extra-config=apiserver.Authorization.Mode=RBAC`
