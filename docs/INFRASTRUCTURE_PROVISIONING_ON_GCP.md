### Infrastructure Provisioning on GCP

> These steps are performed manually as of now.

1. Install [gcloud CLI](https://cloud.google.com/sdk/docs/install)

   ```bash
   gcloud init # initialize gcloud
   gcloud auth application-default login
   gcloud config set container/use_application_default_credentials true
   ```

2. Use default project or create a new project and connect a billing account

   ```bash
       gcloud projects create [PROJECT_ID] [--name=NAME] [--organization=ORGANIZATION_ID] [--set-as-default]
       # Link billing account via Cloud Console
   ```

3. default `gcloud` default config for future use

   ```bash
   gcloud config set compute/region [REGION]
   gcloud config set compute/zone [ZONE]
   ```

4. Enable and configure Artifact Registry

   1. Enable Artifact Registry API and create a new repository

      ```bash
      gcloud services enable artifactregistry.googleapis.com
      ```

   2. Create repository

   ```bash
    gcloud artifacts repositories create [REPOSITORY] [--repository-format=FORMAT] [--location=LOCATION]
   ```

   2. build and push docker images to the repository following [the setup instructions](https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling)
      **Note**: Ensure you build the image according to the architecture of the runner. Better to build the image in your CI rather than locally.

5. Create GKE Cluster

   1. Enable Kubernetes Engine API

   ```bash
   gcloud services enable container.googleapis.com
   ```

   2. Create an autopilot kubernetes cluster (recommended)

   ```bash
   # You can get the gcloud command arguments from Cloud Console
   gcloud container --project [PROJECT_ID] clusters create-auto [CLUSTER_NAME] --region [REGION] --release-channel [CHANNEL] --network [NETWORK] --subnetwork [SUBNETWORK] --cluster-ipv4-cidr [CLUSTER_IPV4] --services-ipv4-cidr [SERVICES_IPV4]
   ```

   3. Connect to cluster

      ```bash
      gcloud container clusters get-credentials [CLUSTER_NAME] --region [REGION] --project [PROJECT_ID]
      ```

   4. Switch to the correct context

      ```bash
         # see all the available context
         kubectl config get-contexts

         # pick the context you want to currently use
         kubectl config use-context [CONTEXT_NAME]

         # display the current context
         kubectl config current-context
      ```

6. Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
   ```

7. create JWT_KEY as a secret

   ```bash
   kubectl create secret generic jwt-secret --from-literal=JWT_KEY={YOUR_JWT_KEY_HERE}
   ```

8. Create PostgreSQL databases with Cloud SQL

   ```bash
        # Create PostgreSQL instances
       gcloud sql instances create [INSTNACE_NAME] \
       --database-version=[DATABASE_VERSION] \
       --cpu=[CPU_COUNT] \
       --memory=[MEMORY_COUNT] \
       --region=[REGION] \
       --root-password=[DB_ROOT_PASSWORD] \
       --storage-size=[STORAGE_SIZE_GB] \
       [--storage-auto-increase] \
       [--storage-auto-increase-limit]

       # Create PostgreSQL databases
       gcloud sql databases create [DATABASE_NAME] --instance=[INSTANECE_NAME]

       # Create PostgreSQL instance user
       gcloud sql users create [USER_NAME] --instance=[INSTANCE_NAME] --password=[PASSWORD]
   ```

9. Connect PostgreSQL database with k8s deployments following [this guide](https://cloud.google.com/sql/docs/postgres/connect-instance-kubernetes)

   - Create DATABASE_URL as secret

   ```bash
   kubectl create secret generic [SECRET_NAME] --from-literal=[DATABASE_URL_KEY]={DATABASE_URL_VALUE}
   ```

   **Notes**:

   - `auth` service expect `DATABASE_URL`
   - `cartx` service expect `DATABASE_URL_CART`

10. Enable and configure Cloud Pub/Sub

    1. Enable Cloud Pub/Sub API

    ```bash
    gcloud services enable pubsub.googleapis.com
    ```

    2. Create needed topics

    ```bash
    gcloud pubsub topics create [TOPIC_ID] --message-encoding=[ENCODING_TYPE]  --schema=[SCHEMA_ID]
    ```

    3. Create needed subscriptions [Pull or Push]

11. Allow KGE workloads to connect Cloud Pub/Sub via [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)

    - Make sure to use the kuberentes service account you create in all services which needs to connect to Cloud Pub/Sub and annotate it properly as described.

12. Apply Kubernetes manifests

    ```bash
    kubectl apply -f infa/k8s
    ```

13. point your domain name to ingress load balancer external IP address.
