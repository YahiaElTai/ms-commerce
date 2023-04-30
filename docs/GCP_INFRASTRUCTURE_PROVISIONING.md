### GCP Infrastructure Provisioning (Terraform)

1. Create GCP project and connect a billing account via the Console

2. Add required environment variables for CI. Docs can be found [here](../.circleci/README.md)

3. Kafka setup

   1. Sign up for an account at [Confluent Cloud](https://www.confluent.io) and install [Confluent Cloud CLI](https://docs.confluent.io/confluent-cli/current/overview.html)

   2. Login with CLI

   `confluent login`

   4. Create Kafka cluster

   `confluent kafka cluster create [CLUSTER_NAME] --cloud gcp --region europe-west1`

   5. Create required topics

   `confluent kafka topic create [TOPIC_NAME] --partitions 1 --if-not-exists --cluster [CLUSTER_ID]`

   6. Add Kafka broker, API key and secret to k8s secrets and encrypt them with KMS

4. Atlas MongoDB setup

   1. Sign up for [Atlas](https://www.mongodb.com/atlas/database)

   2. Create a database and a new user

   3. Allow access to database through network settings

   4. Copy connection URL as DATABASE_URL in k8s secrets and encypt it with KMS

5. Make sure the secrets are encrypted using the newly created KMS key for the intended env

6. point your domain name to ingress load balancer external IP address.

All other steps required are handled via Terraform in [this file](../infra/terraform/main.tf) documented [here](/infra/terraform/README.md)

### Helpful links

- [Terraform google provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [gcloud CLI](https://cloud.google.com/sdk/docs/install)
- [helm](https://helm.sh/)
- [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)
- [Encrypting secrets with KMS](https://cloud.google.com/kubernetes-engine/docs/how-to/encrypting-secrets)
- [Building and pushing images](https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling)
