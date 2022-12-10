### Local development setup

1.  Install required tools

    1. Install [Docker for Desktop](https://www.docker.com/) and enable kubernetes.

    2. Install [gcloud CLI](https://cloud.google.com/sdk/docs/install) and sign in

       ```bash
       gcloud auth application-default login
       gcloud config set container/use_application_default_credentials true
       ```

    3. Install [kubectl](https://kubernetes.io/docs/tasks/tools/)

       If you have kubernetes enabled in Docker for Desktop then `docker-desktop` context should be the active context

       ```bash
       # see all the available context
       $ kubectl config get-contexts
       # pick the context you want to currently use
       $ kubectl config use-context <context-name>

       # extra: see detailed list of config/contexts
       $ kubectl config view
       ```

2.  Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)

    If you are not using Helm

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
    ```

3.  Configure kubernetes secrets

    1. JWT key as a sceret `jwt-secret`

       JWT_KEY is used in all services to ensure the user is authenticated

       `kubectl create secret generic jwt-secret --from-literal=JWT_KEY={YOUR_JWT_KEY_HERE}`

    2. Authenticate to Cloud Pub/Sub

       Do step 3.2 after step 4

       Refer to [this guide](https://cloud.google.com/kubernetes-engine/docs/tutorials/authenticating-to-cloud-platform)

4.  Connect MongoDB to services (auth & cart)

    1. Create DB at MongoDB atlas and setup user and IP whitelist or setup mongodb locally

    2. create a kubernetes secret for mongodb URI which includes the databasename, username and password.

    `kubectl create secret generic mongo-{service_name}-secret --from-literal=MONGO_URI={YOUR_MONGO_URI_HERE}`

    3. Ensure cart and auth deployment are consuming the secrets which contains mongod URIs.

5.  Enable and configure Cloud Pub/Sub

    GCP recommends to use the Pub/Sub Emulator for local development but for now we are connecting directly to Google Cloud.

    1. Create a project on GCP and enable Cloud Pub/Sub API

    2. Create Cloud Pub/Sub topics that you require for the application from the [Google Cloud Console](https://console.cloud.google.com/cloudpubsub/topic/list)

6.  Install and configure `skaffold`

    1. Install [skaffold](https://skaffold.dev)

    2. Esnure skaffold has read access from your registry where the images are stocker.

       1. Docker: login into docker with `docker login`
       2. GCP Artifact Registry: Read this [guide](https://cloud.google.com/artifact-registry/docs/docker/authentication)

    3. Update the location of images used in `skaffold.yaml` file to match where your images are stored

    4. Update all k8s deplyment yaml files that require `GCP_PROJECT_ID` with your GCP project ID.

    5. Update `/etc/hosts` file to add a custom hostname as `localhost` to match the config in `skaffold.yaml`

    ```bash
    # /etc/hosts
    127.0.0.1 ms-commerce.dev
    ```

    6. Run `skaffold dev`

    This command should start all microservices with their endpoints under a custom hostname as specified in `skaffold.yaml` file.
