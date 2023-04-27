### Infrastructure Provisioning on GCP (Terraform)

1. Create GCP project and connect a billing account via the Console

2. Add required environment variables for CI. Docs can be found [here](../.circleci/README.md)

3. Make sure the secrets are encrypted using the newly created KMS key

4. point your domain name to ingress load balancer external IP address.

All other steps required are handled via Terraform in [this file](../infra/terraform/main.tf)

### Helpful links

- [Terraform google provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [gcloud CLI](https://cloud.google.com/sdk/docs/install)
- [helm](https://helm.sh/)
- [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)
- [Encrypting secrets with KMS](https://cloud.google.com/kubernetes-engine/docs/how-to/encrypting-secrets)
- [Building and pushing images](https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling)
