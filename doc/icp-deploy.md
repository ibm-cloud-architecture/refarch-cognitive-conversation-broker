# Deploy Conversation Broker to IBM Cloud Private
We propose to package the code as a docker image, build a helm chart and then publish it to an ICP instance.

## Prerequisites
If you do not have an ICP installed you can use the following [note](https://github.com/ibm-cloud-architecture/refarch-cognitive/blob/master/doc/install-dev-icp21.md) to do a 'developer' installation of ICP Community Edition.

## Build
This project includes a docker file to build a docker image of the broker micro-service. You can build the image to your local repository using the command:
```
# first build the App
$ npm build
$ docker build -t case/wcsbroker .
$ docker images
```
Then tag your local image with the name of the remote server where the docker registry resides, and the namespace to use. (*master.cfc:8500* is the remote server)
```
$ docker tag case/webportal master.cfc:8500/cyan/casewcsbroker:0.0.1
$ docker images
```

## Push docker image to ICP private docker repository

If you have copied the ICP master host certificate / public key to the /etc/docker/certs.d/<hostname>:<portnumber> folder on you local computer, you should be able to login to remote docker engine. (If not see this section: [Access ICP docker](https://github.com/ibm-cloud-architecture/refarch-integration/blob/master/docs/icp-deploy.md#access-to-icp-private-repository)) Use a user known by ICP.
```
docker login master.cfc:8500
User: admin
```
Push the image
```
docker push master.cfc:8500/default/casewcsbroker:0.0.1
```
More informations could be found [here](https://www.ibm.com/developerworks/community/blogs/fe25b4ef-ea6a-4d86-a629-6f87ccf4649e/entry/Working_with_the_local_docker_registry_from_Spectrum_Conductor_for_Containers?lang=en)

## Build the helm package
Helm is a package manager to deploy application and service to Kubernetes cluster. Package definitions are charts which are yaml files to be shareable between teams.

The first time you need to build a chart for the web app.  Select a chart name (casewcsbroker) and then use the command:
```
cd chart
helm init casewcsbroker
```

This creates yaml files and simple set of folders. Those files play a role to define the configuration and package for kubernetes. Under the templates folder the yaml files use parameters coming from helm, the values.yaml and chart.yaml.

The deployment.yaml defines the kubernetes deployment

*The template files may need to be modified to tune for your deployment* For example the following was added for out case.
```
dnsPolicy: ClusterFirst
securityContext: {}
imagePullSecrets:
  - name: admin.registrykey
  - name: default-token-45n44
```

### Chart.yaml
Set the version and name attributes, they will be used in deployment.yaml. Each time you deploy a new version of your app you can just change the version number. The values in the Chart.yaml are used in the templates.

### Add configMap templates
The config.json is a file that can be used when deploying on bluemix or locally, but when running on container within kubernetes it is good practice to externalize application configuration in config map. To do so we need to create a new template **templates/configmap.yaml**. This file uses the same structure as the config.json file but externalizes to get the parameter values from the values.yaml so developer can changes only one file to control the configuration.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ template "fullname" . }}
  labels:
    chart: "{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}"
data:
  config.json: |+
    {
        "conversation" :{
          "version" : "{{ .Values.config.conversation.version }}",
          "versionDate": "{{ .Values.config.conversation.versionDate }}",
          "username": "{{ .Values.config.conversation.username }}",
          "password": "{{ .Values.config.conversation.password }}",
          "workspace1":"{{ .Values.config.conversation.workspace1 }}",
          "conversationId": "{{ .Values.config.conversation.conversationId }}",
          "usePersistence": "{{ .Values.config.conversation.usePersistence }}"
        },

```
### Modify deployment.yaml
The configuration file can be overloaded by using the create content from the k8s config map. To do so we need to define a Volume to mount to the config.json file in the deployment.yaml as the following:
```yaml
volumeMounts:
- name: config
  mountPath: /wcsbroker/server/config.json
  subPath: config.json
```
the path */wcsbroker* comes from the dockerfile, working directory declaration. The volume name is arbitrary but needs to match a volume declared in the deployment.yaml. For example the volume is declared as config and use a configMap named template name of the helm package. See the paragraph above for the configmap.

```yaml      
volumes:
      - name: config
        configMap:
          name:  {{ template "fullname" . }}
```

### values.yaml
Specify in this file the docker image name and tag
```yaml
iimage:
  repository: master.cfc:8500/default/casewcsbroker
  tag: v0.0.1
  pullPolicy: IfNotPresent
service:
  name: casewcsbroker
  type: ClusterIP
  externalPort: 3001
  internalPort: 3001
```

Try to align the number of helm package with docker image tag.

Finally declare the config values to point to the conversation parameters:
```yaml
config:
  conversation:
    version : v1
    versionDate: 2017-02-03
    username: 291d9e533...
    password: aDFBlD...
    workspace1: 1a3bfc1...
    conversationId: ITSupportConversation
    usePersistence: false
```

## Build and deploy the application package with helm
```
$ cd chart
$ helm lint casewcsbroker
# if you do not have issue ...
$ helm install casewcsbroker
```
These commands should install a chart archive directly to kubernetes cluster

![](helm-install-out.png)
From the above we can see that a deployment was created in kubernetes, the casewcsbroker runs on one pod and a service got created to expose the deployment on the cluster IP on port 3001. And the NOTES section tells us how to access the pod.

You can login to ICP console and look at the Workload > applications
![](app-deployed.png)

### Use helm upgrade
When you want to change the version of the application:
```
helm upgrade casewcsbroker
```

### Verify the app is deployed
```
helm ls --all casewcsbroker

# remove the app
helm del --purge casewcsbroker
```
