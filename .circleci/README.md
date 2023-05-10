### CircleCI setup

1.  Connect Github repo to CircleCI.

2.  Add required env variables using CircleCI UI (steps detailed below)

    - `JWT_KEY`
    - `GCLOUD_SERVICE_KEY_PROD`
    - `GCLOUD_SERVICE_KEY_STAGING`
    - `TERRAFORM_SERVICE_KEY_PROD`
    - `TERRAFORM_SERVICE_KEY_STAGING`

3.  Add required env variables to both staging and production env files located at `.circleci/.env.{env}`

    - `GOOGLE_COMPUTE_ZONE`
    - `GOOGLE_COMPUTE_REGION`
    - `GOOGLE_PROJECT_ID`
    - `CLUSTER_NAME`
    - `REGISTRY_URL`
    - `REPO_NAME`
    - `KEYRING_NAME`
    - `KEY_NAME`
    - `GCP_JSON_KEY_ENV_VAR_NAME`
    - `TERRAFORM_JSON_KEY_ENV_VAR_NAME`

4.  Add `GCLOUD_SERVICE_KEY_PROD` and `GCLOUD_SERVICE_KEY_STAGING` to authenticate CI with Artifact Registry & Kubernetes Engine on production and staging envs respectively

    Create a key for each service account created by terraform and add the content of the JSON as env variables.

5.  Add `TERRAFORM_SERVICE_KEY_PROD` and `TERRAFORM_SERVICE_KEY_STAGING` to authenticate terraform to the corresponding GCP project

    Steps are detailed [here](../infra/terraform/README.md#terraform-cicd-pipeline)
