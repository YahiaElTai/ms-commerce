## Local development setup

1. Initial Kafka Setup

   1. Sign up for an account at [Confluent Cloud](https://www.confluent.io) and install [Confluent Cloud CLI](https://docs.confluent.io/confluent-cli/current/overview.html)

   2. Login with CLI

   `confluent login`

   4. Create Kafka cluster

   `confluent kafka cluster create [CLUSTER_NAME] --cloud gcp --region europe-west1`

   5. Create required topics

   `confluent kafka topic create [TOPIC_NAME] --partitions 1 --if-not-exists --cluster [CLUSTER_ID]`

   6. Add Kafka broker, API key and secret to `.env` files where needed

2. Atlas MongoDB setup

   1. Sign up for [Atlas](https://www.mongodb.com/atlas/database)

   2. Create a database and a new user

   3. Allow access to database through network settings

   4. Copy connection URL as DATABASE_URL in `.env` files

3. Start local development

There are 2 options to start developing locally:

1. Start a single service
2. Start all services with skaffold (requires a local kubernetes cluster)

#### Option 1: Start a single service

1. Add environment variables

   Replace `.env.template` with `.env` and add the required variables.

   Ensure all env variables are filled in.

2. Start a service

   ```bash
   cd services/{service}

   pnpm install

   pnpm dev
   ```

#### Option 2: Start all services with skaffold

1. Install required tools

   1. Install [Docker for Desktop](https://www.docker.com/products/docker-desktop/) and enable kubernetes.

   2. Install [kubectl](https://kubernetes.io/docs/tasks/tools/)

      If you have kubernetes enabled in Docker for Desktop then `docker-desktop` context should be the active context

      ```bash
      # see all the available context
      $ kubectl config get-contexts
      # pick the context you want to currently use
      $ kubectl config use-context <context-name>

      # extra: see detailed list of config/contexts
      $ kubectl config view
      ```

   3. Install [helm](https://helm.sh/)

2. Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) chart

   ```bash
      helm upgrade --install ingress-nginx ingress-nginx \
      --repo https://kubernetes.github.io/ingress-nginx \
      --namespace ingress-nginx --create-namespace
   ```

3. Add environment variables
   Replace `.env.template` with `.env` and add the required variables.

   Ensure all env variables are filled in.

4. Install and configure `skaffold`

   1. Install [skaffold](https://skaffold.dev)

   2. Update `/etc/hosts` file to add a custom hostname as `ms-commerce.dev` to match the config in `skaffold.yaml`

   ```bash
   # /etc/hosts
   127.0.0.1 ms-commerce.dev
   ```

5. Start skaffold

   `skaffold dev`

#### Git Hooks

[pre-commit](https://pre-commit.com/) is setup for linting and formatting a few different file extensions.

**Installation**

```bash
# Install pre-commit
brew install pre-commit

# Shellcheck is required
brew install shellcheck

# install required hooks
pre-commit install
```
