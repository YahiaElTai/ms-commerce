### CircleCI setup

1.  Connect Github repo to CircleCI.

2.  Add required env variables:

    - `GCLOUD_SERVICE_KEY`: See below for setup
    - `GOOGLE_COMPUTE_ZONE`
    - `GOOGLE_COMPUTE_REGION`
    - `GOOGLE_PROJECT_ID`
    - `CLUSTER_NAME`
    - `REGISTRY_URL`
    - `REPO_NAME`
    - `JWT_KEY`

3.  Add `GCLOUD_SERVICE_KEY` env variable to authenticate CI with Artifact Registry & Kubernetes Engine

    1.  Create service account and add the required roles to it.

        Handled with Terraform

    2.  Create key file in JSON format and download it.

    3.  Create env variable in CircleCI GCLOUD_SERVICE_KEY with the content of the file downloaded as is.
