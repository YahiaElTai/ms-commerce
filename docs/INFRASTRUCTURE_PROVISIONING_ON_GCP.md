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

6. Install [helm](https://helm.sh/)

7. Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) chart

   ```bash
      helm upgrade --install ingress-nginx ingress-nginx \
      --repo https://kubernetes.github.io/ingress-nginx \
      --namespace ingress-nginx --create-namespace
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

   **Note**: Ensure gcloud service account is connected to all k8s service account that uses it.

10. Create key ring and key for KMS encryption for helm secrets
    Follow [this guide](https://cloud.google.com/kubernetes-engine/docs/how-to/encrypting-secrets)

11. Install helm charts on CI

12. point your domain name to ingress load balancer external IP address.
