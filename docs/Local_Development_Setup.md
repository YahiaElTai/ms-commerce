### Local development setup

1.  Install required tools

    1. Install [Docker for Desktop](https://www.docker.com/products/docker-desktop/) and enable kubernetes.

    2. Install [gcloud CLI](https://cloud.google.com/sdk/docs/install)

       ```bash
       gcloud init # initialize gcloud
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

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
    ```

3.  Add environment variables
    Replace `.env.template` with `.env` and add the required variables.

    ```bash
    # host.docker.internal is required instead of localhost so skaffold can connect to docker-compose
    DATABASE_URL=postgresql://[DB_USER]:[DB_PASSWORD]@host.docker.internal:[DB_PORT]/[DB]
    JWT_KEY=[RANDOM_STRING_HERE]
    ```

4.  configure Cloud Pub/Sub for the services that needs it

    GCP recommends to use the Pub/Sub Emulator for local development but for now we are connecting directly to Google Cloud.

    1. Create a project on GCP and enable Cloud Pub/Sub API

    2. Create Cloud Pub/Sub topics that you require for the application from the [Google Cloud Console](https://console.cloud.google.com/cloudpubsub/topic/list)

    3. Authenticate to Cloud Pub/Sub

       Refer to [this guide](https://cloud.google.com/kubernetes-engine/docs/tutorials/authenticating-to-cloud-platform)

5.  Install and configure `skaffold`

    1. Install [skaffold](https://skaffold.dev)

    2. Update `/etc/hosts` file to add a custom hostname as `ms-commerce.dev` to match the config in `skaffold.yaml`

    ```bash
    # /etc/hosts
    127.0.0.1 ms-commerce.dev
    ```

6.  Start

    **Option 1**: Start all services together

    ```bash
    # Start `docker-compose` in each service
    docker-compose up -d

    # Deploy Prisma database to apply all migrations in each service
    npm run prisma:dev

    # Start skaffold from project root dir
    skaffold dev
    ```

    ***

    **Option 2**: Start a single service

    ```bash
    # Run this command within the service you want to work on
    docker-compose up -d

    # Deploy Prisma database to apply all migrations within the service you want to work on
    npm run prisma:dev

    # Run this command within the service you want to work on
    npm run start:dev
    ```
