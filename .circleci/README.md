### CircleCI setup

1.  Connect Github repo to CircleCI.

2.  Add required env variables using CircleCI UI:

    - `JWT_KEY`
    - `GCLOUD_SERVICE_KEY_PROD`: See below for setup
    - `GCLOUD_SERVICE_KEY_STAGING`: See below for setup

3.  Add required env variables to both staging and production env files located at `.circleci/.env.{env}`

    - `GOOGLE_COMPUTE_ZONE`
    - `GOOGLE_COMPUTE_REGION`
    - `GOOGLE_PROJECT_ID`
    - `CLUSTER_NAME`
    - `REGISTRY_URL`
    - `REPO_NAME`

4.  Add `GCLOUD_SERVICE_KEY_PROD` and `GCLOUD_SERVICE_KEY_STAGING` to authenticate CI with Artifact Registry & Kubernetes Engine on production and staging envs respectively

    1.  Create service account and add the required roles to it.

        Handled with Terraform (per env)

    2.  Create key file in JSON format and download it.

    3.  Create 2 env variables with the content of the files downloaded as is.
